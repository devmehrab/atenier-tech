import { connectToDatabase } from "@/lib/db/connection";
import { Organization } from "@/lib/db/models/Organization";
import { User } from "@/lib/db/models/User";
import { Property } from "@/lib/db/models/Property";
import { Lead } from "@/lib/db/models/Lead";
import {
  IOrganization,
  IUser,
  IProperty,
  OrganizationStatus,
  UserStatus,
  UserRole,
} from "@/lib/types";
import { deleteImageServer } from "@/lib/cloudinary";

export async function getPlatformMetrics() {
  await connectToDatabase();

  const [
    totalOrganizations,
    activeOrganizations,
    totalUsers,
    totalProperties,
    publishedProperties,
    totalLeads,
  ] = await Promise.all([
    Organization.countDocuments(),
    Organization.countDocuments({ status: "ACTIVE" }),
    User.countDocuments(),
    Property.countDocuments(),
    Property.countDocuments({ status: "PUBLISHED" }),
    Lead.countDocuments(),
  ]);

  return {
    totalOrganizations,
    activeOrganizations,
    totalUsers,
    totalProperties,
    publishedProperties,
    totalLeads,
  };
}

export async function listAllOrganizationsAdmin(params: {
  search?: string;
  status?: OrganizationStatus;
  page?: number;
  limit?: number;
}) {
  await connectToDatabase();
  const { search, status, page = 1, limit = 20 } = params;

  const query: Record<string, any> = {};
  if (status) query.status = status;
  if (search) {
    const reg = new RegExp(search, "i");
    query.$or = [{ name: reg }, { slug: reg }, { email: reg }, { city: reg }];
  }

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Organization.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Organization.countDocuments(query),
  ]);

  const organizations = docs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    ownerId: doc.ownerId.toString(),
  })) as unknown as IOrganization[];

  return { organizations, total, page, totalPages: Math.ceil(total / limit) || 1 };
}

export async function toggleOrganizationStatus(
  orgId: string,
  newStatus: OrganizationStatus
) {
  await connectToDatabase();
  await Organization.findByIdAndUpdate(orgId, { status: newStatus });
  return true;
}

export async function deleteOrganizationAdmin(orgId: string) {
  await connectToDatabase();
  // Clean up all organization properties and users
  const properties = await Property.find({ organizationId: orgId });
  for (const prop of properties) {
    if (prop.images?.length) {
      await Promise.all(prop.images.map((img) => deleteImageServer(img.publicId)));
    }
  }
  await Property.deleteMany({ organizationId: orgId });
  await User.deleteMany({ organizationId: orgId });
  await Organization.findByIdAndDelete(orgId);
  return true;
}

export async function listAllUsersAdmin(params: {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}) {
  await connectToDatabase();
  const { search, role, page = 1, limit = 20 } = params;

  const query: Record<string, any> = {};
  if (role) query.role = role;
  if (search) {
    const reg = new RegExp(search, "i");
    query.$or = [{ name: reg }, { email: reg }, { phone: reg }];
  }

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    User.find(query)
      .select("-passwordHash")
      .populate("organizationId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  const users = docs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    organizationId: doc.organizationId ? (doc.organizationId as any)._id?.toString() || doc.organizationId.toString() : null,
    organizationName: doc.organizationId ? (doc.organizationId as any).name : null,
  })) as unknown as IUser[];

  return { users, total, page, totalPages: Math.ceil(total / limit) || 1 };
}

export async function toggleUserStatus(userId: string, newStatus: UserStatus) {
  await connectToDatabase();
  await User.findByIdAndUpdate(userId, { status: newStatus });
  return true;
}

export async function updateUserRoleAdmin(userId: string, newRole: UserRole) {
  await connectToDatabase();
  await User.findByIdAndUpdate(userId, { role: newRole });
  return true;
}

export async function listAllPropertiesAdmin(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  await connectToDatabase();
  const { search, page = 1, limit = 20 } = params;

  const query: Record<string, any> = {};
  if (search) {
    const reg = new RegExp(search, "i");
    query.$or = [{ title: reg }, { "location.city": reg }, { "location.address": reg }];
  }

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Property.find(query)
      .populate("organizationId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(query),
  ]);

  const properties = docs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    organizationId: doc.organizationId ? (doc.organizationId as any)._id?.toString() || doc.organizationId.toString() : "",
    organizationName: doc.organizationId ? (doc.organizationId as any).name : "Unknown",
    organizationSlug: doc.organizationId ? (doc.organizationId as any).slug : "",
  }));

  return { properties, total, page, totalPages: Math.ceil(total / limit) || 1 };
}

export async function deletePropertyAdmin(propertyId: string) {
  await connectToDatabase();
  const prop = await Property.findById(propertyId);
  if (!prop) return false;

  if (prop.images?.length) {
    await Promise.all(prop.images.map((img) => deleteImageServer(img.publicId)));
  }

  await Property.findByIdAndDelete(propertyId);
  return true;
}
