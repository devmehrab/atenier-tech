import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db/connection";
import { Organization } from "@/lib/db/models/Organization";
import { Property } from "@/lib/db/models/Property";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  try {
    await connectToDatabase();

    const [orgs, properties] = await Promise.all([
      Organization.find({ status: "ACTIVE" }).select("slug updatedAt").lean(),
      Property.find({ status: "PUBLISHED" })
        .populate("organizationId", "slug")
        .select("slug organizationId updatedAt")
        .lean(),
    ]);

    const orgRoutes: MetadataRoute.Sitemap = orgs.map((org) => ({
      url: `${baseUrl}/${org.slug}`,
      lastModified: org.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const propertyRoutes: MetadataRoute.Sitemap = properties
      .filter((p) => (p.organizationId as any)?.slug)
      .map((p) => ({
        url: `${baseUrl}/${(p.organizationId as any).slug}/properties/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    return [...staticRoutes, ...orgRoutes, ...propertyRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
