import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider } from "next-themes";
import Script from 'next/script';

import { getBaseUrl } from "@/lib/utils/seo";

// Configure modern Inter font
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: "%s | Atenier",
    default: "Atenier | The Operating System for Real Estate Agencies",
  },
  description:
    "Elevate your real estate brokerage with dedicated branded storefronts, verified property listings, instant PDF brochures, and direct buyer inquiries.",
  keywords: [
    "real estate",
    "real estate software",
    "property listings",
    "agency storefront",
    "luxury estates",
    "apartments for sale",
    "commercial properties",
    "real estate saas",
    "Atenier",
  ],
  authors: [{ name: "Atenier" }],
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Atenier",
    title: "Atenier | The Operating System for Real Estate Agencies",
    description:
      "Elevate your real estate brokerage with dedicated branded storefronts, verified property listings, instant PDF brochures, and direct buyer inquiries.",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Atenier - Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atenier | The Operating System for Real Estate Agencies",
    description:
      "Elevate your real estate brokerage with dedicated branded storefronts, verified property listings, instant PDF brochures, and direct buyer inquiries.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        className={`min-h-screen bg-background text-foreground flex flex-col antialiased font-sans ${inter.variable}`}
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