import { connectToDatabase } from "@/lib/db/connection";
import { Organization } from "@/lib/db/models/Organization";
import { User } from "@/lib/db/models/User";
import { IOrganization, ISessionUser } from "@/lib/types";
import { OrgUpdateInput } from "@/lib/validations/organization";

export async function getOrganizationBySlug(slug: string): Promise<IOrganization | null> {
  await connectToDatabase();
  const org = await Organization.findOne({
    slug: slug.toLowerCase(),
    status: "ACTIVE",
  }).lean();

  if (!org) return null;

  return {
    ...org,
    _id: org._id.toString(),
    ownerId: org.ownerId.toString(),
  } as unknown as IOrganization;
}

export async function getOrganizationById(id: string): Promise<IOrganization | null> {
  await connectToDatabase();
  const org = await Organization.findById(id).lean();
  if (!org) return null;

  return {
    ...org,
    _id: org._id.toString(),
    ownerId: org.ownerId.toString(),
  } as unknown as IOrganization;
}

export async function updateOrganizationProfile(
  orgId: string,
  input: Partial<OrgUpdateInput>,
  sessionUser: ISessionUser
): Promise<IOrganization> {
  await connectToDatabase();

  // Enforce tenant boundary: user must be owner or system admin of target organization
  if (
    sessionUser.role !== "SYSTEM_ADMIN" &&
    (sessionUser.organizationId !== orgId || sessionUser.role !== "OWNER")
  ) {
    throw new Error("Forbidden: Unauthorized organization update");
  }

  const org = await Organization.findById(orgId);
  if (!org) {
    throw new Error("Organization not found");
  }

  // Check slug uniqueness if changed
  if (input.slug && input.slug !== org.slug) {
    const slugTaken = await Organization.exists({
      slug: input.slug.toLowerCase(),
      _id: { $ne: org._id },
    });
    if (slugTaken) {
      throw new Error("This organization URL handle is already taken. Please choose another.");
    }
    org.slug = input.slug.toLowerCase();
  }

  if (input.name) org.name = input.name;
  if (input.description !== undefined) org.description = input.description;
  if (input.phone !== undefined) org.phone = input.phone;
  if (input.email !== undefined) org.email = input.email;
  if (input.whatsapp !== undefined) org.whatsapp = input.whatsapp;
  if (input.address !== undefined) org.address = input.address;
  if (input.city !== undefined) org.city = input.city;
  if (input.country !== undefined) org.country = input.country;
  if (input.logo !== undefined) org.logo = input.logo;
  if (input.coverImage !== undefined) org.coverImage = input.coverImage;
  if (input.socialLinks) org.socialLinks = { ...org.socialLinks, ...input.socialLinks };
  if (input.branding) org.branding = { ...org.branding, ...input.branding };
  if (input.settings) org.settings = { ...org.settings, ...input.settings };

  await org.save();

  return org.toJSON() as unknown as IOrganization;
}

export async function listActiveOrganizations(): Promise<IOrganization[]> {
  await connectToDatabase();
  const orgs = await Organization.find({ status: "ACTIVE" })
    .sort({ createdAt: -1 })
    .lean();

  return orgs.map((org) => ({
    ...org,
    _id: org._id.toString(),
    ownerId: org.ownerId.toString(),
  })) as unknown as IOrganization[];
}
