import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider } from "next-themes";
import Script from 'next/script';

import { getBaseUrl } from "@/lib/utils/seo";

// Configure Hind Siliguri font
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: "%s | Atenier",
    default: "Atenier | রিয়েল এস্টেট এজেন্সির নিজস্ব প্রপার্টি ওয়েবসাইট",
  },
  description:
    "আপনার রিয়েল এস্টেট বিজনেসের সব প্রপার্টি লিস্টিং সাজিয়ে রাখুন এক জায়গায়। কাস্টমারকে দিন চমৎকার প্রফেশনাল ব্রাউজিং অভিজ্ঞতা এবং সরাসরি WhatsApp ও ফোন ইনকোয়ারি গ্রহণ করুন।",
  keywords: [
    "রিয়েল এস্টেট",
    "প্রপার্টি লিস্টিং",
    "ফ্ল্যাট বিক্রি",
    "বাড়ি ভাড়া",
    "জমি ক্রয় বিক্রয়",
    "কমার্শিয়াল স্পেস",
    "রিয়েল এস্টেট এজেন্সি ওয়েবসাইট",
    "real estate agency website",
    "property listings Bangladesh",
  ],
  authors: [{ name: "Atenier Technologies" }],
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "/",
    siteName: "Atenier",
    title: "Atenier | রিয়েল এস্টেট এজেন্সির নিজস্ব প্রপার্টি ওয়েবসাইট",
    description:
      "আপনার রিয়েল এস্টেট বিজনেসের সব প্রপার্টি লিস্টিং সাজিয়ে রাখুন এক জায়গায়। কাস্টমারকে দিন চমৎকার প্রফেশনাল ব্রাউজিং অভিজ্ঞতা এবং সরাসরি WhatsApp ও ফোন ইনকোয়ারি গ্রহণ করুন।",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Atenier - রিয়েল এস্টেট এজেন্সি ওয়েবসাইট প্ল্যাটফর্ম",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atenier | রিয়েল এস্টেট এজেন্সির নিজস্ব প্রপার্টি ওয়েবসাইট",
    description:
      "আপনার রিয়েল এস্টেট বিজনেসের সব প্রপার্টি লিস্টিং সাজিয়ে রাখুন এক জায়গায়। কাস্টমারকে দিন চমৎকার প্রফেশনাল ব্রাউজিং অভিজ্ঞতা এবং সরাসরি WhatsApp ও ফোন ইনকোয়ারি গ্রহণ করুন।",
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