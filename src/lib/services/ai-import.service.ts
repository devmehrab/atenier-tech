import Groq from "groq-sdk";
import {
  extractedPropertySchema,
  ExtractedPropertyValues,
} from "@/lib/validations/ai-import";

// Primary and fallback models supported by Groq
const PRIMARY_MODEL = "openai/gpt-oss-20b";
const FALLBACK_MODEL = "llama-3.3-70b-versatile";

const JSON_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: ["string", "null"],
      description:
        "A concise, professional property title (e.g., 'Modern 3BHK Apartment in Bashundhara R/A (1650 sqft)')",
    },
    description: {
      type: ["string", "null"],
      description:
        "Detailed property description summarizing all key features and context from the post",
    },
    listingType: {
      type: ["string", "null"],
      enum: ["SALE", "RENT", "LEASE", null],
      description:
        "Purpose: SALE (বিক্রি/বিক্রয়/buy), RENT (ভাড়া/to-let/rent), or LEASE (লিজ)",
    },
    propertyType: {
      type: ["string", "null"],
      enum: [
        "APARTMENT",
        "HOUSE",
        "VILLA",
        "COMMERCIAL",
        "LAND",
        "OFFICE",
        "PENTHOUSE",
        "TOWNHOUSE",
        null,
      ],
      description: "Category of the property",
    },
    price: {
      type: ["number", "null"],
      description:
        "Total numeric asking price or monthly rent normalized to BDT Taka (e.g. 1.85 crore = 18500000, 65k = 65000, 1.2 lakh = 120000). Return null if not stated.",
    },
    currency: {
      type: "string",
      default: "BDT",
    },
    priceNegotiable: {
      type: "boolean",
      description:
        "True if caption mentions negotiable, আলোচনা সাপেক্ষ, or negotiable price",
    },
    pricePeriod: {
      type: ["string", "null"],
      enum: ["MONTHLY", "YEARLY", null],
      description: "MONTHLY for rent listings, null for sales",
    },
    location: {
      type: "object",
      properties: {
        address: {
          type: ["string", "null"],
          description: "Street, road number, block, or holding address if present",
        },
        area: {
          type: ["string", "null"],
          description:
            "Area, neighborhood, or thana (e.g., Gulshan-2, Banani, Bashundhara R/A, Dhanmondi, Uttara)",
        },
        city: {
          type: ["string", "null"],
          description: "City or District (e.g. Dhaka, Chittagong, Sylhet)",
        },
        state: {
          type: ["string", "null"],
        },
        country: {
          type: "string",
          default: "Bangladesh",
        },
        zipCode: {
          type: ["string", "null"],
        },
      },
      required: ["country"],
    },
    specifications: {
      type: "object",
      properties: {
        bedrooms: {
          type: ["number", "null"],
          description: "Number of bedrooms (বেড / বেডরুম)",
        },
        bathrooms: {
          type: ["number", "null"],
          description: "Number of bathrooms (বাথ / বাথরুম)",
        },
        parkingSpaces: {
          type: ["number", "null"],
          description: "Number of parking spaces (পার্কিং)",
        },
        propertySize: {
          type: ["number", "null"],
          description: "Floor area or flat size in square feet or units",
        },
        propertySizeUnit: {
          type: "string",
          enum: ["sqft", "sqm", "katha"],
          default: "sqft",
        },
        landSize: {
          type: ["number", "null"],
          description: "Land or plot size (কাঠা / শতক / ডেসিমাল)",
        },
        landSizeUnit: {
          type: ["string", "null"],
          enum: ["sqft", "sqm", "katha", "acre", "decimal", "bigha", null],
        },
        floorNumber: {
          type: ["number", "null"],
          description: "Floor number / level (e.g. 6th floor = 6)",
        },
        totalFloors: {
          type: ["number", "null"],
          description: "Total building floors (e.g. G+9 = 10)",
        },
        yearBuilt: {
          type: ["number", "null"],
        },
        furnishedStatus: {
          type: "string",
          enum: ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"],
          default: "UNFURNISHED",
        },
      },
      required: ["propertySizeUnit", "furnishedStatus"],
    },
    amenities: {
      type: "array",
      items: { type: "string" },
      description:
        "List of amenities mentioned (e.g., 'Full Generator Backup (100%)', 'High-Speed Passenger Lift', '24/7 Security & CCTV Surveillance', 'Covered Car Parking', 'Titas Gas Connection / Central LPG', 'Intercom & Video Door Phone', 'Fitness Center / Gymnasium', 'Rooftop Garden & Community Hall')",
    },
    contactInfo: {
      type: "object",
      properties: {
        phone: { type: ["string", "null"] },
        email: { type: ["string", "null"] },
        whatsapp: { type: ["string", "null"] },
      },
    },
  },
  required: [
    "listingType",
    "propertyType",
    "currency",
    "priceNegotiable",
    "location",
    "specifications",
    "amenities",
  ],
};

const SYSTEM_PROMPT = `You are an expert AI parser specialized in Bangladeshi real estate listings and Facebook property posts.
Your task is to parse unstructured property post captions (in Bengali, English, or Banglish) into structured property listing data adhering strictly to the provided JSON schema.

CRITICAL PARSING RULES:
1. BANGLADESH NUMERICAL CONVERSIONS:
   - "কোটি" / "crore" / "cr" = 10,000,000 (e.g., "1.85 কোটি" -> price: 18500000, "2.2 Cr" -> 22000000)
   - "লাখ" / "লক্ষ" / "lakh" / "lac" = 100,000 (e.g., "75 লাখ" -> 7500000, "1.5 Lakh" -> 150000)
   - "হাজার" / "k" / "thousand" = 1,000 (e.g., "65 হাজার" / "65k" -> 65000)
   - If price is not mentioned, return price: null.

2. LISTING & PROPERTY TYPES:
   - ListingType:
     * "ভাড়া" / "ভাড়া হবে" / "To-Let" / "Rent" -> "RENT" (set pricePeriod to "MONTHLY")
     * "বিক্রি" / "বিক্রয়" / "বিক্রি হবে" / "Sale" / "For Sale" -> "SALE" (pricePeriod: null)
     * "লিজ" / "Lease" -> "LEASE"
   - PropertyType:
     * "ফ্ল্যাট" / "অ্যাপার্টমেন্ট" / "Flat" / "Apartment" -> "APARTMENT"
     * "বাড়ি" / "বিল্ডিং" / "House" / "Building" -> "HOUSE"
     * "ডুপ্লেক্স" / "ভিলা" / "Duplex" / "Villa" -> "VILLA"
     * "পেন্টহাউস" / "Penthouse" -> "PENTHOUSE"
     * "বাণিজ্যিক স্পেস" / "দোকান" / "Commercial" / "Shop" -> "COMMERCIAL"
     * "অফিস" / "Office" -> "OFFICE"
     * "জমি" / "প্লট" / "Land" / "Plot" -> "LAND"
     * "টাউনহাউস" / "Townhouse" -> "TOWNHOUSE"

3. DIMENSIONS & ROOMS:
   - "1650 sft" / "1650 sqft" / "১৬৫০ স্কয়ার ফিট" -> specifications.propertySize: 1650, propertySizeUnit: "sqft"
   - "5 কাঠা" / "5 katha" -> specifications.landSize: 5, landSizeUnit: "katha"
   - "3 bed" / "৩ বেড" / "3 bedroom" -> specifications.bedrooms: 3
   - "3 bath" / "৩ বাথ" / "3 বাথরুম" -> specifications.bathrooms: 3
   - "1 parking" / "১ পার্কিং" -> specifications.parkingSpaces: 1
   - "6th floor" / "৬ষ্ঠ তলা" -> specifications.floorNumber: 6

4. AMENITIES IDENTIFICATION:
   - Lift / লিফট -> "High-Speed Passenger Lift"
   - Generator / জেনারেটর / 100% backup -> "Full Generator Backup (100%)"
   - Security / CCTV / গার্ড -> "24/7 Security & CCTV Surveillance"
   - Parking / পার্কিং -> "Covered Car Parking"
   - Gas / Titas Gas / গ্যাস / এলপিজি -> "Titas Gas Connection / Central LPG"
   - Intercom / ইন্টারকম -> "Intercom & Video Door Phone"
   - Gym / জিম -> "Fitness Center / Gymnasium"
   - Swimming Pool / সুইমিং পুল -> "Swimming Pool"
   - Rooftop Garden / ছাদ বাগান -> "Rooftop Garden & Community Hall"
   - Prayer Room / নামাজের ঘর -> "Dedicated Prayer Room (Namaz Hall)"

5. STRICT ANTI-HALLUCINATION:
   - Extract ONLY information present or directly inferable from the caption.
   - If a field is not in the caption, set it to null. DO NOT invent fake prices, bedroom counts, or addresses.
   - Generate a clean, descriptive property title (e.g., "South-Facing 3BHK Luxury Apartment in Gulshan-2").`;

/**
 * Extracts structured property information from a single caption using Groq.
 */
export async function extractPropertyFromCaption(
  caption: string
): Promise<ExtractedPropertyValues> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    // If no Groq API key is set, use the robust local heuristic parser
    console.warn(
      "GROQ_API_KEY not configured. Falling back to local heuristic extraction."
    );
    return heuristicFallbackExtract(caption);
  }

  const groq = new Groq({ apiKey });

  try {
    // Attempt with Primary Model
    return await callGroqExtraction(groq, PRIMARY_MODEL, caption);
  } catch (primaryErr: any) {
    console.warn(
      `Groq extraction with ${PRIMARY_MODEL} failed: ${primaryErr.message}. Retrying with ${FALLBACK_MODEL}...`
    );
    try {
      // Attempt with Fallback Model
      return await callGroqExtraction(groq, FALLBACK_MODEL, caption);
    } catch (fallbackErr: any) {
      console.error(
        `Groq extraction with ${FALLBACK_MODEL} also failed: ${fallbackErr.message}. Using heuristic fallback.`
      );
      return heuristicFallbackExtract(caption);
    }
  }
}

async function callGroqExtraction(
  groq: Groq,
  model: string,
  caption: string
): Promise<ExtractedPropertyValues> {
  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Parse the following Bangladeshi real estate Facebook post caption into the required structured JSON format:\n\n${caption}`,
      },
    ],
    response_format: {
      type: "json_object",
    },
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response returned from Groq model");
  }

  const parsed = JSON.parse(content);
  return extractedPropertySchema.parse(parsed);
}

/**
 * Converts Bengali digits (০-৯) to Arabic numerals (0-9).
 */
function normalizeBengaliDigits(str: string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[০-৯]/g, (d) => bnDigits.indexOf(d).toString());
}

/**
 * Robust regex-based heuristic extractor for offline/fallback environments.
 */
export function heuristicFallbackExtract(caption: string): ExtractedPropertyValues {
  const rawText = caption.trim();
  const text = normalizeBengaliDigits(rawText);

  // 1. Listing Type
  let listingType: "SALE" | "RENT" | "LEASE" = "SALE";
  let pricePeriod: "MONTHLY" | "YEARLY" | null = null;
  if (/ভাড়া|ভাড়া\s*হবে|to-let|to\s*let|rent|for\s*rent/i.test(text)) {
    listingType = "RENT";
    pricePeriod = "MONTHLY";
  } else if (/lease|লিজ/i.test(text)) {
    listingType = "LEASE";
  }

  // 2. Property Type
  let propertyType:
    | "APARTMENT"
    | "HOUSE"
    | "VILLA"
    | "COMMERCIAL"
    | "LAND"
    | "OFFICE"
    | "PENTHOUSE"
    | "TOWNHOUSE" = "APARTMENT";

  if (/ডুপ্লেক্স|duplex|villa|ভীলা|ভিলা/i.test(text)) propertyType = "VILLA";
  else if (/পেন্টহাউস|penthouse/i.test(text)) propertyType = "PENTHOUSE";
  else if (/বাণিজ্যিক|commercial|দোকান|shop/i.test(text)) propertyType = "COMMERCIAL";
  else if (/অফিস|office/i.test(text)) propertyType = "OFFICE";
  else if (/জমি|প্লট|land|plot/i.test(text)) propertyType = "LAND";
  else if (/বাড়ি|বিল্ডিং|house|building/i.test(text)) propertyType = "HOUSE";

  // 3. Bedrooms
  let bedrooms: number | null = null;
  const bedMatch =
    text.match(/(?:বেডরুম|বেড|bed|bhk|bedroom|শয়নকক্ষ)[:\s]*(\d+)/i) ||
    text.match(/(\d+)\s*(?:টি\s*)?(?:বেডরুম|বেড|bed|bhk|bedroom|শয়নকক্ষ)/i);
  if (bedMatch) bedrooms = parseInt(bedMatch[1], 10);

  // 4. Bathrooms
  let bathrooms: number | null = null;
  const bathMatch =
    text.match(/(?:বাথরুম|বাথ|bath|bathroom|গোসলখানা)[:\s]*(\d+)/i) ||
    text.match(/(\d+)\s*(?:টি\s*)?(?:বাথরুম|বাথ|bath|bathroom|গোসলখানা)/i);
  if (bathMatch) bathrooms = parseInt(bathMatch[1], 10);

  // 5. Size (sqft / sft)
  let propertySize: number | null = null;
  const sizeMatch =
    text.match(/(?:সাইজ|size|আয়তন)[:\s]*(\d{3,5})/i) ||
    text.match(/(\d{3,5})\s*(?:sft|sqft|sq\s*ft|স্কয়ার\s*ফিট|স্কয়ার\s*ফিট|বর্গফুট)/i);
  if (sizeMatch) propertySize = parseInt(sizeMatch[1], 10);

  // 6. Price (handles compound like: 2 কোটি 25 লাখ or 1.85 crore or 75 lakh or 55,000)
  let price: number | null = null;
  let priceNegotiable = /আলোচনা\s*সাপেক্ষ|negotiable|আলোচনাযোগ্য|নেগোসিয়েবল/i.test(text);

  // Compound crore + lakh match (e.g. 2 কোটি 25 লাখ / 2 crore 25 lakh)
  const compoundMatch = text.match(
    /(\d+(?:\.\d+)?)\s*(?:কোটি|crore|cr)(?:\s*(\d+(?:\.\d+)?)\s*(?:লাখ|লক্ষ|lakh|lac))?/i
  );
  if (compoundMatch) {
    const croreVal = parseFloat(compoundMatch[1]) * 10000000;
    const lakhVal = compoundMatch[2] ? parseFloat(compoundMatch[2]) * 100000 : 0;
    price = Math.round(croreVal + lakhVal);
  } else {
    // Lakh match (e.g. 75 lakh / 75 লাখ)
    const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:লাখ|লক্ষ|lakh|lac)/i);
    if (lakhMatch) {
      price = Math.round(parseFloat(lakhMatch[1]) * 100000);
    } else {
      // Thousand / K match (e.g. 45k / 45 হাজার)
      const thousandMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:হাজার|k\b|thousand)/i);
      if (thousandMatch) {
        price = Math.round(parseFloat(thousandMatch[1]) * 1000);
      } else {
        // Direct number match near price/মূল্য
        const directPrice = text.match(/(?:মূল্য|price|ভাড়া|rent)[:\s]*৳?\s*([\d,]{4,12})/i);
        if (directPrice) {
          price = parseInt(directPrice[1].replace(/,/g, ""), 10);
        }
      }
    }
  }

  // 7. Location (Area & City)
  let area: string | null = null;
  let city = "Dhaka";

  const commonAreas = [
    "Baridhara DOHS",
    "Gulshan-2",
    "Gulshan-1",
    "Bashundhara R/A",
    "গুলশান-২",
    "গুলশান-১",
    "বসুন্ধরা",
    "Gulshan",
    "গুলশান",
    "Banani",
    "বনানী",
    "Bashundhara",
    "Dhanmondi",
    "ধানমন্ডি",
    "Uttara",
    "উত্তরা",
    "Mirpur",
    "মিরপুর",
    "Mohakhali",
    "মহাখালী",
    "Baridhara",
    "বারিধারা",
    "Banasree",
    "বনশ্রী",
    "Niketan",
    "নিকেতন",
    "Lalmatia",
    "লালমাটিয়া",
    "Mohammadpur",
    "মোহাম্মদপুর",
    "Badda",
    "বাড্ডা",
    "Aftabnagar",
    "আফতাবনগর",
    "Khilkhet",
    "খিলক্ষেত",
    "Purbachal",
    "পূর্বাচল",
    "Chittagong",
    "চট্টগ্রাম",
    "Sylhet",
    "সিলেট",
    "Cox's Bazar",
    "কক্সবাজার",
  ];

  for (const a of commonAreas) {
    if (new RegExp(a, "i").test(text)) {
      // Map Bangla area name to standard name if needed
      const areaMap: Record<string, string> = {
        "গুলশান-২": "Gulshan-2",
        "গুলশান-১": "Gulshan-1",
        "গুলশান": "Gulshan",
        "বনানী": "Banani",
        "বসুন্ধরা": "Bashundhara R/A",
        "ধানমন্ডি": "Dhanmondi",
        "উত্তরা": "Uttara",
        "মিরপুর": "Mirpur",
        "মহাখালী": "Mohakhali",
        "বারিধারা": "Baridhara",
        "বনশ্রী": "Banasree",
        "নিকেতন": "Niketan",
        "লালমাটিয়া": "Lalmatia",
        "মোহাম্মদপুর": "Mohammadpur",
        "বাড্ডা": "Badda",
        "আফতাবনগর": "Aftabnagar",
        "খিলক্ষেত": "Khilkhet",
        "পূর্বাচল": "Purbachal",
        "চট্টগ্রাম": "Chittagong",
        "সিলেট": "Sylhet",
        "কক্সবাজার": "Cox's Bazar",
      };
      area = areaMap[a] || a;
      break;
    }
  }

  // 8. Amenities
  const amenities: string[] = [];
  if (/লিফট|lift|elevator/i.test(text)) amenities.push("High-Speed Passenger Lift");
  if (/জেনারেটর|generator|backup/i.test(text)) amenities.push("Full Generator Backup (100%)");
  if (/সিকিউরিটি|security|cctv|সিসিটিভি|গার্ড/i.test(text)) amenities.push("24/7 Security & CCTV Surveillance");
  if (/পার্কিং|parking|গ্যারেজ/i.test(text)) amenities.push("Covered Car Parking");
  if (/গ্যাস|gas|titas/i.test(text)) amenities.push("Titas Gas Connection / Central LPG");
  if (/সুইমিং\s*পুল|swimming\s*pool/i.test(text)) amenities.push("Swimming Pool");
  if (/জিম|gym/i.test(text)) amenities.push("Fitness Center / Gymnasium");
  if (/ইন্টারকম|intercom/i.test(text)) amenities.push("Intercom & Video Door Phone");
  if (/গার্ডেন|garden|বাগান/i.test(text)) amenities.push("Rooftop Garden & Community Hall");

  // 9. Phone & WhatsApp
  let phone: string | null = null;
  const phoneMatch = text.match(/(?:\+?88)?01[3-9]\d{8}/);
  if (phoneMatch) phone = phoneMatch[0];

  // 10. Title
  const titleParts = [];
  if (bedrooms) titleParts.push(`${bedrooms} BHK`);
  titleParts.push(
    propertyType === "APARTMENT"
      ? "Apartment"
      : propertyType === "VILLA"
      ? "Luxury Villa"
      : propertyType === "PENTHOUSE"
      ? "Penthouse"
      : propertyType === "COMMERCIAL"
      ? "Commercial Space"
      : propertyType === "LAND"
      ? "Land / Plot"
      : "Property"
  );
  if (listingType === "RENT") titleParts.push("for Rent");
  else titleParts.push("for Sale");
  if (area) titleParts.push(`in ${area}`);
  if (propertySize) titleParts.push(`(${propertySize} sqft)`);

  const title = titleParts.join(" ");

  return {
    title,
    description: rawText,
    listingType,
    propertyType,
    price,
    currency: "BDT",
    priceNegotiable,
    pricePeriod,
    location: {
      address: area ? `${area}, Dhaka` : null,
      area: area || null,
      city,
      state: "Dhaka Division",
      country: "Bangladesh",
    },
    specifications: {
      bedrooms: bedrooms || (propertyType === "LAND" ? 0 : 1),
      bathrooms: bathrooms || (propertyType === "LAND" ? 0 : 1),
      parkingSpaces: amenities.includes("Covered Car Parking") ? 1 : 0,
      propertySize: propertySize || (propertyType === "LAND" ? 2160 : 1200),
      propertySizeUnit: "sqft",
      furnishedStatus: /ফার্নিশড|furnished/i.test(text) ? "SEMI_FURNISHED" : "UNFURNISHED",
    },
    amenities,
    features: [],
    contactInfo: {
      phone,
      whatsapp: phone,
    },
  };
}

