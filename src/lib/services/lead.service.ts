import { connectToDatabase } from "@/lib/db/connection";
import { Lead } from "@/lib/db/models/Lead";
import { ILead, ISessionUser } from "@/lib/types";
import { LeadInquiryInput } from "@/lib/validations/lead";
import mongoose from "mongoose";

export async function createLead(input: LeadInquiryInput): Promise<ILead> {
  await connectToDatabase();

  const lead = await Lead.create({
    organizationId: input.organizationId,
    propertyId: input.propertyId || null,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    message: input.message,
    status: "NEW",
  });

  return lead.toJSON() as unknown as ILead;
}

export async function listLeads(
  organizationId: string,
  sessionUser: ISessionUser
): Promise<ILead[]> {
  await connectToDatabase();

  if (
    sessionUser.role !== "SYSTEM_ADMIN" &&
    sessionUser.organizationId !== organizationId
  ) {
    throw new Error("Forbidden: Cannot access other organization's leads");
  }

  const leads = await Lead.find({
    organizationId: new mongoose.Types.ObjectId(organizationId),
  })
    .populate("propertyId", "title slug")
    .sort({ createdAt: -1 })
    .lean();

  return leads.map((l) => ({
    ...l,
    _id: l._id.toString(),
    organizationId: l.organizationId.toString(),
    propertyId: l.propertyId ? (l.propertyId as any)._id?.toString() || l.propertyId.toString() : null,
    propertyTitle: l.propertyId ? (l.propertyId as any).title : undefined,
    propertySlug: l.propertyId ? (l.propertyId as any).slug : undefined,
  })) as unknown as ILead[];
}
