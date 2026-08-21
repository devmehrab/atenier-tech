import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/lib/services/organization.service";
import { TenantHeader } from "@/components/tenant/TenantHeader";
import { TenantFooter } from "@/components/tenant/TenantFooter";
import { generateOrganizationJsonLd } from "@/lib/utils/seo";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export async function generateMetadata({ params }: TenantLayoutProps) {
  const { tenant } = await params;
  const org = await getOrganizationBySlug(tenant);

  if (!org) {
    return {
      title: "Agency Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    title: `${org.name} | Official website`,
    description:
      org.description ||
      `Explore luxury properties, apartments, villas, and commercial real estate with ${org.name}.`,
    openGraph: {
      title: org.name,
      description: org.description,
      url: `${baseUrl}/${org.slug}`,
      images: org.coverImage?.secureUrl ? [org.coverImage.secureUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: org.name,
      description: org.description,
      images: org.coverImage?.secureUrl ? [org.coverImage.secureUrl] : [],
    },
  };
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params;
  const organization = await getOrganizationBySlug(tenant);

  if (!organization) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const jsonLd = generateOrganizationJsonLd(organization, baseUrl);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TenantHeader organization={organization} />
      <main className="flex-1">{children}</main>
      <TenantFooter organization={organization} />
    </div>
  );
}

