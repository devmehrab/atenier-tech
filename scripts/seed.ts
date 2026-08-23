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

// const MONGODB_URI =
// process.env.MONGODB_URI || "mongodb://localhost:27017/real_estate_saas";
const MONGODB_URI = "mongodb+srv://devmehrabhossain_db_user:pXGH0PoRVyGLNcDp@cluster0.ej9egor.mongodb.net/?appName=Cluster0";

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
    email: "admin@estatesphere.io",
    passwordHash: adminPasswordHash,
    role: "SYSTEM_ADMIN",
    status: "ACTIVE",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
  });
  console.log(" System Admin created: admin@estatesphere.io");

  // 2. Create Organization A: Rahman Properties
  console.log("🏢 Creating Organization A: Rahman Properties...");
  const ownerRahman = await User.create({
    name: "Farhan Rahman",
    email: "rahman@rahmanproperties.com",
    phone: "+880 1711-234567",
    passwordHash: defaultPasswordHash,
    role: "OWNER",
    status: "ACTIVE",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
  });

  const orgRahman = await Organization.create({
    name: "Rahman Properties",
    slug: "rahman-properties",
    ownerId: ownerRahman._id as any,
    description:
      "Premier real estate brokerage specializing in high-end residential apartments, penthouses, and bespoke commercial investments across Dhaka's most sought-after neighborhoods.",
    phone: "+880 1711-234567",
    email: "contact@rahmanproperties.com",
    whatsapp: "+8801711234567",
    address: "House 7, Road 11, Gulshan-1",
    city: "Dhaka",
    country: "BD",
    branding: {
      primaryColor: "#15803d",
      accentColor: "#c5a059",
      tagline: "Excellence in Modern Living",
    },
    settings: {
      defaultCurrency: "BDT",
      unitSystem: "SQFT",
      allowAgentListings: true,
    },
    socialLinks: {
      website: "https://rahmanproperties.com",
      facebook: "https://facebook.com/rahmanproperties",
      instagram: "https://instagram.com/rahmanproperties",
      linkedin: "https://linkedin.com/company/rahmanproperties",
    },
    coverImage: {
      publicId: "seed_rahman_cover",
      secureUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
      width: 2000,
      height: 1200,
      format: "jpg",
    },
    logo: {
      publicId: "seed_rahman_logo",
      secureUrl:
        "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=300&q=80",
      width: 300,
      height: 300,
      format: "jpg",
    },
    status: "ACTIVE",
  });

  ownerRahman.organizationId = orgRahman._id as any;
  await ownerRahman.save();

  // Create Staff Agent for Rahman Properties
  const agentSakib = await User.create({
    name: "Sakib Mia",
    email: "agent@rahmanproperties.com",
    phone: "+880 1812-345678",
    passwordHash: defaultPasswordHash,
    role: "AGENT",
    organizationId: orgRahman._id as any,
    status: "ACTIVE",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  });

  // Create Properties for Rahman Properties
  console.log("🏡 Seeding properties for Rahman Properties...");
  await Property.create([
    {
      organizationId: orgRahman._id,
      createdBy: ownerRahman._id,
      assignedAgent: agentSakib._id,
      title: "Modern Luxury Apartment in Gulshan",
      slug: "modern-luxury-apartment-in-gulshan",
      description:
        "An exquisitely appointed 3-bedroom residence offering floor-to-ceiling double-glazed windows, private elevator foyer, European kitchen cabinetry with integrated Miele appliances, and sweeping views over Gulshan Lake.\n\nBuilding features include 24/7 concierge, climate-controlled indoor pool, private resident lounge, and subterranean valet parking.",
      listingType: "SALE",
      propertyType: "APARTMENT",
      status: "PUBLISHED",
      price: 48000000,
      currency: "BDT",
      priceNegotiable: true,
      location: {
        address: "Road 104, Gulshan-2",
        city: "Dhaka",
        area: "Gulshan-2",
        country: "BD",
        zipCode: "1212",
        latitude: 23.7925,
        longitude: 90.4078,
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 3,
        parkingSpaces: 2,
        propertySize: 2450,
        propertySizeUnit: "sqft",
        floorNumber: 14,
        totalFloors: 22,
        yearBuilt: 2024,
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: [
        "Swimming Pool",
        "Fitness Center / Gym",
        "24/7 Security & CCTV",
        "Elevator / Lift",
        "Backup Generator",
        "Private Balcony",
        "Covered Parking",
        "Central Air Conditioning",
      ],
      images: [
        {
          publicId: "rahman_p1_1",
          secureUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
        {
          publicId: "rahman_p1_2",
          secureUrl:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          isFeatured: false,
          order: 1,
        },
        {
          publicId: "rahman_p1_3",
          secureUrl:
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
          isFeatured: false,
          order: 2,
        },
        {
          publicId: "rahman_p1_4",
          secureUrl:
            "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
          isFeatured: false,
          order: 3,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 142,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      organizationId: orgRahman._id,
      createdBy: agentSakib._id,
      assignedAgent: agentSakib._id,
      title: "Executive Lake View Penthouse",
      slug: "executive-lake-view-penthouse",
      description:
        "Soaring high above Gulshan Lake, this trophy duplex penthouse features private wraparound terraces, custom glass staircase, Italian marble bathrooms, and a dedicated chef's catering kitchen.\n\nEnjoy panoramic views with world-class residential amenities.",
      listingType: "RENT",
      propertyType: "PENTHOUSE",
      status: "PUBLISHED",
      price: 300000,
      currency: "BDT",
      pricePeriod: "MONTHLY",
      priceNegotiable: false,
      location: {
        address: "Road 27, Gulshan-1",
        city: "Dhaka",
        area: "Gulshan-1",
        country: "BD",
        zipCode: "1212",
      },
      specifications: {
        bedrooms: 4,
        bathrooms: 4.5,
        parkingSpaces: 2,
        propertySize: 3800,
        propertySizeUnit: "sqft",
        floorNumber: 12,
        totalFloors: 12,
        yearBuilt: 2023,
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: [
        "Swimming Pool",
        "Rooftop Terrace",
        "24/7 Security & CCTV",
        "Elevator / Lift",
        "Smart Home Automation",
        "Concierge Service",
      ],
      images: [
        {
          publicId: "rahman_p2_1",
          secureUrl:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
        {
          publicId: "rahman_p2_2",
          secureUrl:
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          isFeatured: false,
          order: 1,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 89,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      organizationId: orgRahman._id,
      createdBy: ownerRahman._id,
      title: "Prime Commercial Floor in Kawran Bazar",
      slug: "prime-commercial-floor-in-kawran-bazar",
      description:
        "Full-floor commercial office space with open plan layout, private executive boardrooms, dedicated server room, and high-speed elevator access. Ideal for financial, technology, or consulting firms.",
      listingType: "LEASE",
      propertyType: "COMMERCIAL",
      status: "PUBLISHED",
      price: 860000,
      currency: "BDT",
      pricePeriod: "MONTHLY",
      priceNegotiable: true,
      location: {
        address: "Panthapath, Kawran Bazar",
        city: "Dhaka",
        area: "Kawran Bazar",
        country: "BD",
        zipCode: "1215",
      },
      specifications: {
        bedrooms: 0,
        bathrooms: 4,
        parkingSpaces: 5,
        propertySize: 4800,
        propertySizeUnit: "sqft",
        floorNumber: 11,
        totalFloors: 20,
        yearBuilt: 2021,
        furnishedStatus: "UNFURNISHED",
      },
      amenities: [
        "24/7 Security & CCTV",
        "Backup Generator",
        "High-Speed Fiber Internet",
        "Elevator / Lift",
        "Fire Suppression System",
      ],
      images: [
        {
          publicId: "rahman_p3_1",
          secureUrl:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 45,
      isFeatured: false,
      publishedAt: new Date(),
    },
    {
      organizationId: orgRahman._id,
      createdBy: ownerRahman._id,
      title: "Bashundhara Garden Villa",
      slug: "bashundhara-garden-villa",
      description:
        "Stunning contemporary 5-bedroom private villa featuring landscaped private gardens, outdoor barbecue pavilion, solar energy integration, and 3-car garage.",
      listingType: "SALE",
      propertyType: "VILLA",
      status: "PUBLISHED",
      price: 65000000,
      currency: "BDT",
      priceNegotiable: true,
      location: {
        address: "Road 3, Bashundhara R/A",
        city: "Dhaka",
        area: "Bashundhara R/A",
        country: "BD",
        zipCode: "1229",
      },
      specifications: {
        bedrooms: 5,
        bathrooms: 5,
        parkingSpaces: 3,
        propertySize: 4500,
        propertySizeUnit: "sqft",
        landSize: 0.75,
        landSizeUnit: "acre",
        yearBuilt: 2022,
        furnishedStatus: "SEMI_FURNISHED",
      },
      amenities: [
        "Landscaped Garden",
        "Covered Parking",
        "Central Air Conditioning",
        "Pet Friendly",
        "Smart Home Automation",
      ],
      images: [
        {
          publicId: "rahman_p4_1",
          secureUrl:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 110,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      organizationId: orgRahman._id,
      createdBy: ownerRahman._id,
      title: "Draft Boutique Apartment Unit",
      slug: "draft-boutique-apartment-unit",
      description: "Upcoming listing undergoing professional photography.",
      listingType: "SALE",
      propertyType: "APARTMENT",
      status: "DRAFT",
      price: 32000000,
      currency: "BDT",
      priceNegotiable: true,
      location: {
        address: "House 45, Road 8A, Dhanmondi",
        city: "Dhaka",
        area: "Dhanmondi",
        country: "BD",
        zipCode: "1205",
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        propertySize: 1200,
        propertySizeUnit: "sqft",
        furnishedStatus: "UNFURNISHED",
      },
      amenities: ["Elevator / Lift"],
      images: [],
      viewsCount: 0,
      isFeatured: false,
    },
    {
      organizationId: orgRahman._id,
      createdBy: ownerRahman._id,
      title: "Hatirjheel Lakeside Residence",
      slug: "hatirjheel-lakeside-residence",
      description: "Successfully closed luxury residence.",
      listingType: "SALE",
      propertyType: "HOUSE",
      status: "SOLD",
      price: 95000000,
      currency: "BDT",
      priceNegotiable: false,
      location: {
        address: "Lake Circus, Hatirjheel",
        city: "Dhaka",
        area: "Hatirjheel",
        country: "BD",
        zipCode: "1000",
      },
      specifications: {
        bedrooms: 4,
        bathrooms: 4,
        propertySize: 3200,
        propertySizeUnit: "sqft",
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: ["Swimming Pool", "24/7 Security & CCTV"],
      images: [
        {
          publicId: "rahman_p6_1",
          secureUrl:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 310,
      isFeatured: false,
      publishedAt: new Date(),
    },
  ]);

  // Create Sample Inquiry Lead for Rahman Properties
  await Lead.create({
    organizationId: orgRahman._id,
    name: "Rafiqul Islam",
    email: "rafiqul.islam@example.com",
    phone: "+880 1912-345678",
    message:
      "Hi Farhan, I saw your Modern Luxury Apartment in Gulshan listing. Can we schedule a private in-person viewing this Saturday at 2 PM?",
    status: "NEW",
  });

  // 3. Create Organization B: Apex Realty Group
  console.log("🏢 Creating Organization B: Apex Realty Group...");
  const ownerApex = await User.create({
    name: "Imtiaz Chowdhury",
    email: "apex@apexrealty.com",
    phone: "+880 1715-678901",
    passwordHash: defaultPasswordHash,
    role: "OWNER",
    status: "ACTIVE",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  });

  const orgApex = await Organization.create({
    name: "Apex Realty Group",
    slug: "apex-realty",
    ownerId: ownerApex._id as any,
    description:
      "Chattogram-based real estate brokerage connecting investors and affluent families with coastal estates, architectural masterpieces, and commercial towers across the port city.",
    phone: "+880 1715-678901",
    email: "info@apexrealty.com",
    whatsapp: "+8801715678901",
    address: "GEC Circle, Agrabad",
    city: "Chattogram",
    country: "BD",
    branding: {
      primaryColor: "#0f172a",
      accentColor: "#38bdf8",
      tagline: "Visionary Properties Worldwide",
    },
    settings: {
      defaultCurrency: "BDT",
      unitSystem: "SQFT",
      allowAgentListings: true,
    },
    socialLinks: {
      website: "https://apexrealty.com",
      instagram: "https://instagram.com/apexrealty",
    },
    coverImage: {
      publicId: "seed_apex_cover",
      secureUrl:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85",
      width: 2000,
      height: 1200,
      format: "jpg",
    },
    status: "ACTIVE",
  });

  ownerApex.organizationId = orgApex._id as any;
  await ownerApex.save();

  // Create Properties for Apex Realty Group
  console.log("🏡 Seeding properties for Apex Realty...");
  await Property.create([
    {
      organizationId: orgApex._id,
      createdBy: ownerApex._id,
      title: "Patenga Oceanfront Villa",
      slug: "patenga-oceanfront-villa",
      description:
        "Spectacular modern coastal compound offering deepwater frontage along Patenga Beach, private yacht dock, zero-edge infinity pool, and smart home technology throughout.\n\nDesigned by renowned architects with custom teak and limestone finishes.",
      listingType: "SALE",
      propertyType: "VILLA",
      status: "PUBLISHED",
      price: 85000000,
      currency: "BDT",
      priceNegotiable: false,
      location: {
        address: "Patenga Sea Beach Road",
        city: "Chattogram",
        area: "Patenga",
        country: "BD",
        zipCode: "4204",
      },
      specifications: {
        bedrooms: 5,
        bathrooms: 6,
        parkingSpaces: 4,
        propertySize: 5500,
        propertySizeUnit: "sqft",
        landSize: 0.45,
        landSizeUnit: "acre",
        yearBuilt: 2023,
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: [
        "Swimming Pool",
        "Covered Parking",
        "Central Air Conditioning",
        "Smart Home Automation",
        "24/7 Security & CCTV",
      ],
      images: [
        {
          publicId: "apex_p1_1",
          secureUrl:
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 220,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      organizationId: orgApex._id,
      createdBy: ownerApex._id,
      title: "High-Rise Design Loft in Agrabad",
      slug: "high-rise-design-loft-in-agrabad",
      description:
        "Ultra-sleek 2-bedroom corner loft in Chattogram's commercial corridor. Features 12ft exposed concrete ceilings, floor-to-ceiling glass, Italian porcelain tile, and private sunset balcony.",
      listingType: "RENT",
      propertyType: "APARTMENT",
      status: "PUBLISHED",
      price: 55000,
      currency: "BDT",
      pricePeriod: "MONTHLY",
      priceNegotiable: true,
      location: {
        address: "Agrabad Commercial Area",
        city: "Chattogram",
        area: "Agrabad",
        country: "BD",
        zipCode: "4100",
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        parkingSpaces: 1,
        propertySize: 1550,
        propertySizeUnit: "sqft",
        floorNumber: 9,
        totalFloors: 14,
        yearBuilt: 2022,
        furnishedStatus: "FULLY_FURNISHED",
      },
      amenities: [
        "Swimming Pool",
        "Fitness Center / Gym",
        "Elevator / Lift",
        "Concierge Service",
        "Private Balcony",
      ],
      images: [
        {
          publicId: "apex_p2_1",
          secureUrl:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
          isFeatured: true,
          order: 0,
        },
      ],
      featuredImage:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      viewsCount: 95,
      isFeatured: true,
      publishedAt: new Date(),
    },
  ]);

  console.log("\n Seed completed successfully!");
  console.log("==================================================");
  console.log("👥 TEST ACCOUNTS CREATED:");
  console.log("1. System Administrator:");
  console.log("   Email:    admin@estatesphere.io");
  console.log("   Password: admin123");
  console.log("   Console:  /system-admin");
  console.log("--------------------------------------------------");
  console.log("2. Organization A (Rahman Properties):");
  console.log("   Owner:    rahman@rahmanproperties.com / password123");
  console.log("   Agent:    agent@rahmanproperties.com / password123");
  console.log("   Public:   /rahman-properties");
  console.log("   Dashboard: /dashboard");
  console.log("--------------------------------------------------");
  console.log("3. Organization B (Apex Realty):");
  console.log("   Owner:    apex@apexrealty.com / password123");
  console.log("   Public:   /apex-realty");
  console.log("   Dashboard: /dashboard");
  console.log("==================================================");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});