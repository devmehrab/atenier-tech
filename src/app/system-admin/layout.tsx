import { requireSystemAdmin } from "@/lib/auth/guards";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "System Administration | Platform Console",
};

export default async function SystemAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSystemAdmin();

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar user={session} />
      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
