import Link from "next/link";
import { getPlatformMetrics } from "@/lib/services/admin.service";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import {
  Building,
  Users,
  Home,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default async function SystemAdminOverviewPage() {
  const metrics = await getPlatformMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 mb-2">
            <ShieldAlert className="h-3.5 w-3.5" />
            Global Platform Admin
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            System Administration Console
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Global metrics, tenant oversight, security audits, and moderation controls
          </p>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-1.5">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Agencies"
          value={metrics.totalOrganizations}
          description={`${metrics.activeOrganizations} active tenants`}
          icon={Building}
          color="emerald"
        />
        <StatsCard
          title="Platform Users"
          value={metrics.totalUsers}
          description="Owners, agents, & admins"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total Listings"
          value={metrics.totalProperties}
          description={`${metrics.publishedProperties} published live`}
          icon={Home}
          color="amber"
        />
        <StatsCard
          title="Total Leads Captured"
          value={metrics.totalLeads}
          description="Buyer & tenant inquiries"
          icon={MessageSquare}
          color="purple"
        />
      </div>

      {/* Moderation Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">Manage Agencies</h3>
            <p className="text-xs text-neutral-500 mt-1">
              View registered tenant organizations, inspect slugs, activate or suspend organizations.
            </p>
          </div>
          <Link href="/system-admin/organizations" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span>View All Agencies</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">User Management</h3>
            <p className="text-xs text-neutral-500 mt-1">
              View all platform users, promote/demote roles, and disable offending accounts.
            </p>
          </div>
          <Link href="/system-admin/users" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span>View All Users</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">Content Moderation</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Inspect global listings across all organizations and remove fraudulent or inappropriate posts.
            </p>
          </div>
          <Link href="/system-admin/properties" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span>Inspect Listings</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
