import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/lib/services/organization.service";
import { AgentCard } from "@/components/tenant/AgentCard";
import { WhatsAppButton } from "@/components/tenant/WhatsAppButton";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/motion";

interface TenantContactPageProps {
  params: Promise<{ tenant: string }>;
}

export async function generateMetadata({ params }: TenantContactPageProps) {
  const { tenant } = await params;
  const org = await getOrganizationBySlug(tenant);
  if (!org) return { title: "Agency Not Found" };

  return {
    title: `Contact Us | ${org.name}`,
    description: `Get in touch with ${org.name} for bespoke property acquisitions, sales, and leasing advisory in ${org.city}.`,
  };
}

export default async function TenantContactPage({ params }: TenantContactPageProps) {
  const { tenant } = await params;
  const organization = await getOrganizationBySlug(tenant);

  if (!organization) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 font-sans">
      {/* Hero Section */}
      <SlideUp distance={20}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium uppercase text-primary block mb-3 tracking-wider">
            Contact
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground">
            We Are Here to <span className="text-primary font-semibold">Assist You</span>
          </h1>
          <p className="text-base text-muted-foreground mt-5 font-light leading-relaxed">
            Whether you are looking to acquire luxury residences, list premier estates, or seek institutional commercial investments, our advisory team is at your service.
          </p>
        </div>
      </SlideUp>

      {/* Main Content Grid (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* Left Column: Office Information */}
        <SlideUp className="space-y-8" delay={0.1}>
          <div>
            <h2 className="text-2xl font-medium text-foreground mb-6 border-b border-border/50 pb-4">
              Office Information
            </h2>

            <StaggerContainer className="space-y-6" staggerDelay={0.08}>
              {organization.address && (
                <StaggerItem>
                  <div className="flex items-start gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <MapPin className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <div className="pt-1">
                      <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1 tracking-wider">
                        Address
                      </span>
                      <span className="text-base font-medium text-foreground">
                        {organization.address}, {organization.city}, {organization.country}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              )}

              {organization.phone && (
                <StaggerItem>
                  <div className="flex items-start gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Phone className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <div className="pt-1">
                      <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1 tracking-wider">
                        Telephone
                      </span>
                      <a href={`tel:${organization.phone}`} className="text-base font-medium text-primary hover:opacity-80 transition-opacity">
                        {organization.phone}
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              )}

              {organization.email && (
                <StaggerItem>
                  <div className="flex items-start gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Mail className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <div className="pt-1">
                      <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1 tracking-wider">
                        Email Address
                      </span>
                      <a href={`mailto:${organization.email}`} className="text-base font-medium text-primary hover:opacity-80 transition-opacity">
                        {organization.email}
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              )}

              <StaggerItem>
                <div className="flex items-start gap-4 group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Clock className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="pt-1">
                    <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1 tracking-wider">
                      Business Hours
                    </span>
                    <span className="text-base font-medium text-foreground">
                      Monday – Saturday <br />
                      9:00 AM – 7:00 PM
                    </span>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </SlideUp>

        {/* Right Column: Agent Profile / Representation */}
        <SlideUp className="flex justify-center md:justify-end" delay={0.2}>
          <div className="w-full max-w-sm sticky top-24">
            <div className="relative">
              {/* Subtle background decoration for the card */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent blur-xl opacity-50" />
              <AgentCard agent={null} organization={organization} />
            </div>
          </div>
        </SlideUp>

      </div>

      <WhatsAppButton
        phone={organization.whatsapp || organization.phone}
        agencyName={organization.name}
        floating={true}
      />
    </div>
  );
}