import { IProperty, IOrganization, IUser } from "@/lib/types";
import { formatPrice, formatArea, formatDate } from "@/lib/utils/formatters";

interface GenerateBrochureOptions {
  property: IProperty;
  organization?: Partial<IOrganization> | null;
  agent?: Partial<IUser> | null;
  publicUrl?: string;
}

export function generateBrochureHtml({
  property,
  organization,
  agent,
  publicUrl,
}: GenerateBrochureOptions): string {
  const brandColor = organization?.branding?.primaryColor || "#059669";
  const orgName = organization?.name || property.organizationName || "Real Estate Agency";
  const orgPhone = organization?.phone || property.contactInfo?.phone || "";
  const orgEmail = organization?.email || property.contactInfo?.email || "";
  const orgWhatsapp = organization?.whatsapp || property.contactInfo?.whatsapp || "";
  const orgAddress = organization?.address
    ? `${organization.address}, ${organization.city || ""}`
    : organization?.city || property.location.city || "";
  const orgWebsite = organization?.socialLinks?.website || "";
  const orgTagline = organization?.branding?.tagline || "";
  const logoUrl = organization?.logo?.secureUrl || "";

  // Images
  const mainImage =
    property.featuredImage ||
    property.images?.[0]?.secureUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const galleryImages = (property.images || [])
    .filter((img) => img.secureUrl && img.secureUrl !== mainImage)
    .slice(0, 3);

  // Specifications
  const specs = property.specifications || ({} as any);
  const formattedPrice = formatPrice(
    property.price,
    property.currency || "BDT",
    property.pricePeriod
  );
  const formattedSize = formatArea(specs.propertySize || 0, specs.propertySizeUnit || "sqft");

  const fullAddress = [
    property.location?.address,
    property.location?.area,
    property.location?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const amenitiesList = Array.from(
    new Set([...(property.amenities || []), ...(property.features || [])])
  ).slice(0, 12);

  const furnishedText =
    specs.furnishedStatus && specs.furnishedStatus !== "UNFURNISHED"
      ? specs.furnishedStatus.replace("_", " ")
      : specs.furnishedStatus === "UNFURNISHED"
        ? "Unfurnished"
        : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(property.title)} - ${escapeHtml(orgName)} Brochure</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 12px;
      line-height: 1.45;
    }

    .brochure-container {
      width: 794px;
      min-width: 794px;
      max-width: 794px;
      margin: 0 auto;
      background: #ffffff;
      padding: 24px;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-sizing: border-box;
    }

    @media print {
      body {
        background: #ffffff;
      }
      .brochure-container {
        border: none;
        padding: 0;
        max-width: 100%;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
      .avoid-break {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 2px solid ${brandColor};
      margin-bottom: 20px;
    }

    .agency-branding {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .agency-logo {
      height: 44px;
      max-width: 130px;
      object-fit: contain;
      border-radius: 6px;
    }

    .agency-logo-placeholder {
      height: 42px;
      width: 42px;
      border-radius: 10px;
      background: ${brandColor};
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
    }

    .agency-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .agency-tagline {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }

    .header-contact {
      text-align: right;
      font-size: 11px;
      color: #475569;
    }

    .header-contact strong {
      color: #0f172a;
    }

    /* Property Hero Banner */
    .hero-section {
      margin-bottom: 20px;
    }

    .badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: ${brandColor};
      color: #ffffff;
    }

    .badge-outline {
      border: 1px solid #cbd5e1;
      color: #475569;
      background: #f8fafc;
    }

    .property-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 12px;
    }

    .property-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      flex: 1;
    }

    .price-tag-container {
      text-align: right;
      flex-shrink: 0;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 8px 14px;
      border-radius: 10px;
    }

    .price-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #15803d;
      letter-spacing: 0.05em;
    }

    .price-value {
      font-size: 20px;
      font-weight: 800;
      color: #166534;
    }

    .price-negotiable {
      font-size: 10px;
      color: #15803d;
      font-weight: 600;
    }

    .location-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    /* Images */
    .image-showcase {
      display: grid;
      grid-template-columns: ${galleryImages.length > 0 ? "2fr 1fr" : "1fr"};
      gap: 10px;
      margin-bottom: 20px;
    }

    .main-image-wrapper {
      height: 250px;
      border-radius: 12px;
      overflow: hidden;
      background: #e2e8f0;
    }

    .main-image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .gallery-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: 250px;
    }

    .gallery-item {
      flex: 1;
      border-radius: 10px;
      overflow: hidden;
      background: #e2e8f0;
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Key Specs Grid */
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 20px;
    }

    .spec-card {
      padding: 4px 6px;
    }

    .spec-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 0.03em;
      margin-bottom: 2px;
    }

    .spec-val {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }

    /* Description & Amenities 2-Col */
    .content-columns {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 18px;
      margin-bottom: 20px;
    }

    .section-box {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      background: #ffffff;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .description-text {
      color: #334155;
      font-size: 11.5px;
      line-height: 1.6;
      white-space: pre-line;
    }

    .amenities-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px 10px;
    }

    .amenity-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: #334155;
      font-weight: 500;
    }

    .amenity-check {
      color: ${brandColor};
      font-weight: 800;
      font-size: 11px;
    }

    /* Contact Box */
    .contact-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .agent-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .agent-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #cbd5e1;
      object-fit: cover;
    }

    .agent-avatar-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: ${brandColor};
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
    }

    .agent-name {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }

    .agent-role {
      font-size: 11px;
      color: #64748b;
    }

    .contact-items {
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: right;
      font-size: 11px;
      color: #334155;
    }

    .contact-items strong {
      color: #0f172a;
    }

    /* Footer */
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 9.5px;
      color: #94a3b8;
    }

    .disclaimer {
      max-width: 70%;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="brochure-container">
    <!-- Header -->
    <div class="header">
      <div class="agency-branding">
        ${
          logoUrl
            ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(orgName)}" class="agency-logo" crossorigin="anonymous" />`
            : `<div class="agency-logo-placeholder">${escapeHtml(orgName.charAt(0))}</div>`
        }
        <div>
          <div class="agency-title">${escapeHtml(orgName)}</div>
          ${orgTagline ? `<div class="agency-tagline">${escapeHtml(orgTagline)}</div>` : ""}
        </div>
      </div>

      <div class="header-contact">
        ${orgPhone ? `<div><strong>Phone:</strong> ${escapeHtml(orgPhone)}</div>` : ""}
        ${orgEmail ? `<div><strong>Email:</strong> ${escapeHtml(orgEmail)}</div>` : ""}
        ${orgWebsite ? `<div><strong>Web:</strong> ${escapeHtml(orgWebsite)}</div>` : ""}
      </div>
    </div>

    <!-- Hero Section -->
    <div class="hero-section">
      <div class="badge-row">
        <span class="badge badge-primary">${property.listingType === "RENT" ? "For Rent" : property.listingType === "LEASE" ? "Commercial Lease" : "For Sale"}</span>
        <span class="badge badge-outline">${escapeHtml(property.propertyType || "Property")}</span>
        ${furnishedText ? `<span class="badge badge-outline">${escapeHtml(furnishedText)}</span>` : ""}
        ${property.status === "SOLD" ? '<span class="badge" style="background:#ef4444;color:#fff;">Sold</span>' : ""}
        ${property.status === "RENTED" ? '<span class="badge" style="background:#f59e0b;color:#fff;">Rented</span>' : ""}
      </div>

      <div class="property-title-row">
        <h1 class="property-title">${escapeHtml(property.title)}</h1>
        <div class="price-tag-container">
          <div class="price-label">Price</div>
          <div class="price-value">${formattedPrice}</div>
          ${property.priceNegotiable ? '<div class="price-negotiable">(Negotiable)</div>' : ""}
        </div>
      </div>

      <div class="location-bar">
        📍 ${escapeHtml(fullAddress || "Location Available Upon Request")}
      </div>
    </div>

    <!-- Image Showcase -->
    <div class="image-showcase">
      <div class="main-image-wrapper">
        <img src="${escapeHtml(mainImage)}" alt="${escapeHtml(property.title)}" crossorigin="anonymous" />
      </div>
      ${
        galleryImages.length > 0
          ? `<div class="gallery-column">
              ${galleryImages
                .map(
                  (img) =>
                    `<div class="gallery-item"><img src="${escapeHtml(img.secureUrl)}" alt="${escapeHtml(property.title)}" crossorigin="anonymous" /></div>`
                )
                .join("")}
            </div>`
          : ""
      }
    </div>

    <!-- Key Specifications Grid -->
    <div class="specs-grid avoid-break">
      <div class="spec-card">
        <div class="spec-label">Bedrooms</div>
        <div class="spec-val">${specs.bedrooms ?? 0} Beds</div>
      </div>
      <div class="spec-card">
        <div class="spec-label">Bathrooms</div>
        <div class="spec-val">${specs.bathrooms ?? 0} Baths</div>
      </div>
      <div class="spec-card">
        <div class="spec-label">Property Size</div>
        <div class="spec-val">${formattedSize}</div>
      </div>
      <div class="spec-card">
        <div class="spec-label">Parking</div>
        <div class="spec-val">${specs.parkingSpaces ? `${specs.parkingSpaces} Spaces` : "N/A"}</div>
      </div>
      ${
        specs.floorNumber !== undefined && specs.floorNumber !== null
          ? `<div class="spec-card">
              <div class="spec-label">Floor</div>
              <div class="spec-val">${specs.floorNumber}${specs.totalFloors ? ` of ${specs.totalFloors}` : ""}</div>
            </div>`
          : ""
      }
      ${
        specs.yearBuilt
          ? `<div class="spec-card">
              <div class="spec-label">Year Built</div>
              <div class="spec-val">${specs.yearBuilt}</div>
            </div>`
          : ""
      }
      ${
        specs.landSize
          ? `<div class="spec-card">
              <div class="spec-label">Land Size</div>
              <div class="spec-val">${formatArea(specs.landSize, specs.landSizeUnit || "sqft")}</div>
            </div>`
          : ""
      }
      <div class="spec-card">
        <div class="spec-label">Furnishing</div>
        <div class="spec-val">${furnishedText || "Unfurnished"}</div>
      </div>
    </div>

    <!-- Description and Amenities -->
    <div class="content-columns avoid-break">
      <div class="section-box">
        <div class="section-title">Property Overview</div>
        <div class="description-text">${escapeHtml(property.description || "No description provided.")}</div>
      </div>

      <div class="section-box">
        <div class="section-title">Features & Amenities</div>
        ${
          amenitiesList.length > 0
            ? `<div class="amenities-list">
                ${amenitiesList
                  .map(
                    (amenity) =>
                      `<div class="amenity-pill"><span class="amenity-check">✓</span> ${escapeHtml(amenity)}</div>`
                  )
                  .join("")}
              </div>`
            : '<div style="color:#94a3b8;font-size:11px;">Standard features apply.</div>'
        }
      </div>
    </div>

    <!-- Contact & Agent Box -->
    <div class="contact-section avoid-break">
      <div class="agent-profile">
        ${
          agent?.avatar
            ? `<img src="${escapeHtml(agent.avatar)}" alt="${escapeHtml(agent.name || "Agent")}" class="agent-avatar" crossorigin="anonymous" />`
            : `<div class="agent-avatar-placeholder">${escapeHtml((agent?.name || orgName).charAt(0))}</div>`
        }
        <div>
          <div class="agent-name">${escapeHtml(agent?.name || orgName)}</div>
          <div class="agent-role">${agent?.name ? "Listing Agent" : "Official Agency Representative"} • ${escapeHtml(orgName)}</div>
          ${agent?.phone ? `<div style="font-size:11px;color:#475569;margin-top:2px;">Direct: ${escapeHtml(agent.phone)}</div>` : ""}
        </div>
      </div>

      <div class="contact-items">
        ${orgPhone ? `<div><strong>Office:</strong> ${escapeHtml(orgPhone)}</div>` : ""}
        ${orgWhatsapp ? `<div><strong>WhatsApp:</strong> ${escapeHtml(orgWhatsapp)}</div>` : ""}
        ${orgEmail ? `<div><strong>Inquiries:</strong> ${escapeHtml(orgEmail)}</div>` : ""}
        ${orgAddress ? `<div><strong>Address:</strong> ${escapeHtml(orgAddress)}</div>` : ""}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer avoid-break">
      <div class="disclaimer">
        Disclaimer: Information in this brochure is deemed reliable but is not guaranteed and should be independently verified. Properties are subject to prior sale, change, or withdrawal.
      </div>
      <div>
        REF: ${escapeHtml(property._id.toString().slice(-8).toUpperCase())} • ${formatDate(new Date())}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
