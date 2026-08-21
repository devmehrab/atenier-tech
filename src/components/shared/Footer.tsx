import Link from "next/link";
import { Building, ShieldCheck, HeartHandshake } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/40 text-muted-foreground font-sans">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Intro */}
          <div className="space-y-5 md:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground font-light">
              আপনার রিয়েল এস্টেট বিজনেসের সব ফ্ল্যাট ও জমির লিস্টিং সাজিয়ে রাখুন এক জায়গায়। কাস্টমারদের দিন চমৎকার প্রফেশনাল ব্রাউজিং অভিজ্ঞতা।
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground/80">
              <ShieldCheck className="h-4 w-4 text-primary/80" />
              <span>সহজ, নিরাপদ ও প্রফেশনাল</span>
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-5">
              প্রপার্টি খুঁজুন
            </h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground font-light">
              <li>
                <Link href="/explore" className="hover:text-primary transition-colors">
                  সকল প্রপার্টি
                </Link>
              </li>
              <li>
                <Link href="/explore?listingType=SALE" className="hover:text-primary transition-colors">
                  বিক্রয়যোগ্য ফ্ল্যাট ও বাড়ি
                </Link>
              </li>
              <li>
                <Link href="/explore?listingType=RENT" className="hover:text-primary transition-colors">
                  ভাড়ার প্রপার্টি
                </Link>
              </li>
              <li>
                <Link href="/#agencies" className="hover:text-primary transition-colors">
                  পার্টনার এজেন্সিসমূহ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Agencies Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-5">
              এজেন্সিগুলোর জন্য
            </h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground font-light">
              <li>
                <Link href="/register-organization" className="hover:text-primary transition-colors">
                  এজেন্সি ওয়েবসাইট শুরু করুন
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  লগইন করুন
                </Link>
              </li>
              <li>
                <Link href="/rahman-properties" className="hover:text-primary transition-colors">
                  ডেমো ওয়েবসাইট দেখুন (রহমান প্রোপার্টিজ)
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-primary transition-colors">
                  কেন Atenier?
                </Link>
              </li>
            </ul>
          </div>

          {/* Promise & Security */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-5">
              আমাদের লক্ষ্য
            </h4>
            <p className="text-sm text-muted-foreground mb-4 font-light">
              আপনার প্রপার্টি ব্যবসাকে সহজ ও স্মার্ট করতে আমরা নিয়ে এসেছি এমন সমাধান, যা আপনার ও আপনার কাস্টমারদের মূল্যবান সময় বাঁচাবে।
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-light">
          <p>© {new Date().getFullYear()} Atenier Technologies সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">গোপনীয়তা নীতি</Link>
            <Link href="#" className="hover:text-foreground transition-colors">শর্তাবলী</Link>
            <Link href="#" className="hover:text-foreground transition-colors">যোগাযোগ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}