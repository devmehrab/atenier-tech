import Link from "next/link";
import { getCurrentSession } from "@/lib/auth/guards";
import { listActiveOrganizations } from "@/lib/services/organization.service";
import { listProperties } from "@/lib/services/property.service";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/tenant/PropertyCard";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/motion";
import {
  Building2,
  ShieldCheck,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Gem,
  HeartHandshake
} from "lucide-react";

export default async function HomePage() {
  const session = await getCurrentSession();
  const [organizations, { properties: featuredListings }] = await Promise.all([
    listActiveOrganizations().catch(() => []),
    listProperties({ limit: 6, status: "PUBLISHED" }).catch(() => ({ properties: [] })),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <Navbar user={session} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/80 px-5 py-2 text-sm font-medium text-primary border border-border/50 mb-8 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              <span>আধুনিক রিয়েল এস্টেট সল্যুশন</span>
            </div>
          </FadeIn>

          <SlideUp delay={0.2} distance={30}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold max-w-5xl mx-auto text-foreground">
              আপনার রিয়েল এস্টেট ব্যবসাকে দিন <br className="hidden sm:block" />
              <span className="text-primary font-semibold">এক অনন্য ডিজিটাল পরিচয়</span>
            </h1>
          </SlideUp>

          <SlideUp delay={0.3} distance={20}>
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              কোনো প্রযুক্তিগত জটিলতা ছাড়াই নিজের এজেন্সির জন্য তৈরি করুন একটি প্রিমিয়াম প্রপার্টি ওয়েবসাইট। আপনার নিজস্ব ব্র্যান্ডিংয়ের মাধ্যমে গ্রাহকের আরও কাছাকাছি পৌঁছান এবং ব্যবসাকে প্রসারিত করুন।
            </p>
          </SlideUp>

          <SlideUp delay={0.4} distance={20}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register-organization">
                <Button size="lg" className="h-14 px-8 text-base shadow-sm gap-2 font-medium w-full sm:w-auto rounded-full">
                  <Building2 className="h-5 w-5" />
                  এজেন্সি প্রোফাইল শুরু করুন
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base w-full sm:w-auto gap-2 rounded-full bg-background text-primary"
                >
                  <Compass className="h-5 w-5 text-primary" />
                  প্রপার্টিসমূহ ঘুরে দেখুন
                </Button>
              </Link>
            </div>
          </SlideUp>

          <FadeIn delay={0.5}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                শতভাগ নির্ভরযোগ্য
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                আপনার নিজস্ব ব্র্যান্ডিং
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                অনায়াস পরিচালনা
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Real Estate Agencies */}
      <section id="agencies" className="py-24 bg-muted/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div className="max-w-2xl">
                <span className="text-sm font-medium text-primary mb-2 block">
                  আমাদের পার্টনার নেটওয়ার্ক
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                  আমাদের সাথে যুক্ত স্বনামধন্য এজেন্সিসমূহ
                </h2>
                <p className="text-base text-muted-foreground mt-4 font-light">
                  দেশের শীর্ষস্থানীয় রিয়েল এস্টেট প্রতিষ্ঠানগুলো তাদের ডিজিটাল যাত্রায় আমাদের প্ল্যাটফর্মের ওপর আস্থা রেখেছে।
                </p>
              </div>
              <Link href="/explore" className="mt-6 md:mt-0">
                <Button variant="ghost" className="gap-2 hover:bg-transparent hover:text-primary px-0">
                  সকল এজেন্সি দেখুন
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
                      {org.description || "নির্ভরযোগ্য প্রপার্টি সমাধান নিয়ে আমরা আছি আপনার স্বপ্নের আবাসন খোঁজার যাত্রায়।"}
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
                      এজেন্সি পেজ ভিজিট করুন
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/${org.slug}/properties`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ক্যাটালগ দেখুন
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
                  <span className="text-sm font-medium text-primary mb-2 block">
                    এক্সক্লুসিভ কালেকশন
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                    খুঁজে নিন আপনার স্বপ্নের ঠিকানা
                  </h2>
                  <p className="text-base text-muted-foreground mt-4 font-light">
                    আবাসিক কিংবা বাণিজ্যিক—আমাদের পার্টনার এজেন্সিগুলোর শেয়ার করা সেরা প্রপার্টিগুলো এক নজরে।
                  </p>
                </div>
                <Link href="/explore">
                  <Button variant="ghost" className="gap-2 hover:bg-transparent hover:text-primary px-0">
                    সব প্রপার্টি দেখুন
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

      {/* Platform Features Section (Value-driven Narratives) */}
      <section id="features" className="py-24 bg-muted/40 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-sm font-medium text-primary mb-2 block">
                কেন আমরা আলাদা?
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                আপনার ব্যবসাকে সমৃদ্ধ করতে আমরা প্রতিশ্রুতিবদ্ধ
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mt-4 font-light">
                শুধুমাত্র একটি সফটওয়্যার নয়, আপনার ব্যবসাকে নতুন উচ্চতায় নিয়ে যাওয়ার জন্য আমরা দিচ্ছি একটি পূর্ণাঙ্গ সমাধান।
              </p>
            </div>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10" staggerDelay={0.1}>
            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <ShieldCheck className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">নির্ভরযোগ্য ও নিরাপদ</h3>
                <p className="text-muted-foreground font-light">
                  আপনার মূল্যবান ডেটা এবং গ্রাহকের তথ্যের সর্বোচ্চ গোপনীয়তা ও নিরাপত্তা নিশ্চিত করি আমরা। কোনো প্রকার শঙ্কা ছাড়াই ব্যবসা পরিচালনা করুন।
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <Gem className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">আপনার নিজস্ব পরিচয়</h3>
                <p className="text-muted-foreground font-light">
                  আপনার নিজস্ব ব্র্যান্ডিং, লোগো এবং কালার থিম—আপনার এজেন্সি পেজটি হবে পুরোপুরি আপনার। এটি তুলে ধরবে আপনার পেশাদারিত্ব।
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <HeartHandshake className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">গ্রাহকের সাথে সুসম্পর্ক</h3>
                <p className="text-muted-foreground font-light">
                  প্রপার্টির দৃষ্টিনন্দন উপস্থাপন এবং সরাসরি যোগাযোগের সুবিধার মাধ্যমে আপনার গ্রাহকদের দিন এক প্রিমিয়াম ও আস্থার অভিজ্ঞতা।
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-black/5" />

        <SlideUp className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-semibold text-primary-foreground">
            আপনার ব্যবসাকে ডিজিটাল রূপ দিতে প্রস্তুত?
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto font-light">
            আজই আপনার রিয়েল এস্টেট এজেন্সির ডিজিটাল ওয়েবসাইট চালু করুন এবং গ্রাহকদের দিন এক আধুনিক ও প্রিমিয়াম অভিজ্ঞতা।
          </p>
          <div className="mt-10">
            <Link href="/register-organization">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-base font-medium rounded-full shadow-md bg-background text-foreground hover:bg-muted hover:text-foreground">
                একাউন্ট তৈরি করুন
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