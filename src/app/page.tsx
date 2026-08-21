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
              <span>স্মার্ট রিয়েল এস্টেট বিজনেস সল্যুশন</span>
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
              কাস্টমারকে WhatsApp-এ ৩০টা ছবি না পাঠিয়ে শেয়ার করুন নিজের এজেন্সির সুন্দর একটি ওয়েবসাইট লিংক। সব ফ্ল্যাট, বাড়ি ও জমির বিস্তারিত থাকবে সাজানো — কাস্টমার দেখবে, পছন্দ করবে, সরাসরি যোগাযোগ করবে।
            </p>
          </SlideUp>

          <SlideUp delay={0.4} distance={20}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register-organization">
                <Button size="lg" className="h-14 px-8 text-base shadow-sm gap-2 font-medium w-full sm:w-auto rounded-full">
                  <Building2 className="h-5 w-5" />
                  এজেন্সি ওয়েবসাইট শুরু করুন
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
                কোনো কোডিং লাগবে না
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                আপনার নিজস্ব ব্র্যান্ড ও লোগো
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                সরাসরি WhatsApp ও ফোন ইনকোয়ারি
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary/80" />
                1-ক্লিকে ব্রোশিওর ডাউনলোড
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
              <span className="text-sm font-semibold uppercase text-primary mb-2 block">
                রিয়েল এস্টেটের নিত্যদিনের ঝামেলা
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                চেনা চেনা লাগছে কি?
              </h2>
              <p className="text-base text-muted-foreground mt-3 font-light">
                প্রতিদিন কাস্টমারদের সাথে ডিল করতে গিয়ে এই সমস্যাগুলোর মুখোমুখি আপনিও হচ্ছেন না তো?
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
                    WhatsApp-এ ছবির মেলা?
                  </h3>
                  <p className="text-sm text-muted-foreground font-light">
                    একজন কাস্টমার বললো <span className="font-medium text-foreground">&quot;ভাই, ধানমন্ডিতে ৩ বেডের ফ্ল্যাট দেখান&quot;</span> — তারপর গ্যালারি ঘেঁটে ২৭টা ছবি আর ৮টা ভয়েস মেসেজ পাঠাতে গিয়েই মূল্যবান সময় নষ্ট?
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-medium text-primary flex items-start gap-2 bg-primary/5 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Atenier-এ সরাসরি সুন্দর প্রপার্টি লিংক শেয়ার করুন। এক পেজেই ছবি, সাইজ, দাম ও সব ফিচার সাজানো।</span>
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
                    Facebook পোস্টে প্রপার্টি হারানো?
                  </h3>
                  <p className="text-sm text-muted-foreground font-light">
                    আজকের পোস্ট করা ফ্ল্যাট এক সপ্তাহ পর টাইমলাইনে নিচে চলে যায়। কাস্টমার জিজ্ঞেস করলে <span className="font-medium text-foreground">&quot;এখন Available কী কী আছে?&quot;</span> — নিজেরই সব প্রপার্টি খুঁজে বের করা মুশকিল!
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-medium text-primary flex items-start gap-2 bg-primary/5 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>আপনার সব এভেইলেবল ফ্ল্যাট ও জমি থাকবে সুবিন্যস্ত। কাস্টমার এলাকা ও বাজেট অনুযায়ী নিজেই খুঁজে নিতে পারবে।</span>
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
                    ব্রোশিওর বানাতে ডিজাইনার খোঁজা?
                  </h3>
                  <p className="text-sm text-muted-foreground font-light">
                    একজন সিরিয়াস বায়ার বা এনআরআই ক্লায়েন্ট বললো <span className="font-medium text-foreground">&quot;ভাই, প্রপার্টির একটা PDF ফাইল পাঠান&quot;</span> — এখন কি বসে বসে ডকুমেন্ট বা ফাইল বানাবেন?
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-medium text-primary flex items-start gap-2 bg-primary/5 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Atenier-এ প্রতিটি লিস্টিংয়ের সাথে ১ ক্লিকেই তৈরি হয়ে যায় আকর্ষণীয় A4 প্রিন্ট-রেডি PDF ব্রোশিওর।</span>
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
                <span className="text-sm font-medium text-primary mb-2 block">
                  পার্টনার এজেন্সি নেটওয়ার্ক
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                  আমাদের সাথে যুক্ত বিশ্বস্ত এজেন্সিসমূহ
                </h2>
                <p className="text-base text-muted-foreground mt-4 font-light">
                  দেশের সক্রিয় রিয়েল এস্টেট এজেন্সি ও প্রপার্টি কনসালট্যান্টরা Atenier-এ নিজেদের প্রপার্টি লিস্টিং পরিচালনা করছেন।
                </p>
              </div>
              <Link href="/explore" className="mt-6 md:mt-0">
                <Button variant="ghost" className="gap-2 hover:bg-transparent hover:text-primary px-0 font-medium">
                  সকল এজেন্সি ও প্রপার্টি দেখুন
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
                      এজেন্সি সাইট দেখুন
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/${org.slug}/properties`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ক্যাটালগ ব্রাউজ করুন
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
                    এক্সক্লুসিভ প্রপার্টি কালেকশন
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                    খুঁজে নিন আপনার স্বপ্নের ফ্ল্যাট বা বাড়ি
                  </h2>
                  <p className="text-base text-muted-foreground mt-4 font-light">
                    আবাসিক ফ্ল্যাট, লাক্সারি ভিলা কিংবা বাণিজ্যিক স্পেস—এজেন্সিগুলোর সেরা লিস্টিংগুলো এক নজরে।
                  </p>
                </div>
                <Link href="/explore">
                  <Button variant="ghost" className="gap-2 hover:bg-transparent hover:text-primary px-0 font-medium">
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

      {/* Core Benefits Section */}
      <section id="features" className="py-24 bg-muted/40 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-sm font-semibold uppercase text-primary mb-2 block">
                কেন আপনার এজেন্সির জন্য Atenier?
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mt-2">
                Facebook পেজ আছে? এবার নিজের প্রপার্টি ওয়েবসাইট বানিয়ে নিন
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mt-4 font-light">
                ফেসবুক পেজ দিয়ে মানুষ আপনাকে চিনবে, আর Atenier ওয়েবসাইট দিয়ে ক্রেতারা জানবে আপনার কাছে এই মুহূর্তে কী কী প্রপার্টি এভেইলেবল আছে।
              </p>
            </div>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10" staggerDelay={0.1}>
            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full rounded-2xl bg-card border border-border/60 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Building2 className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">নিজের ব্র্যান্ডেড ওয়েবসাইট</h3>
                <p className="text-sm text-muted-foreground font-light">
                  আপনার এজেন্সির নাম ও লোগো সম্বলিত নিজস্ব ওয়েব লিংক (যেমনঃ atenier.com/your-agency)। ক্রেতার কাছে আপনার এজেন্সির গ্রহণযোগ্যতা বাড়বে বহুগুণ।
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full rounded-2xl bg-card border border-border/60 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Zap className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">মুহূর্তে নতুন প্রপার্টি যোগ</h3>
                <p className="text-sm text-muted-foreground font-light">
                  মোবাইল বা ল্যাপটপ থেকে মাত্র ২ মিনিটে নতুন ফ্ল্যাট বা জমির ছবি, দাম ও বিবরণ আপলোড করুন। কোনো ডেভেলপার ডাকার ঝামেলা ছাড়াই নিজেই নিয়ন্ত্রণ করুন।
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col items-center text-center p-6 h-full rounded-2xl bg-card border border-border/60 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <PhoneCall className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">সরাসরি WhatsApp ও কল লিড</h3>
                <p className="text-sm text-muted-foreground font-light">
                  কোনো থার্ড-পার্টি বা কমিশন নেই। প্রপার্টি পছন্দ হলে আগ্রহী বায়ার সরাসরি আপনার WhatsApp বা ফোনে মেসেজ পাঠাবে।
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
            আপনার প্রপার্টি বিজনেসের জন্য <br /> আজই তৈরি করুন নিজস্ব ওয়েবসাইট
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/85 max-w-2xl mx-auto font-light">
            খুব সহজেই আপনার এজেন্সির প্রোফাইল খুলুন, ফ্ল্যাট ও জমির লিস্টিং আপলোড করুন এবং কাস্টমারদের সাথে প্রফেশনাল লিংক শেয়ার করা শুরু করুন।
          </p>
          <div className="mt-10">
            <Link href="/register-organization">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-base font-semibold rounded-full shadow-lg bg-background text-foreground hover:bg-muted hover:text-foreground">
                এজেন্সি ওয়েবসাইট শুরু করুন
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