import { requireOrganizationAccess } from "@/lib/auth/guards";
import { PropertyForm } from "@/components/dashboard/PropertyForm";

export const metadata = {
  title: "Create Property Listing | Dashboard",
};

export default async function NewPropertyPage() {
  const session = await requireOrganizationAccess();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Create Property Listing
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a new real estate listing to {session.organizationName}
        </p>
      </div>

      <PropertyForm
        mode="create"
        tenantSlug={session.organizationSlug}
      />
    </div>
  );
}

