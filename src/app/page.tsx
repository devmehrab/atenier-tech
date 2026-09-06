import Link from "next/link";
import { getCurrentSession } from "@/lib/auth/guards";
import { listActiveOrganizations } from "@/lib/services/organization.service";
import { listProperties } from "@/lib/services/property.service";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/tenant/PropertyCard";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/motion";
import { generatePlatformJsonLd } from "@/lib/utils/seo";
import {
  Building2,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle,
  MessageSquare,
  FileText,
  Search,
  Zap,
  PhoneCall,
  Layers,
} from "lucide-react";

export default async function HomePage() {
  const session = await getCurrentSession();
  const [organizations, { properties: featuredListings }] = await Promise.all([
    listActiveOrganizations().catch(() => []),
    listProperties({ limit: 6, status: "PUBLISHED" }).catch(() => ({ properties: [] })),
  ]);

  const jsonLd = generatePlatformJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar user={session} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 sm:py-32 lg:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/80 px-5 py-2 text-sm font-medium text-primary border border-border/50 mb-8 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              <span>Smart Real Estate Platform</span>
            </div>
          </FadeIn>

          <SlideUp delay={0.2} distance={30}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold max-w-5xl mx-auto text-foreground tracking-tight">
              Give Your Real Estate Agency <br className="hidden sm:block" />
              <span className="text-primary font-semibold">A World-Class Digital Flagship</span>
            </h1>
          </SlideUp>

          <SlideUp delay={0.3} distance={20}>
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Stop sending messy 30-photo chat dumps. Share a stunning, branded property website. Every apartment, luxury villa, and commercial investment organized for serious buyers and global investors.
            </p>
          </SlideUp>

          <SlideUp delay={0.4} distance={20}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register-organization">
                <Button size="lg" className="h-14 px-8 text-base shadow-sm gap-2 font-medium w-full sm:w-auto rounded-full">
                  <Building2 className="h-5 w-5" />
                  Launch Agency Website
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base w-full sm:w-auto gap-2 rounded-full bg-background text-primary"
                >
                  <Compass className="h-5 w-5 text-primary" />
                  Explore Properties
                </Button>
              </Link>
            </div>
          </SlideUp>

          <FadeIn delay={0.5}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                No coding required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                Custom branding & logo
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                Direct WhatsApp & call leads
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                1-click PDF brochures
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Relatable Problem vs Solution Section */}
      <section className="py-24 bg-muted/20 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-semibold uppercase text-primary mb-2 block tracking-wider">
                The Daily Real Estate Struggle
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Does this feel familiar?
              </h2>
              <p className="text-base text-muted-foreground mt-3 font-light">
                Managing property inquiries and client communications shouldn&apos;t feel chaotic.
              </p>
            </div>
          </SlideUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <SlideUp delay={0.1}>
              <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm h-full flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                    <MessageSquare className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    Endless photo clutter in chat?
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    A prospective buyer asks <span className="font-medium text-foreground">&quot;Can you send details on 3-bed apartments?&quot;</span> — and you spend valuable time scrolling through camera rolls to send 27 photos and 8 voice notes.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-medium text-primary flex items-start gap-2 bg-primary/5 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Share an elegant Atenier link. High-res photos, floor plans, specs, and pricing organized on one single page.</span>
                </div>
              </div>
            </SlideUp>

            {/* Card 2 */}
            <SlideUp delay={0.2}>
              <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm h-full flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                    <Search className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    Listings lost in social feeds?
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    Social posts get buried within days. When serious buyers ask <span className="font-medium text-foreground">&quot;What is available right now?&quot;</span> — finding active inventory across feeds is time-consuming and unprofessional.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-medium text-primary flex items-start gap-2 bg-primary/5 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Maintain a live digital inventory. Clients can easily filter by neighborhood, budget range, and property category.</span>
                </div>
              </div>
            </SlideUp>

            {/* Card 3 */}
            <SlideUp delay={0.3}>
              <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm h-full flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
                    <FileText className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    Hiring designers for brochures?
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    A qualified investor asks <span className="font-medium text-foreground">&quot;Can you email a formal PDF brochure?&quot;</span> — leaving you scrambling to create presentation documents manually.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-medium text-primary flex items-start gap-2 bg-primary/5 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Every listing on Atenier automatically generates an immaculate, print-ready A4 PDF brochure in 1 click.</span>
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Featured Real Estate Agencies */}
      <section id="agencies" className="py-24 bg-muted/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div className="max-w-2xl">
                <span className="text-sm font-medium text-primary mb-2 block tracking-wider uppercase">
                  Brokerage Network
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                  Trusted Partner Brokerages & Agencies
                </h2>
                <p className="text-base text-muted-foreground mt-4 font-light leading-relaxed">
                  Leading brokerages, real estate agencies, and property consultants manage their portfolios and client inquiries on Atenier.
                </p>
              </div>
              <Link href="/explore" className="mt-6 md:mt-0">
                <Button variant="ghost" className="gap-2 hover:bg-transparent hover:text-primary px-0 font-medium">
                  Browse all agencies & listings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
            {organizations.map((org) => (
              <StaggerItem key={org._id}>
                <div className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1 h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold border border-primary/20">
                        <Building2 className="h-6 w-6 stroke-[1.5]" />
                      </div>
                      <span className="rounded-full bg-muted px-4 py-1.5 text-xs font-mono text-muted-foreground">
                        /{org.slug}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {org.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2 font-light">
                      {org.description || "Providing bespoke brokerage advisory and curated property solutions for discerning clients."}
                    </p>
                    <div className="mt-5 text-sm font-medium text-muted-foreground/80 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                      {org.city}, {org.country}
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-border/40 flex items-center justify-between">
                    <Link
                      href={`/${org.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
                    >
                      Visit Agency Site
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/${org.slug}/properties`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      {featuredListings.length > 0 && (
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SlideUp>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                <div className="max-w-2xl">
                  <span className="text-sm font-medium text-primary mb-2 block tracking-wider uppercase">
                    Exclusive Property Portfolio
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                    Discover Premier Homes & Estates
                  </h2>
                  <p className="text-base text-muted-foreground mt-4 font-light leading-relaxed">
                    From luxury apartments and penthouses to prime commercial spaces—explore verified listings from premier brokerages.
                  </p>
                </div>
                <Link href="/explore">
                  <Button variant="ghost" className="gap-2 hover:bg-transparent hover:text-primary px-0 font-medium">
                    View all properties
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </SlideUp>

            <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
              {featuredListings.map((prop) => (
                <StaggerItem key={prop._id}>
                  <PropertyCard
                    property={prop}
                    tenantSlug={prop.organizationSlug || (prop.organizationId as any)?.slug}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Core Benefits Section */}
      <section id="features" className="py-24 bg-muted/40 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-sm font-semibold uppercase text-primary mb-2 block tracking-wider">
                Why Atenier for Your Agency?
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                Have a Social Presence? Now Own Your Dedicated Property Website
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mt-4 font-light leading-relaxed">
                Social media is great for brand awareness, but your Atenier storefront gives buyers a trustworthy, professional platform to browse your active inventory and connect directly.
              </p>
            </div>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10" staggerDelay={0.1}>
            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full rounded-2xl bg-card border border-border/60 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Building2 className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Branded Agency Website</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Your dedicated web domain (e.g., atenier.com/your-agency) featuring your agency logo and custom colors. Establish immediate prestige and trust with high-net-worth clients.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full rounded-2xl bg-card border border-border/60 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Zap className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Publish Listings in Minutes</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Upload photos, pricing, specs, and property highlights in 2 minutes from your phone or laptop. Manage your complete catalog without technical complexity.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full rounded-2xl bg-card border border-border/60 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <PhoneCall className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Direct Inquiries & Call Leads</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Zero commission cuts or middleman gatekeepers. When buyers fall in love with a property, inquiries flow directly to your WhatsApp or telephone.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />

        <SlideUp className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-semibold text-primary-foreground">
            Ready to Elevate Your Real Estate Agency? <br /> Launch Your Storefront Today
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/85 max-w-2xl mx-auto font-light leading-relaxed">
            Create your agency profile, upload your exclusive listings, and share professional presentations with buyers worldwide.
          </p>
          <div className="mt-10">
            <Link href="/register-organization">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-base font-semibold rounded-full shadow-lg bg-background text-foreground hover:bg-muted hover:text-foreground">
                Launch Agency Website
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SlideUp>
      </section>

      <Footer />
    </div>
  );
}