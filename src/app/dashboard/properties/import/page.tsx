import React from "react";
import { Metadata } from "next";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { BulkImportWizard } from "@/components/dashboard/import/BulkImportWizard";

export const metadata: Metadata = {
  title: "AI Bulk Property Import | Dashboard",
  description: "Bulk import properties from Facebook post captions using AI extraction",
};

export default async function BulkImportPage() {
  const session = await requireOrganizationAccess();

  return (
    <div className="space-y-6">
      <BulkImportWizard organizationSlug={session.organizationSlug} />
    </div>
  );
}
