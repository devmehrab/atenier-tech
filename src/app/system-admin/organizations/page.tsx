import { requireSystemAdmin } from "@/lib/auth/guards";
import { listAllOrganizationsAdmin } from "@/lib/services/admin.service";
import { OrgManagementClient } from "./OrgManagementClient";

interface AdminOrgsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: "Agencies & Organizations | System Admin",
};

export default async function SystemAdminOrgsPage({
  searchParams,
}: AdminOrgsPageProps) {
  await requireSystemAdmin();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const status = resolvedParams.status as any;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const { organizations, total, totalPages } = await listAllOrganizationsAdmin({
    search,
    status,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          Agencies & Organizations
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Oversight and moderation of all {total} tenant organizations
        </p>
      </div>

      <OrgManagementClient
        organizations={organizations}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={search}
      />
    </div>
  );
}
