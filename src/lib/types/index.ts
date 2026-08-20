export type UserRole = "SYSTEM_ADMIN" | "OWNER" | "AGENT";
export type UserStatus = "ACTIVE" | "DISABLED";

export type OrganizationStatus = "ACTIVE" | "SUSPENDED";

export type PropertyType =
  | "APARTMENT"
  | "HOUSE"
  | "VILLA"
  | "COMMERCIAL"
  | "LAND"
  | "OFFICE"
  | "PENTHOUSE"
  | "TOWNHOUSE";

export type ListingType = "SALE" | "RENT" | "LEASE";

export type PropertyStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "UNPUBLISHED"
  | "SOLD"
  | "RENTED";

export type FurnishedStatus =
  | "UNFURNISHED"
  | "SEMI_FURNISHED"
  | "FULLY_FURNISHED";

export interface ICloudinaryImage {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  isFeatured?: boolean;
  caption?: string;
  order?: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  organizationId?: string | null;
  organizationName?: string | null;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationBranding {
  primaryColor?: string;
  accentColor?: string;
  tagline?: string;
}

export interface IOrganizationSocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface IOrganizationSettings {
  defaultCurrency: string;
  unitSystem: "SQFT" | "SQM";
  allowAgentListings: boolean;
}

export interface IOrganization {
  _id: string;
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
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyLocation {
  address: string;
  city: string;
  area: string;
  state?: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface IPropertySpecifications {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
  propertySize: number;
  propertySizeUnit: "sqft" | "sqm";
  landSize?: number;
  landSizeUnit?: "sqft" | "sqm" | "katha" | "acre";
  floorNumber?: number;
  totalFloors?: number;
  yearBuilt?: number;
  furnishedStatus: FurnishedStatus;
}

export interface IPropertyContactInfo {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

export interface IProperty {
  _id: string;
  organizationId: string;
  organizationName?: string;
  organizationSlug?: string;
  createdBy: string;
  assignedAgent?: string | null;
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

export interface ILead {
  _id: string;
  organizationId: string;
  propertyId?: string | null;
  propertyTitle?: string;
  propertySlug?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionUser {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string | null;
  organizationSlug?: string | null;
  organizationName?: string | null;
}

export interface IPropertyFilterParams {
  organizationId?: string;
  propertyType?: PropertyType;
  listingType?: ListingType;
  status?: PropertyStatus;
  city?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
}
