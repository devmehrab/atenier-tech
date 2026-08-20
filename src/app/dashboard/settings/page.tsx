import { requireOrganizationOwner } from "@/lib/auth/guards";
import { getOrganizationById } from "@/lib/services/organization.service";
import { SettingsClientForm } from "./SettingsClientForm";

export const metadata = {
  title: "Agency Settings | Dashboard",
};

export default async function DashboardSettingsPage() {
  const session = await requireOrganizationOwner();
  const organization = await getOrganizationById(session.organizationId!);

  if (!organization) {
    throw new Error("Organization not found");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Agency Settings & Preferences
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure default measurement units, currency, and multi-agent publishing controls
        </p>
      </div>

      <SettingsClientForm initialData={organization} />
    </div>
  );
}

