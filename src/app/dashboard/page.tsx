import Link from "next/link";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { getDashboardStats } from "@/lib/services/property.service";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PropertyTable } from "@/components/dashboard/PropertyTable";
import { Button } from "@/components/ui/button";
import {
  Home,
  CheckCircle,
  FileEdit,
  DollarSign,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  Users,
  Building,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await requireOrganizationAccess();
  const stats = await getDashboardStats(session.organizationId!);
  const serializedProperties = JSON.parse(JSON.stringify(stats.recentProperties));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Welcome back, {session.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Agency Management Overview for{" "}
            <span className="font-bold text-foreground">{session.organizationName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {session.organizationSlug && (
            <Link href={`/${session.organizationSlug}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-4 w-4" />
                Live Website
              </Button>
            </Link>
          )}
          <Link href="/dashboard/properties/new">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <PlusCircle className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatsCard
          title="Total Properties"
          value={stats.total}
          description="All portfolio listings"
          icon={Home}
          color="emerald"
        />
        <StatsCard
          title="Published"
          value={stats.published}
          description="Active on public website"
          icon={CheckCircle}
          color="emerald"
        />
        <StatsCard
          title="Drafts"
          value={stats.draft}
          description="Pending review"
          icon={FileEdit}
          color="amber"
        />
        <StatsCard
          title="Sold"
          value={stats.sold}
          description="Closed sale transactions"
          icon={DollarSign}
          color="blue"
        />
        <StatsCard
          title="Rented"
          value={stats.rented}
          description="Active tenant leases"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Recent Properties Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Listings</h2>
            <p className="text-xs text-muted-foreground">
              Latest properties added to your agency portfolio
            </p>
          </div>
          <Link href="/dashboard/properties">
            <Button variant="ghost" size="sm" className="text-xs text-primary font-semibold hover:text-primary/80 self-start sm:self-auto px-0 sm:px-3">
              View All Properties →
            </Button>
          </Link>
        </div>

        <PropertyTable
          properties={serializedProperties as any}
          tenantSlug={session.organizationSlug}
        />
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/60">
        <Link
          href="/dashboard/properties/new"
          className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <PlusCircle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-card-foreground">Create New Listing</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload photos to Cloudinary, configure amenities, set price and publish instantly.
          </p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Building className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-card-foreground">Agency Branding & Logo</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Customize logo, cover hero imagery, WhatsApp contact number, and theme colors.
          </p>
        </Link>

        <Link
          href="/dashboard/team"
          className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-card-foreground">Manage Team & Agents</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Invite licensed agents to publish and manage listings under your agency handle.
          </p>
        </Link>
      </div>
    </div>
  );
}

