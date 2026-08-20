"use server";

import { leadInquirySchema, LeadInquiryInput } from "@/lib/validations/lead";
import { createLead } from "@/lib/services/lead.service";
import { ActionResult } from "./auth.actions";

export async function submitLeadAction(
  data: LeadInquiryInput
): Promise<ActionResult> {
  try {
    const validated = leadInquirySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Please fill out all required fields properly",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await createLead(validated.data);

    return {
      success: true,
      message: "Thank you! Your inquiry has been sent to the agency. An agent will contact you shortly.",
    };
  } catch (error: any) {
    console.error("Lead submission error:", error);
    return {
      success: false,
      message: error.message || "Failed to submit inquiry. Please try again.",
    };
  }
}
