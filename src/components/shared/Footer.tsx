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
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              The modern operating platform for real estate agencies. Organize listings, delight buyers, and close transactions faster.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground/80">
              <ShieldCheck className="h-4 w-4 text-primary/80" />
              <span>Fast, Secure & Professional</span>
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-5">
              Explore Listings
            </h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground font-light">
              <li>
                <Link href="/explore" className="hover:text-primary transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/explore?listingType=SALE" className="hover:text-primary transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link href="/explore?listingType=RENT" className="hover:text-primary transition-colors">
                  Rental Properties
                </Link>
              </li>
              <li>
                <Link href="/#agencies" className="hover:text-primary transition-colors">
                  Partner Agencies
                </Link>
              </li>
            </ul>
          </div>

          {/* For Agencies Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-5">
              For Brokerages
            </h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground font-light">
              <li>
                <Link href="/register-organization" className="hover:text-primary transition-colors">
                  Launch Agency Website
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/apex-realty" className="hover:text-primary transition-colors">
                  Demo Storefront (Apex Realty)
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-primary transition-colors">
                  Why Atenier?
                </Link>
              </li>
            </ul>
          </div>

          {/* Promise & Security */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-5">
              Our Mission
            </h4>
            <p className="text-sm text-muted-foreground mb-4 font-light leading-relaxed">
              Empowering real estate brokerages and property advisors with the tools they need to present properties impeccably and accelerate client engagement.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-light">
          <p>© {new Date().getFullYear()} Atenier. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}