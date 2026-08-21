import { notFound } from "next/navigation";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { getPropertyById } from "@/lib/services/property.service";
import { PropertyForm } from "@/components/dashboard/PropertyForm";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Property Listing | Dashboard",
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const session = await requireOrganizationAccess();

  // Strict tenant boundary: property must belong to user's organization
  const property = await getPropertyById(id, session);
  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          প্রপার্টি সম্পাদনা করুন: {property.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          স্পেসিফিকেশন, মূল্য, সুযোগ-সুবিধা, ছবি এবং লিস্টিং স্ট্যাটাস আপডেট করুন
        </p>
      </div>

      <PropertyForm
        initialData={property}
        mode="edit"
        tenantSlug={session.organizationSlug}
      />
    </div>
  );
}

