import { requireOrganizationOwner } from "@/lib/auth/guards";
import { listTeamMembers } from "@/lib/services/user.service";
import { TeamClientView } from "./TeamClientView";

export const metadata = {
  title: "Team & Agents | Dashboard",
};

export default async function DashboardTeamPage() {
  const session = await requireOrganizationOwner();
  const members = await listTeamMembers(session.organizationId!, session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Team & Agent Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage licensed agents and team members for {session.organizationName}
        </p>
      </div>

      <TeamClientView
        initialMembers={members}
        currentUserId={session.userId}
      />
    </div>
  );
}

