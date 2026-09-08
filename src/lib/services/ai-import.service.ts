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
        "Total numeric asking price or monthly rent normalized to integer digits (e.g. $1.85M = 1850000, 65k = 65000, $4,500 = 4500). Return null if not stated.",
    },
    currency: {
      type: "string",
      default: "USD",
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
            "Area or neighborhood (e.g., Midtown, Downtown, Beverly Hills, Brooklyn, West End)",
        },
        city: {
          type: ["string", "null"],
          description: "City or District (e.g. New York, Los Angeles, London, Miami)",
        },
        state: {
          type: ["string", "null"],
        },
        country: {
          type: "string",
          default: "United States",
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
        "List of amenities mentioned (e.g., 'Central Air Conditioning & Heating', 'High-Speed Passenger Elevator', '24/7 Security & CCTV Surveillance', 'Covered Garage & Parking', 'Swimming Pool', 'Fitness Center & Gymnasium', 'Private Balcony / Terrace', 'Rooftop Terrace & Lounge')",
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

const SYSTEM_PROMPT = `You are an expert AI parser specialized in international real estate listings and social media property posts.
Your task is to parse unstructured property post captions (in English or other languages) into structured property listing data adhering strictly to the provided JSON schema.

CRITICAL PARSING RULES:
1. NUMERICAL & PRICE CONVERSIONS:
   - Extract numeric asking price or monthly rent as integer digits.
   - "$1.85M" or "1.85 million" -> price: 1850000
   - "$650k" or "650 thousand" -> price: 650000
   - "$4,500/mo" -> price: 4500
   - If price is not mentioned, return price: null.
   - Default currency is "USD" unless another currency code/symbol is explicitly specified (e.g., EUR, GBP, CAD, AUD).

2. LISTING & PROPERTY TYPES:
   - ListingType:
     * Rent / For Rent / To-Let / Lease -> "RENT" (set pricePeriod to "MONTHLY")
     * Sale / For Sale / Buy -> "SALE" (pricePeriod: null)
     * Commercial Lease -> "LEASE"
   - PropertyType:
     * Apartment / Condo / Flat -> "APARTMENT"
     * House / Single Family / Building -> "HOUSE"
     * Villa / Mansion -> "VILLA"
     * Penthouse -> "PENTHOUSE"
     * Commercial / Retail / Shop -> "COMMERCIAL"
     * Office / Suite -> "OFFICE"
     * Land / Plot / Lot -> "LAND"
     * Townhouse / Rowhouse -> "TOWNHOUSE"

3. DIMENSIONS & ROOMS:
   - "1650 sqft" / "1650 sft" / "1,650 sq ft" -> specifications.propertySize: 1650, propertySizeUnit: "sqft"
   - "3 bed" / "3 bedroom" / "3 BHK" -> specifications.bedrooms: 3
   - "2.5 bath" / "2 bath" -> specifications.bathrooms: 2
   - "2 parking" / "2-car garage" -> specifications.parkingSpaces: 2
   - "6th floor" -> specifications.floorNumber: 6

4. AMENITIES IDENTIFICATION:
   - Air conditioning / AC / Central HVAC -> "Central Air Conditioning & Heating"
   - Elevator / Lift -> "High-Speed Passenger Elevator"
   - Security / 24/7 guard / CCTV -> "24/7 Security & CCTV Surveillance"
   - Parking / Garage -> "Covered Garage & Parking"
   - Pool / Swimming pool -> "Swimming Pool"
   - Gym / Fitness center -> "Fitness Center & Gymnasium"
   - Balcony / Terrace -> "Private Balcony / Terrace"
   - Rooftop -> "Rooftop Terrace & Lounge"
   - Washer / Dryer / Laundry -> "In-Unit Washer & Dryer"
   - Doorman / Concierge -> "Concierge & Front Desk Service"

5. STRICT ANTI-HALLUCINATION:
   - Extract ONLY information present or directly inferable from the caption.
   - If a field is not in the caption, set it to null. DO NOT invent fake prices, bedroom counts, or addresses.
   - Generate a clean, descriptive property title (e.g., "Modern 3-Bedroom Penthouse with Skyline Views in Midtown").`;

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
        content: `Parse the following real estate property post caption into the required structured JSON format:\n\n${caption}`,
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

  // 6. Price
  let price: number | null = null;
  let priceNegotiable = /negotiable|negotiation|আলোচনা\s*সাপেক্ষ|আলোচনাযোগ্য|নেগোসিয়েবল/i.test(text);

  // Millions match (e.g. $2.45M or 2.5 million)
  const millionMatch = text.match(/(?:\$|usd)?\s*(\d+(?:\.\d+)?)\s*(?:m\b|million)/i);
  if (millionMatch) {
    price = Math.round(parseFloat(millionMatch[1]) * 1000000);
  } else {
    // Thousand / K match (e.g. $650k or 650 thousand)
    const thousandMatch = text.match(/(?:\$|usd)?\s*(\d+(?:\.\d+)?)\s*(?:k\b|thousand)/i);
    if (thousandMatch) {
      price = Math.round(parseFloat(thousandMatch[1]) * 1000);
    } else {
      // Direct price match (e.g. $2,450,000 or Price: 2450000 or Rent: $4,500)
      const directPrice =
        text.match(/(?:price|rent|asking|মূল্য|ভাড়া)[:\s]*(?:\$|usd|৳)?\s*([\d,]+)/i) ||
        text.match(/\$\s*([\d,]{4,12})/);
      if (directPrice) {
        price = parseInt(directPrice[1].replace(/,/g, ""), 10);
      } else {
        // Compound crore / lakh fallback if present
        const compoundMatch = text.match(
          /(\d+(?:\.\d+)?)\s*(?:কোটি|crore|cr)(?:\s*(\d+(?:\.\d+)?)\s*(?:লাখ|লক্ষ|lakh|lac))?/i
        );
        if (compoundMatch) {
          const croreVal = parseFloat(compoundMatch[1]) * 10000000;
          const lakhVal = compoundMatch[2] ? parseFloat(compoundMatch[2]) * 100000 : 0;
          price = Math.round(croreVal + lakhVal);
        }
      }
    }
  }

  // 7. Location (Area & City)
  let area: string | null = null;
  let city = "New York";

  const commonAreas = [
    "Midtown",
    "Downtown",
    "Manhattan",
    "Brooklyn",
    "DUMBO",
    "Tribeca",
    "SoHo",
    "Greenwich Village",
    "Upper East Side",
    "Upper West Side",
    "Beverly Hills",
    "West Hollywood",
    "Santa Monica",
    "Miami Beach",
    "Brickell",
    "Coral Gables",
    "Mayfair",
    "Kensington",
    "Canary Wharf",
  ];

  for (const a of commonAreas) {
    if (new RegExp(a, "i").test(text)) {
      area = a;
      if (/Beverly Hills|West Hollywood|Santa Monica/i.test(a)) city = "Los Angeles";
      else if (/Miami Beach|Brickell|Coral Gables/i.test(a)) city = "Miami";
      else if (/Mayfair|Kensington|Canary Wharf/i.test(a)) city = "London";
      else city = "New York";
      break;
    }
  }

  // 8. Amenities
  const amenities: string[] = [];
  if (/ac\b|air\s*conditioning|hvac/i.test(text)) amenities.push("Central Air Conditioning & Heating");
  if (/elevator|lift/i.test(text)) amenities.push("High-Speed Passenger Elevator");
  if (/security|cctv|doorman|guard/i.test(text)) amenities.push("24/7 Security & CCTV Surveillance");
  if (/parking|garage/i.test(text)) amenities.push("Covered Garage & Parking");
  if (/pool|swimming/i.test(text)) amenities.push("Swimming Pool");
  if (/gym|fitness/i.test(text)) amenities.push("Fitness Center & Gymnasium");
  if (/balcony|terrace|patio/i.test(text)) amenities.push("Private Balcony / Terrace");
  if (/rooftop|roof\s*deck/i.test(text)) amenities.push("Rooftop Terrace & Lounge");
  if (/washer|dryer|laundry/i.test(text)) amenities.push("In-Unit Washer & Dryer");
  if (/generator|power\s*backup/i.test(text)) amenities.push("Full Generator Power Backup");
  if (/concierge/i.test(text)) amenities.push("Concierge & Front Desk Service");

  // 9. Phone & WhatsApp
  let phone: string | null = null;
  const phoneMatch =
    text.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/) ||
    text.match(/\+?\d{10,14}/);
  if (phoneMatch) phone = phoneMatch[0];

  // 10. Title
  const titleParts = [];
  if (bedrooms) titleParts.push(`${bedrooms} Bed`);
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
    currency: "USD",
    priceNegotiable,
    pricePeriod,
    location: {
      address: area ? `${area}, ${city}` : null,
      area: area || null,
      city,
      state: city === "Los Angeles" ? "CA" : city === "Miami" ? "FL" : city === "London" ? "Greater London" : "NY",
      country: city === "London" ? "United Kingdom" : "United States",
    },
    specifications: {
      bedrooms: bedrooms || (propertyType === "LAND" ? 0 : 1),
      bathrooms: bathrooms || (propertyType === "LAND" ? 0 : 1),
      parkingSpaces: amenities.includes("Covered Garage & Parking") ? 1 : 0,
      propertySize: propertySize || (propertyType === "LAND" ? 2500 : 1400),
      propertySizeUnit: "sqft",
      furnishedStatus: /furnished/i.test(text) ? "SEMI_FURNISHED" : "UNFURNISHED",
    },
    amenities,
    features: [],
    contactInfo: {
      phone,
      whatsapp: phone,
    },
  };
}

