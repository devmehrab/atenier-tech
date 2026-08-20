import mongoose, { Schema, Document, Model } from "mongoose";
import {
  ListingType,
  PropertyType,
  PropertyStatus,
  FurnishedStatus,
  ICloudinaryImage,
  IPropertyLocation,
  IPropertySpecifications,
  IPropertyContactInfo,
} from "@/lib/types";

export interface IPropertyDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  assignedAgent?: mongoose.Types.ObjectId | null;
  title: string;
  slug: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  priceNegotiable: boolean;
  pricePeriod?: "MONTHLY" | "YEARLY";
  location: IPropertyLocation;
  specifications: IPropertySpecifications;
  amenities: string[];
  features: string[];
  images: ICloudinaryImage[];
  featuredImage?: string;
  contactInfo?: IPropertyContactInfo;
  viewsCount?: number;
  isFeatured?: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryImageSchema = new Schema(
  {
    publicId: { type: String, required: true },
    secureUrl: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    isFeatured: { type: Boolean, default: false },
    caption: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const PropertySchema = new Schema<IPropertyDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedAgent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Property slug is required"],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
      trim: true,
    },
    listingType: {
      type: String,
      enum: ["SALE", "RENT", "LEASE"],
      required: true,
      index: true,
    },
    propertyType: {
      type: String,
      enum: [
        "APARTMENT",
        "HOUSE",
        "VILLA",
        "COMMERCIAL",
        "LAND",
        "OFFICE",
        "PENTHOUSE",
        "TOWNHOUSE",
      ],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "UNPUBLISHED", "SOLD", "RENTED"],
      default: "DRAFT",
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
      index: true,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    priceNegotiable: {
      type: Boolean,
      default: false,
    },
    pricePeriod: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      required: false,
    },
    location: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true, index: true },
      area: { type: String, required: true, trim: true, index: true },
      state: { type: String, trim: true },
      country: { type: String, default: "US", trim: true },
      zipCode: { type: String, trim: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    specifications: {
      bedrooms: { type: Number, required: true, min: 0, default: 1 },
      bathrooms: { type: Number, required: true, min: 0, default: 1 },
      parkingSpaces: { type: Number, default: 0 },
      propertySize: { type: Number, required: true, min: 0 },
      propertySizeUnit: { type: String, enum: ["sqft", "sqm"], default: "sqft" },
      landSize: { type: Number },
      landSizeUnit: { type: String, enum: ["sqft", "sqm", "katha", "acre"] },
      floorNumber: { type: Number },
      totalFloors: { type: Number },
      yearBuilt: { type: Number },
      furnishedStatus: {
        type: String,
        enum: ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"],
        default: "UNFURNISHED",
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    images: {
      type: [CloudinaryImageSchema],
      default: [],
    },
    featuredImage: {
      type: String,
      default: "",
    },
    contactInfo: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      whatsapp: { type: String, trim: true },
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        ret._id = ret._id?.toString();
        if (ret.organizationId) ret.organizationId = ret.organizationId.toString();
        if (ret.createdBy) ret.createdBy = ret.createdBy.toString();
        if (ret.assignedAgent) ret.assignedAgent = ret.assignedAgent.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

PropertySchema.index({ organizationId: 1, slug: 1 }, { unique: true });
PropertySchema.index({ organizationId: 1, status: 1, createdAt: -1 });
PropertySchema.index({ organizationId: 1, isFeatured: 1, status: 1 });
PropertySchema.index({ organizationId: 1, propertyType: 1, listingType: 1, price: 1 });

export const Property: Model<IPropertyDocument> =
  mongoose.models.Property || mongoose.model<IPropertyDocument>("Property", PropertySchema);
