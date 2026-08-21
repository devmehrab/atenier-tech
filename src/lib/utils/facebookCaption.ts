import { IProperty, IOrganization } from "@/lib/types";
import { formatPrice, formatArea } from "@/lib/utils/formatters";

/**
 * Generates a Facebook post caption from existing database property details.
 * Strictly includes only fields that exist / are non-empty in the database.
 */
export function generateFacebookCaption(
  property: IProperty,
  organization?: Partial<IOrganization> | null,
  publicUrl?: string
): string {
  const lines: string[] = [];

  // Headline
  lines.push(`🔥 ${property.title}`);
  lines.push("");

  // Purpose & Property Type
  const listingTypeText =
    property.listingType === "RENT"
      ? "ভাড়ার জন্য (For Rent)"
      : property.listingType === "LEASE"
      ? "লিজের জন্য (For Lease)"
      : "বিক্রয়ের জন্য (For Sale)";

  const propertyTypeMap: Record<string, string> = {
    APARTMENT: "ফ্ল্যাট / অ্যাপার্টমেন্ট",
    HOUSE: "বাড়ি / ভিলা",
    VILLA: "লাক্সারি ভিলা",
    COMMERCIAL: "বাণিজ্যিক স্পেস",
    LAND: "জমি / প্লট",
    OFFICE: "অফিস স্পেস",
    PENTHOUSE: "পেন্টহাউস",
    TOWNHOUSE: "টাউনহাউস",
  };

  const propertyTypeText = propertyTypeMap[property.propertyType] || property.propertyType;
  lines.push(`🏢 প্রপার্টি টাইপ: ${propertyTypeText} • ${listingTypeText}`);

  // Location (only available parts)
  const locParts = [
    property.location?.address,
    property.location?.area,
    property.location?.city,
  ].filter(Boolean);
  if (locParts.length > 0) {
    lines.push(`📍 লোকেশন: ${locParts.join(", ")}`);
  }

  // Price
  if (property.price !== undefined && property.price !== null) {
    const formattedPrice = formatPrice(
      property.price,
      property.currency,
      property.pricePeriod
    );
    const negotiableText = property.priceNegotiable ? " (দাম আলোচনা সাপেক্ষ)" : "";
    lines.push(`💰 মূল্য: ${formattedPrice}${negotiableText}`);
  }

  lines.push("");

  // Specifications (only if present)
  const specs: string[] = [];
  if (property.specifications?.bedrooms) {
    specs.push(`▫️ বেডরুম: ${property.specifications.bedrooms} টি`);
  }
  if (property.specifications?.bathrooms) {
    specs.push(`▫️ বাথরুম: ${property.specifications.bathrooms} টি`);
  }
  if (property.specifications?.propertySize) {
    specs.push(
      `▫️ সাইজ / আয়তন: ${formatArea(
        property.specifications.propertySize,
        property.specifications.propertySizeUnit
      )}`
    );
  }
  if (property.specifications?.parkingSpaces && property.specifications.parkingSpaces > 0) {
    specs.push(`▫️ পার্কিং সুবিধা: ${property.specifications.parkingSpaces} টি`);
  }
  if (property.specifications?.floorNumber !== undefined) {
    const totalFl = property.specifications.totalFloors
      ? ` (মোট ${property.specifications.totalFloors} তলার)`
      : "";
    specs.push(`▫️ ফ্লোর নম্বর: ${property.specifications.floorNumber}${totalFl}`);
  }
  if (
    property.specifications?.furnishedStatus &&
    property.specifications.furnishedStatus !== "UNFURNISHED"
  ) {
    const furnishedMap: Record<string, string> = {
      SEMI_FURNISHED: "সেমি-ফার্নিশড",
      FULLY_FURNISHED: "ফুল ফার্নিশড",
    };
    specs.push(
      `▫️ ফার্নিশিং: ${
        furnishedMap[property.specifications.furnishedStatus] ||
        property.specifications.furnishedStatus
      }`
    );
  }
  if (property.specifications?.yearBuilt) {
    specs.push(`▫️ নির্মাণ সাল: ${property.specifications.yearBuilt}`);
  }

  if (specs.length > 0) {
    lines.push("📌 প্রপার্টির মূল বিবরণ:");
    lines.push(...specs);
  }

  // Amenities (only if array is non-empty)
  if (property.amenities && property.amenities.length > 0) {
    lines.push("");
    lines.push("✨ সুযোগ-সুবিধা ও সিকিউরিটি:");
    property.amenities.forEach((amenity) => {
      lines.push(`✔️ ${amenity}`);
    });
  }

  // Description (only if available)
  if (property.description?.trim()) {
    lines.push("");
    lines.push("📝 প্রপার্টি সম্পর্কে:");
    lines.push(property.description.trim());
  }

  // Contact Info (only if available)
  const phone = property.contactInfo?.phone || organization?.phone;
  const whatsapp = property.contactInfo?.whatsapp || organization?.whatsapp || phone;
  const email = property.contactInfo?.email || organization?.email;
  const orgName = organization?.name || property.organizationName;

  const contacts: string[] = [];
  if (phone) contacts.push(`📞 কল করুন: ${phone}`);
  if (whatsapp) contacts.push(`💬 WhatsApp: ${whatsapp}`);
  if (email) contacts.push(`✉️ ইমেইল: ${email}`);
  if (orgName) contacts.push(`🏢 এজেন্সি: ${orgName}`);
  if (publicUrl) contacts.push(`🌐 সম্পূর্ণ ছবি ও বিবরণ দেখতে ক্লিক করুন: ${publicUrl}`);

  if (contacts.length > 0) {
    lines.push("");
    lines.push("📲 যোগাযোগ ও ভিজিট শিডিউল:");
    lines.push(...contacts);
  }

  // Relevant hashtags based on available data
  lines.push("");
  const tags: string[] = ["#RealEstate", "#BangladeshProperty"];

  if (property.propertyType === "APARTMENT" || property.propertyType === "PENTHOUSE") {
    tags.push(property.listingType === "RENT" ? "#ApartmentForRent" : "#ApartmentForSale", "#FlatForSale");
  } else if (property.propertyType === "LAND") {
    tags.push("#LandForSale", "#PlotSale", "#PlotForSale");
  } else if (property.propertyType === "COMMERCIAL" || property.propertyType === "OFFICE") {
    tags.push("#CommercialSpace", "#OfficeSpace");
  } else if (property.propertyType === "HOUSE" || property.propertyType === "VILLA") {
    tags.push(property.listingType === "RENT" ? "#HouseForRent" : "#HouseForSale", "#LuxuryVilla");
  }

  if (property.location?.city) tags.push(`#${property.location.city.replace(/\s+/g, "")}`);
  if (property.location?.area) tags.push(`#${property.location.area.replace(/\s+/g, "")}`);
  if (orgName) {
    const cleanOrg = orgName.replace(/[^a-zA-Z0-9]/g, "");
    if (cleanOrg) tags.push(`#${cleanOrg}`);
  }

  lines.push(tags.join(" "));

  return lines.join("\n");
}
