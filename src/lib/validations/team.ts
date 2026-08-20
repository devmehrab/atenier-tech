import { z } from "zod";

export const teamInviteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  role: z.enum(["OWNER", "AGENT"]).default("AGENT"),
  initialPassword: z.string().min(6, "Temporary password must be at least 6 characters"),
});

export type TeamInviteInput = z.infer<typeof teamInviteSchema>;

export const updateMemberRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(["OWNER", "AGENT"]),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
