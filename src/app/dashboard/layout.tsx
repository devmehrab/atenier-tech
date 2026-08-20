import { requireOrganizationAccess } from "@/lib/auth/guards";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export const metadata = {
  title: "Agency Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireOrganizationAccess();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sticky Desktop Sidebar */}
      <DashboardSidebar user={session} />

      {/* Main App Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader user={session} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

