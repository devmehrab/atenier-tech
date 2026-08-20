import { requireOrganizationAccess } from "@/lib/auth/guards";
import { listLeads } from "@/lib/services/lead.service";
import { formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { MessageSquare, Mail, Phone, Home } from "lucide-react";

export const metadata = {
  title: "Inquiries & Leads | Dashboard",
};

export default async function DashboardLeadsPage() {
  const session = await requireOrganizationAccess();
  const leads = await listLeads(session.organizationId!, session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Inquiries & Buyer Leads
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Direct messages and viewing inquiries received from your public storefront ({leads.length} total)
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 sm:p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-card-foreground">No leads received yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            When visitors inquire about your properties on your public storefront, their contact info and messages will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Contact</TableHead>
                <TableHead className="hidden sm:table-cell">Target Property</TableHead>
                <TableHead>Inquiry Message</TableHead>
                <TableHead className="hidden md:table-cell">Date Received</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead._id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-card-foreground">{lead.name}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${lead.email}`} className="hover:underline hover:text-primary">
                          {lead.email}
                        </a>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Phone className="h-3 w-3" />
                          <a href={`tel:${lead.phone}`} className="hover:underline hover:text-primary">
                            {lead.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {lead.propertyTitle ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Home className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{lead.propertyTitle}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">General Agency Inquiry</span>
                    )}
                  </TableCell>

                  <TableCell className="max-w-md">
                    <p className="text-xs text-card-foreground line-clamp-3 leading-relaxed">
                      {lead.message}
                    </p>
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </TableCell>

                  <TableCell>
                    <Badge variant={lead.status === "NEW" ? "default" : "secondary"}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

