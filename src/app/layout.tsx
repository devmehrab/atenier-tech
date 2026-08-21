import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider } from "next-themes";
import Script from 'next/script';

// Configure Hind Siliguri font
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: "%s | Atenier Real Estate Platform",
    default: "Atenier | Multi-Tenant Real Estate Marketplace & Agency SaaS",
  },
  description:
    "Production-ready multi-tenant property listing platform for real estate agencies and agents. Discover luxury homes, apartments, villas, and commercial real estate.",
  keywords: [
    "real estate",
    "property listings",
    "apartments for sale",
    "houses for rent",
    "commercial properties",
    "real estate agency saas",
  ],
  authors: [{ name: "Mehrab Hossain" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Atenier Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="smooth-scroll" suppressHydrationWarning>
      <head>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="6f78810e-6f35-4ec1-834d-d5fc9aadf064"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`min-h-screen bg-background text-foreground flex flex-col antialiased font-sans ${hindSiliguri.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScrollProvider>
            <ToastProvider>{children}</ToastProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}