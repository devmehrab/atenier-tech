import Image from "next/image";
import { IUser, IOrganization } from "@/lib/types";
import { Phone, Mail, MessageSquare, Award, UserCheck } from "lucide-react";

interface AgentCardProps {
  agent?: IUser | null;
  organization: IOrganization;
}

export function AgentCard({ agent, organization }: AgentCardProps) {
  const contactName = agent?.name || organization.name;
  const contactPhone = agent?.phone || organization.phone;
  const contactEmail = agent?.email || organization.email;
  const contactWhatsApp = organization.whatsapp || contactPhone;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {agent?.avatar ? (
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-primary shadow">
            <Image
              src={agent.avatar}
              alt={contactName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg border-2 border-primary/30">
            {contactName.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-base font-bold text-card-foreground">{contactName}</h4>
            <UserCheck className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            {agent ? `Certified Agent @ ${organization.name}` : `Agency Listing`}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {contactPhone && (
          <a
            href={`tel:${contactPhone}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-card py-2.5 px-4 text-sm font-semibold text-card-foreground hover:bg-muted shadow-sm transition-all"
          >
            <Phone className="h-4 w-4 text-primary" />
            Call {contactPhone}
          </a>
        )}

        {contactWhatsApp && (
          <a
            href={`https://wa.me/${contactWhatsApp.replace(/[^0-9]/g, "")}?text=Hello,%20I%20am%20inquiring%20about%20your%20property%20listing.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        )}

        {contactEmail && (
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border/60 bg-muted/50 py-2 px-4 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Email Us
          </a>
        )}
      </div>
    </div>
  );
}

