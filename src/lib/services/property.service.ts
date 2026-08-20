import { connectToDatabase } from "@/lib/db/connection";
import { Property, IPropertyDocument } from "@/lib/db/models/Property";
import { Organization } from "@/lib/db/models/Organization";
import { User } from "@/lib/db/models/User";
import {
  IProperty,
  IPropertyFilterParams,
  ISessionUser,
  PropertyStatus,
} from "@/lib/types";
import { slugify, generateRandomSuffix } from "@/lib/utils/slugify";
import { PropertyFormValues } from "@/lib/validations/property";
import { deleteImageServer } from "@/lib/cloudinary";
import mongoose from "mongoose";

/**
 * Lists properties with faceted search and filtering.
 * If scoped to a tenant (e.g. public storefront or tenant dashboard), organizationId is strictly enforced.
 */
export async function listProperties(
  params: IPropertyFilterParams,
  scopeOrganizationId?: string | null
): Promise<{ properties: IProperty[]; total: number; page: number; totalPages: number }> {
  await connectToDatabase();

  const {
    search,
    listingType,
    propertyType,
    status,
    city,
    area,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    sortBy = "newest",
    page = 1,
    limit = 12,
  } = params;

  const query: mongoose.FilterQuery<IPropertyDocument> = {};

  // Scope to organization if provided
  if (scopeOrganizationId) {
    query.organizationId = new mongoose.Types.ObjectId(scopeOrganizationId);
  } else if (params.organizationId) {
    query.organizationId = new mongoose.Types.ObjectId(params.organizationId);
  }

  // Status filtering
  if (status) {
    query.status = status;
  } else if (!scopeOrganizationId && !params.organizationId) {
    // Global public explore should only show published properties
    query.status = "PUBLISHED";
  }

  // Search keyword across title, description, city, area
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { "location.city": searchRegex },
      { "location.area": searchRegex },
      { "location.address": searchRegex },
    ];
  }

  if (listingType) query.listingType = listingType;
  if (propertyType) query.propertyType = propertyType;
  if (city) query["location.city"] = new RegExp(`^${city}$`, "i");
  if (area) query["location.area"] = new RegExp(`^${area}$`, "i");

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  if (bedrooms !== undefined && bedrooms > 0) {
    query["specifications.bedrooms"] = { $gte: bedrooms };
  }

  if (bathrooms !== undefined && bathrooms > 0) {
    query["specifications.bathrooms"] = { $gte: bathrooms };
  }

  // Sorting
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (sortBy === "price_asc") sortOption = { price: 1 };
  if (sortBy === "price_desc") sortOption = { price: -1 };
  if (sortBy === "popular") sortOption = { viewsCount: -1, createdAt: -1 };

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Property.find(query)
      .populate("organizationId", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(query),
  ]);

  const properties = docs.map((doc) => {
    const { _id, organizationId, ...rest } = doc;
    const orgObj =
      organizationId && typeof organizationId === "object" && "slug" in organizationId
        ? (organizationId as any)
        : null;

    return {
      _id: _id.toString(),
      organizationId: orgObj ? orgObj._id?.toString() || organizationId.toString() : organizationId?.toString() || "",
      organizationName: orgObj?.name || (doc as any).organizationName,
      organizationSlug: orgObj?.slug || (doc as any).organizationSlug,
      ...rest,
    } as unknown as IProperty;
  });

  return {
    properties,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Retrieves a single published property by agency slug and property slug for public storefront
 */
export async function getPublicPropertyBySlug(
  tenantSlug: string,
  propertySlug: string
): Promise<{ property: IProperty; organization: any; agent?: any } | null> {
  await connectToDatabase();

  const organization = await Organization.findOne({
    slug: tenantSlug.toLowerCase(),
    status: "ACTIVE",
  }).lean();

  if (!organization) return null;

  const propertyDoc = await Property.findOne({
    organizationId: organization._id,
    slug: propertySlug.toLowerCase(),
    status: { $in: ["PUBLISHED", "SOLD", "RENTED"] },
  }).lean();

  if (!propertyDoc) return null;

  // Increment views count asynchronously
  Property.updateOne({ _id: propertyDoc._id }, { $inc: { viewsCount: 1 } }).exec();

  let agent = null;
  if (propertyDoc.assignedAgent) {
    agent = await User.findById(propertyDoc.assignedAgent)
      .select("name email phone avatar")
      .lean();
  }

  const { _id, ...rest } = propertyDoc;
  const property = {
    _id: _id.toString(),
    ...rest,
  } as unknown as IProperty;

  return {
    property,
    organization: {
      ...organization,
      _id: organization._id.toString(),
      ownerId: organization.ownerId.toString(),
    },
    agent: agent ? { ...agent, _id: agent._id.toString() } : null,
  };
}

/**
 * Retrieves a single property for editing in dashboard (strictly tenant-guarded)
 */
export async function getPropertyById(
  propertyId: string,
  sessionUser: ISessionUser
): Promise<IProperty | null> {
  await connectToDatabase();

  const query: Record<string, any> = { _id: propertyId };
  if (sessionUser.role !== "SYSTEM_ADMIN") {
    if (!sessionUser.organizationId) return null;
    query.organizationId = sessionUser.organizationId;
  }

  const propertyDoc = await Property.findOne(query).lean();
  if (!propertyDoc) return null;

  const { _id, ...rest } = propertyDoc;
  return {
    _id: _id.toString(),
    ...rest,
  } as unknown as IProperty;
}

/**
 * Creates a new property listing scoped to user's organization
 */
export async function createProperty(
  input: PropertyFormValues,
  sessionUser: ISessionUser
): Promise<IProperty> {
  await connectToDatabase();

  if (!sessionUser.organizationId && sessionUser.role !== "SYSTEM_ADMIN") {
    throw new Error("Cannot create property without organization association");
  }

  const orgId = sessionUser.organizationId!;

  // Generate unique slug within the organization
  let baseSlug = slugify(input.title);
  let candidateSlug = baseSlug;
  let counter = 1;

  while (
    await Property.exists({
      organizationId: orgId,
      slug: candidateSlug,
    })
  ) {
    candidateSlug = `${baseSlug}-${counter}-${generateRandomSuffix(3)}`;
    counter++;
  }

  const featuredImg =
    input.featuredImage ||
    input.images.find((img) => img.isFeatured)?.secureUrl ||
    input.images[0]?.secureUrl ||
    "";

  const property = await Property.create({
    ...input,
    organizationId: orgId,
    createdBy: sessionUser.userId,
    assignedAgent: input.assignedAgent || sessionUser.userId,
    slug: candidateSlug,
    featuredImage: featuredImg,
    publishedAt: input.status === "PUBLISHED" ? new Date() : null,
  });

  const json = property.toJSON();
  return json as unknown as IProperty;
}

/**
 * Updates a property with strict tenant isolation check
 */
export async function updateProperty(
  propertyId: string,
  input: Partial<PropertyFormValues>,
  sessionUser: ISessionUser
): Promise<IProperty | null> {
  await connectToDatabase();

  const query: Record<string, any> = { _id: propertyId };
  if (sessionUser.role !== "SYSTEM_ADMIN") {
    if (!sessionUser.organizationId) return null;
    query.organizationId = sessionUser.organizationId;
  }

  const existing = await Property.findOne(query);
  if (!existing) {
    throw new Error("Property not found or unauthorized access");
  }

  // Update slug if title changed
  if (input.title && input.title !== existing.title) {
    let baseSlug = slugify(input.title);
    let candidateSlug = baseSlug;
    let counter = 1;

    while (
      await Property.exists({
        organizationId: existing.organizationId,
        slug: candidateSlug,
        _id: { $ne: existing._id },
      })
    ) {
      candidateSlug = `${baseSlug}-${counter}-${generateRandomSuffix(3)}`;
      counter++;
    }
    existing.slug = candidateSlug;
  }

  // Handle publishing timestamp
  if (input.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
    existing.publishedAt = new Date();
  }

  // Determine featured image
  if (input.images) {
    const featuredImg =
      input.featuredImage ||
      input.images.find((img) => img.isFeatured)?.secureUrl ||
      input.images[0]?.secureUrl ||
      "";
    existing.featuredImage = featuredImg;
  }

  Object.assign(existing, input);
  await existing.save();

  return existing.toJSON() as unknown as IProperty;
}

/**
 * Deletes a property with strict tenant isolation check
 */
export async function deleteProperty(
  propertyId: string,
  sessionUser: ISessionUser
): Promise<boolean> {
  await connectToDatabase();

  const query: Record<string, any> = { _id: propertyId };
  if (sessionUser.role !== "SYSTEM_ADMIN") {
    if (!sessionUser.organizationId) return false;
    query.organizationId = sessionUser.organizationId;
  }

  const property = await Property.findOne(query);
  if (!property) return false;

  // Cleanup Cloudinary images
  if (property.images && property.images.length > 0) {
    await Promise.all(
      property.images.map((img) => deleteImageServer(img.publicId))
    );
  }

  await Property.deleteOne({ _id: property._id });
  return true;
}

/**
 * Duplicates a property listing
 */
export async function duplicateProperty(
  propertyId: string,
  sessionUser: ISessionUser
): Promise<IProperty | null> {
  await connectToDatabase();

  const existing = await getPropertyById(propertyId, sessionUser);
  if (!existing) return null;

  const newTitle = `${existing.title} (Copy)`;
  let candidateSlug = slugify(newTitle);
  let counter = 1;

  while (
    await Property.exists({
      organizationId: existing.organizationId,
      slug: candidateSlug,
    })
  ) {
    candidateSlug = `${slugify(newTitle)}-${counter}`;
    counter++;
  }

  const copyData = {
    ...existing,
    _id: undefined,
    title: newTitle,
    slug: candidateSlug,
    status: "DRAFT" as PropertyStatus,
    viewsCount: 0,
    publishedAt: null,
    createdBy: sessionUser.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const created = await Property.create(copyData);
  return created.toJSON() as unknown as IProperty;
}

/**
 * Updates status of a property (e.g. mark as sold, published, draft)
 */
export async function updatePropertyStatus(
  propertyId: string,
  status: PropertyStatus,
  sessionUser: ISessionUser
): Promise<boolean> {
  await connectToDatabase();

  const query: Record<string, any> = { _id: propertyId };
  if (sessionUser.role !== "SYSTEM_ADMIN") {
    if (!sessionUser.organizationId) return false;
    query.organizationId = sessionUser.organizationId;
  }

  const update: Record<string, any> = { status };
  if (status === "PUBLISHED") {
    update.publishedAt = new Date();
  }

  const result = await Property.updateOne(query, { $set: update });
  return result.modifiedCount > 0;
}

/**
 * Retrieves dashboard stats for an organization
 */
export async function getDashboardStats(organizationId: string) {
  await connectToDatabase();

  const orgObjectId = new mongoose.Types.ObjectId(organizationId);

  const [total, published, draft, sold, rented, recentProperties] =
    await Promise.all([
      Property.countDocuments({ organizationId: orgObjectId }),
      Property.countDocuments({ organizationId: orgObjectId, status: "PUBLISHED" }),
      Property.countDocuments({ organizationId: orgObjectId, status: "DRAFT" }),
      Property.countDocuments({ organizationId: orgObjectId, status: "SOLD" }),
      Property.countDocuments({ organizationId: orgObjectId, status: "RENTED" }),
      Property.find({ organizationId: orgObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  return {
    total,
    published,
    draft,
    sold,
    rented,
    recentProperties: recentProperties.map((p) => ({
      ...p,
      _id: p._id.toString(),
      organizationId: p.organizationId.toString(),
    })),
  };
}
