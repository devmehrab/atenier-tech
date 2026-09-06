import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { User } from "../src/lib/db/models/User";
import { Organization } from "../src/lib/db/models/Organization";
import { Property } from "../src/lib/db/models/Property";
import { Lead } from "../src/lib/db/models/Lead";
import { hashPassword } from "../src/lib/auth/password";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/real_estate_saas";

async function seed() {
  console.log("🌱 Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log(" Connected to database.");

  console.log("🧹 Cleaning existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Organization.deleteMany({}),
    Property.deleteMany({}),
    Lead.deleteMany({}),
  ]);
  console.log(" Collections cleared.");

  const defaultPasswordHash = await hashPassword("password123");
  const adminPasswordHash = await hashPassword("admin123");

  // 1. Create System Admin
  console.log(" Creating System Administrator...");
  const systemAdmin = await User.create({
    name: "System Administrator",
    email: "admin@atenier.com",
    passwordHash: adminPasswordHash,
    role: "SYSTEM_ADMIN",
    status: "ACTIVE",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
  });
  console.log(" System Admin created: admin@atenier.com");

  // 2. Create Organization A: Apex Realty Group (Manhattan, New York, USD)
  console.log("🏢 Creating Organization A: Apex Realty Group...");
  const ownerApex = await User.create({
    name: "Alexander Wright",
    email: "alexander@apexrealty.com",
    phone: "+1 (212) 555-0198",
    passwordHash: defaultPasswordHash,
    role: "OWNER",
    status: "ACTIVE",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
  });

  const orgApex = await Organization.create({
    name: "Apex Realty Group",
    slug: "apex-realty",
    ownerId: ownerApex._id as any,
    description:
      "Premier Manhattan luxury brokerage specializing in trophy penthouses, historic brownstones, and high-yield commercial assets across New York's most prestigious avenues.",
    phone: "+1 (212) 555-0198",
    email: "contact@apexrealty.com",
    whatsapp: "+12125550198",
    address: "740 Park Avenue, Upper East Side",
    city: "New York",
    country: "US",
    branding: {
      primaryColor: "#0f172a",
      accentColor: "#c5a059",
      tagline: "Unrivaled Real Estate Excellence",
    },
    settings: {
      defaultCurrency: "USD",
      unitSystem: "SQFT",
      allowAgentListings: true,
    },
    socialLinks: {
      website: "https://apexrealty.com",
      facebook: "https://facebook.com/apexrealty",
      instagram: "https://instagram.com/apexrealty",
      linkedin: "https://linkedin.com/company/apexrealty",
    },
    coverImage: {
      publicId: "seed_apex_cover",
      secureUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
      width: 2000,
      height: 1200,
      format: "jpg",
    },
    logo: {
      publicId: "seed_apex_logo",
      secureUrl:
        "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=300&q=80",
      width: 300,
      height: 300,
      format: "jpg",
    },
    status: "ACTIVE",
  });

  ownerApex.organizationId = orgApex._id as any;
  await ownerApex.save();

  // Create Staff Agent for Apex Realty
  const agentSarah = await User.create({
    name: "Sarah Jenkins",
    email: "sarah@apexrealty.com",
    phone: "+1 (212) 555-0245",
    passwordHash: defaultPasswordHash,
    role: "AGENT",
    organizationId: orgApex._id as any,
    status: "ACTIVE",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  });

  // Create Properties for Apex Realty Group
  console.log("🏡 Seeding properties for Apex Realty...");
  await Property.create([
    {
      organizationId: orgApex._id,
      createdBy: ownerApex._id,
      assignedAgent: agentSarah._id,
      title: "Park Avenue Luxury Duplex Penthouse",
      slug: "park-avenue-luxury-duplex-penthouse",
      description:
        "An exquisitely appointed 4-bedroom trophy residence offering floor-to-ceiling double-glazed glass, private elevator vestibule, bespoke Poliform kitchen with integrated Gaggenau appliances, and 360-degree skyline vistas over Central Park.\n\nBuilding features include 24/7 doorman and concierge, heated 75-foot lap pool, private resident dining room, and automated subterranean parking.",
      listingType: "SALE",
      propertyType: "PENTHOUSE",
      status: "PUBLISHED",
      price: 12500000,
      currency: "USD",
      priceNegotiable: true,
      location: {
        address: "740 Park Avenue",
        city: "New York",
        area: "Upper East Side",
        state: "NY",
        country: "United States",
        zipCode: "10021",
        latitude: 40.7736,
        longitude: -73.9654,
      },
      specifications: {
        bedrooms: 4,
        bathrooms: 4.5,
        parkingSpaces: 2,
        propertySize: 4200,
        propertySizeUnit: "sqft",
        floorNumber: 34,
        totalFloors: 36,
        yearBuilt: 2024,
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: [
        "Private Elevator",
        "Central Park Views",
        "24/7 Concierge & Doorman",
        "Indoor Heated Pool",
        "Private Wine Cellar",
        "Fitness Center & Spa",
        "Terrace & Outdoor Kitchen",
        "Smart Home Automation",
      ],
      images: [
        {
          publicId: "apex_p1_1",
          secureUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
        {
          publicId: "apex_p1_2",
          secureUrl:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          isFeatured: false,
          order: 1,
        },
        {
          publicId: "apex_p1_3",
          secureUrl:
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
          isFeatured: false,
          order: 2,
        },
        {
          publicId: "apex_p1_4",
          secureUrl:
            "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
          isFeatured: false,
          order: 3,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 284,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      organizationId: orgApex._id,
      createdBy: agentSarah._id,
      assignedAgent: agentSarah._id,
      title: "TriBeCa Cast-Iron Architectural Loft",
      slug: "tribeca-cast-iron-architectural-loft",
      description:
        "Soaring 13-foot ceilings and authentic Corinthian cast-iron columns define this exceptional TriBeCa corner loft. Featuring French white oak chevron flooring, wood-burning fireplace, and custom Calacatta marble bathrooms.\n\nSituated in a boutique pre-war condominium with virtual concierge and key-locked elevator access.",
      listingType: "RENT",
      propertyType: "APARTMENT",
      status: "PUBLISHED",
      price: 18500,
      currency: "USD",
      pricePeriod: "MONTHLY",
      priceNegotiable: false,
      location: {
        address: "68 Franklin Street",
        city: "New York",
        area: "TriBeCa",
        state: "NY",
        country: "United States",
        zipCode: "10013",
        latitude: 40.7180,
        longitude: -74.0060,
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 3,
        parkingSpaces: 1,
        propertySize: 2850,
        propertySizeUnit: "sqft",
        floorNumber: 4,
        totalFloors: 7,
        yearBuilt: 2023,
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: [
        "Keyed Elevator Access",
        "High Ceilings",
        "Fireplace",
        "Central Air Conditioning",
        "Wine Storage",
        "Bicycle Storage",
      ],
      images: [
        {
          publicId: "apex_p2_1",
          secureUrl:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
        {
          publicId: "apex_p2_2",
          secureUrl:
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          isFeatured: false,
          order: 1,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 165,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      organizationId: orgApex._id,
      createdBy: ownerApex._id,
      title: "Midtown Manhattan Corporate Executive Tower",
      slug: "midtown-manhattan-corporate-executive-tower",
      description:
        "Full-floor commercial office space with unobstructed skyline views, open collaboration zones, acoustic executive boardrooms, dedicated server room, and high-speed destination dispatch elevators.",
      listingType: "LEASE",
      propertyType: "COMMERCIAL",
      status: "PUBLISHED",
      price: 45000,
      currency: "USD",
      pricePeriod: "MONTHLY",
      priceNegotiable: true,
      location: {
        address: "535 Fifth Avenue",
        city: "New York",
        area: "Midtown Manhattan",
        state: "NY",
        country: "United States",
        zipCode: "10017",
        latitude: 40.7549,
        longitude: -73.9787,
      },
      specifications: {
        bedrooms: 0,
        bathrooms: 6,
        parkingSpaces: 6,
        propertySize: 8500,
        propertySizeUnit: "sqft",
        floorNumber: 28,
        totalFloors: 42,
        yearBuilt: 2022,
        furnishedStatus: "UNFURNISHED",
      },
      amenities: [
        "24/7 Security & CCTV",
        "Backup Power Generation",
        "High-Speed Fiber Infrastructure",
        "Destination Dispatch Elevators",
        "LEED Gold Certified",
      ],
      images: [
        {
          publicId: "apex_p3_1",
          secureUrl:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 92,
      isFeatured: false,
      publishedAt: new Date(),
    },
    {
      organizationId: orgApex._id,
      createdBy: ownerApex._id,
      title: "Southampton Modern Oceanfront Estate",
      slug: "southampton-modern-oceanfront-estate",
      description:
        "Stunning contemporary 6-bedroom private coastal compound featuring direct ocean frontage, private boardwalk to beach, heated gunite infinity pool, and outdoor kitchen pavilion.",
      listingType: "SALE",
      propertyType: "VILLA",
      status: "PUBLISHED",
      price: 24000000,
      currency: "USD",
      priceNegotiable: true,
      location: {
        address: "1420 Meadow Lane",
        city: "Southampton",
        area: "The Hamptons",
        state: "NY",
        country: "United States",
        zipCode: "11968",
        latitude: 40.8710,
        longitude: -72.3926,
      },
      specifications: {
        bedrooms: 6,
        bathrooms: 7,
        parkingSpaces: 4,
        propertySize: 7200,
        propertySizeUnit: "sqft",
        landSize: 1.8,
        landSizeUnit: "acre",
        yearBuilt: 2023,
        furnishedStatus: "SEMI_FURNISHED",
      },
      amenities: [
        "Direct Ocean Access",
        "Gunite Infinity Pool",
        "Tennis Court",
        "Smart Home Automation",
        "Tesla EV Charging",
        "Wine Cellar",
      ],
      images: [
        {
          publicId: "apex_p4_1",
          secureUrl:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 215,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      organizationId: orgApex._id,
      createdBy: ownerApex._id,
      title: "SoHo Historic Cast-Iron Loft",
      slug: "soho-historic-cast-iron-loft",
      description: "Upcoming exclusive residential listing undergoing architectural photography.",
      listingType: "SALE",
      propertyType: "APARTMENT",
      status: "DRAFT",
      price: 4200000,
      currency: "USD",
      priceNegotiable: true,
      location: {
        address: "112 Spring Street",
        city: "New York",
        area: "SoHo",
        state: "NY",
        country: "United States",
        zipCode: "10012",
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        propertySize: 1650,
        propertySizeUnit: "sqft",
        furnishedStatus: "UNFURNISHED",
      },
      amenities: ["Keyed Elevator", "Exposed Brick"],
      images: [],
      viewsCount: 0,
      isFeatured: false,
    },
    {
      organizationId: orgApex._id,
      createdBy: ownerApex._id,
      title: "West Village Historic Greek Revival Townhouse",
      slug: "west-village-historic-greek-revival-townhouse",
      description: "Successfully represented buyers on this landmark West Village single-family residence.",
      listingType: "SALE",
      propertyType: "HOUSE",
      status: "SOLD",
      price: 16800000,
      currency: "USD",
      priceNegotiable: false,
      location: {
        address: "72 Perry Street",
        city: "New York",
        area: "West Village",
        state: "NY",
        country: "United States",
        zipCode: "10014",
        latitude: 40.7359,
        longitude: -74.0048,
      },
      specifications: {
        bedrooms: 5,
        bathrooms: 5.5,
        propertySize: 4800,
        propertySizeUnit: "sqft",
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: ["Private Courtyard Garden", "Wine Cellar", "Security System"],
      images: [
        {
          publicId: "apex_p6_1",
          secureUrl:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 430,
      isFeatured: false,
      publishedAt: new Date(),
    },
  ]);

  // Create Sample Inquiry Lead for Apex Realty
  await Lead.create({
    organizationId: orgApex._id,
    name: "Julian Vance",
    email: "julian.vance@example.com",
    phone: "+1 (415) 555-0143",
    message:
      "Hi Alexander, I saw your Park Avenue Luxury Duplex Penthouse listing. Can we schedule a private in-person viewing this Saturday at 2 PM?",
    status: "NEW",
  });

  // 3. Create Organization B: Skyline Capital Properties (London, UK, GBP)
  console.log("🏢 Creating Organization B: Skyline Capital Properties...");
  const ownerSkyline = await User.create({
    name: "Victoria Sterling",
    email: "victoria@skylineproperties.com",
    phone: "+44 20 7946 0912",
    passwordHash: defaultPasswordHash,
    role: "OWNER",
    status: "ACTIVE",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  });

  const orgSkyline = await Organization.create({
    name: "Skyline Capital Properties",
    slug: "skyline-capital",
    ownerId: ownerSkyline._id as any,
    description:
      "London-based private brokerage advising international ultra-high-net-worth individuals on prime central London acquisitions, Mayfair townhouses, and royal borough residences.",
    phone: "+44 20 7946 0912",
    email: "inquiries@skylineproperties.com",
    whatsapp: "+442079460912",
    address: "14 Berkeley Square, Mayfair",
    city: "London",
    country: "GB",
    branding: {
      primaryColor: "#0f172a",
      accentColor: "#38bdf8",
      tagline: "Distinguished London & International Living",
    },
    settings: {
      defaultCurrency: "GBP",
      unitSystem: "SQFT",
      allowAgentListings: true,
    },
    socialLinks: {
      website: "https://skylineproperties.com",
      instagram: "https://instagram.com/skylineproperties",
    },
    coverImage: {
      publicId: "seed_skyline_cover",
      secureUrl:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85",
      width: 2000,
      height: 1200,
      format: "jpg",
    },
    status: "ACTIVE",
  });

  ownerSkyline.organizationId = orgSkyline._id as any;
  await ownerSkyline.save();

  // Create Properties for Skyline Capital Properties
  console.log("🏡 Seeding properties for Skyline Capital...");
  await Property.create([
    {
      organizationId: orgSkyline._id,
      createdBy: ownerSkyline._id,
      title: "Mayfair Private Garden Villa",
      slug: "mayfair-private-garden-villa",
      description:
        "Spectacular Georgian mansion offering private landscaped gardens, mews house, passenger elevator, private spa with hydrotherapy pool, and secure subterranean garaging.\n\nImpeccably restored by award-winning interior designers with French polished oak and Calacatta marble.",
      listingType: "SALE",
      propertyType: "VILLA",
      status: "PUBLISHED",
      price: 18500000,
      currency: "GBP",
      priceNegotiable: false,
      location: {
        address: "22 Charles Street",
        city: "London",
        area: "Mayfair",
        country: "United Kingdom",
        zipCode: "W1J 5DX",
        latitude: 51.5074,
        longitude: -0.1478,
      },
      specifications: {
        bedrooms: 5,
        bathrooms: 6,
        parkingSpaces: 3,
        propertySize: 6200,
        propertySizeUnit: "sqft",
        landSize: 0.25,
        landSizeUnit: "acre",
        yearBuilt: 2023,
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: [
        "Private Garden",
        "Mews House",
        "Passenger Lift",
        "Indoor Spa & Pool",
        "Wine Cellar",
        "24/7 Security",
      ],
      images: [
        {
          publicId: "skyline_p1_1",
          secureUrl:
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 310,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      organizationId: orgSkyline._id,
      createdBy: ownerSkyline._id,
      title: "Kensington Contemporary Lateral Apartment",
      slug: "kensington-contemporary-lateral-apartment",
      description:
        "Ultra-refined 3-bedroom lateral apartment in Kensington's most coveted private development. Features 11-foot ceilings, direct garden square access, bespoke kitchen joinery, and 24-hour Harrods concierge service.",
      listingType: "RENT",
      propertyType: "APARTMENT",
      status: "PUBLISHED",
      price: 12000,
      currency: "GBP",
      pricePeriod: "MONTHLY",
      priceNegotiable: true,
      location: {
        address: "Kensington High Street",
        city: "London",
        area: "Kensington",
        country: "United Kingdom",
        zipCode: "W8 5SA",
        latitude: 51.5014,
        longitude: -0.1934,
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 3,
        parkingSpaces: 1,
        propertySize: 2100,
        propertySizeUnit: "sqft",
        floorNumber: 3,
        totalFloors: 6,
        yearBuilt: 2022,
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: [
        "Swimming Pool",
        "Fitness Suite",
        "24-Hour Concierge",
        "Underground Parking",
        "Private Balcony",
      ],
      images: [
        {
          publicId: "skyline_p2_1",
          secureUrl:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 140,
      isFeatured: true,
      publishedAt: new Date(),
    },
  ]);

  console.log("\n Seed completed successfully!");
  console.log("==================================================");
  console.log("👥 TEST ACCOUNTS CREATED:");
  console.log("1. System Administrator:");
  console.log("   Email:    admin@atenier.com");
  console.log("   Password: admin123");
  console.log("   Console:  /system-admin");
  console.log("--------------------------------------------------");
  console.log("2. Organization A (Apex Realty Group - New York, USD):");
  console.log("   Owner:    alexander@apexrealty.com / password123");
  console.log("   Agent:    sarah@apexrealty.com / password123");
  console.log("   Public:   /apex-realty");
  console.log("   Dashboard: /dashboard");
  console.log("--------------------------------------------------");
  console.log("3. Organization B (Skyline Capital Properties - London, GBP):");
  console.log("   Owner:    victoria@skylineproperties.com / password123");
  console.log("   Public:   /skyline-capital");
  console.log("   Dashboard: /dashboard");
  console.log("==================================================");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});