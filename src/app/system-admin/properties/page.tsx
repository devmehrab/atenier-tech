import { requireSystemAdmin } from "@/lib/auth/guards";
import { listAllPropertiesAdmin } from "@/lib/services/admin.service";
import { PropertyModerationClient } from "./PropertyModerationClient";

interface AdminPropertiesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: "Property Moderation | System Admin",
};

export default async function SystemAdminPropertiesPage({
  searchParams,
}: AdminPropertiesPageProps) {
  await requireSystemAdmin();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const { properties, total, totalPages } = await listAllPropertiesAdmin({
    search,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Property Moderation
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Inspect and moderate all {total} listings published across all agencies
        </p>
      </div>

      <PropertyModerationClient
        properties={properties}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={search}
      />
    </div>
  );
}
