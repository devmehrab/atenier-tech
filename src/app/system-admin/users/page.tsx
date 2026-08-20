import { requireSystemAdmin } from "@/lib/auth/guards";
import { listAllUsersAdmin } from "@/lib/services/admin.service";
import { UserManagementClient } from "./UserManagementClient";

interface AdminUsersPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: "User Management | System Admin",
};

export default async function SystemAdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  await requireSystemAdmin();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const role = resolvedParams.role as any;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const { users, total, totalPages } = await listAllUsersAdmin({
    search,
    role,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Platform Users
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Global accounts across all organizations ({total} total users)
        </p>
      </div>

      <UserManagementClient
        users={users}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={search}
      />
    </div>
  );
}
