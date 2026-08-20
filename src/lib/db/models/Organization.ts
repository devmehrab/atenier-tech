import mongoose, { Schema, Document, Model } from "mongoose";
import {
  IOrganization,
  OrganizationStatus,
  ICloudinaryImage,
  IOrganizationBranding,
  IOrganizationSocialLinks,
  IOrganizationSettings,
} from "@/lib/types";

export interface IOrganizationDocument extends Document {
  name: string;
  slug: string;
  logo?: ICloudinaryImage | null;
  coverImage?: ICloudinaryImage | null;
  description?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  city: string;
  country: string;
  socialLinks?: IOrganizationSocialLinks;
  branding?: IOrganizationBranding;
  settings?: IOrganizationSettings;
  status: OrganizationStatus;
  ownerId: mongoose.Types.ObjectId;
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

const OrganizationSchema = new Schema<IOrganizationDocument>(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Organization slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logo: {
      type: CloudinaryImageSchema,
      default: null,
    },
    coverImage: {
      type: CloudinaryImageSchema,
      default: null,
    },
    description: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      trim: true,
      default: "US",
    },
    socialLinks: {
      website: { type: String, trim: true },
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },
    branding: {
      primaryColor: { type: String, default: "#15803d" },
      accentColor: { type: String, default: "#c5a059" },
      tagline: { type: String, trim: true },
    },
    settings: {
      defaultCurrency: { type: String, default: "USD" },
      unitSystem: { type: String, enum: ["SQFT", "SQM"], default: "SQFT" },
      allowAgentListings: { type: Boolean, default: true },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        ret._id = ret._id?.toString();
        if (ret.ownerId) {
          ret.ownerId = ret.ownerId.toString();
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Organization: Model<IOrganizationDocument> =
  mongoose.models.Organization ||
  mongoose.model<IOrganizationDocument>("Organization", OrganizationSchema);
