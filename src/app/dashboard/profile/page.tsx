import { requireOrganizationOwner } from "@/lib/auth/guards";
import { getOrganizationById } from "@/lib/services/organization.service";
import { ProfileClientForm } from "./ProfileClientForm";

export const metadata = {
  title: "Agency Branding & Profile | Dashboard",
};

export default async function DashboardProfilePage() {
  const session = await requireOrganizationOwner();
  const organization = await getOrganizationById(session.organizationId!);

  if (!organization) {
    throw new Error("Organization not found");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Agency Profile & Branding
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your public website presentation, logos, cover imagery, and contact details
        </p>
      </div>

      <ProfileClientForm initialData={organization} />
    </div>
  );
}

