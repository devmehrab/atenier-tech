import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { ICloudinaryImage } from "@/lib/types";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Generates a signed upload signature for direct browser-to-Cloudinary uploads
 */
export function generateUploadSignature(
  folder: string = "real-estate-saas/properties",
  tags: string[] = ["real-estate"]
) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
    // Return mock signature if not configured yet for local DX
    return {
      timestamp,
      signature: "mock_signature_for_local_dev",
      apiKey: "mock_api_key",
      cloudName: "demo_cloud",
      folder,
    };
  }

  const paramsToSign = {
    folder,
    tags: tags.join(","),
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    apiSecret
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
  };
}

/**
 * Uploads a base64 or buffer file to Cloudinary from the server
 */
export async function uploadImageServer(
  fileBase64OrUrl: string,
  folder: string = "real-estate-saas/properties"
): Promise<ICloudinaryImage> {
  const isConfigured =
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY !== "123456789012345";

  if (!isConfigured) {
    // Return structured placeholder if Cloudinary keys are not provided
    const id = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      publicId: id,
      secureUrl: fileBase64OrUrl.startsWith("http")
        ? fileBase64OrUrl
        : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      width: 1200,
      height: 800,
      format: "jpg",
    };
  }

  const result: UploadApiResponse = await cloudinary.uploader.upload(
    fileBase64OrUrl,
    {
      folder,
      resource_type: "image",
      transformation: [{ quality: "auto:good", fetch_format: "auto" }],
    }
  );

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Deletes an image from Cloudinary by public ID
 */
export async function deleteImageServer(publicId: string): Promise<boolean> {
  if (publicId.startsWith("mock_") || !process.env.CLOUDINARY_API_KEY) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Failed to delete Cloudinary image:", error);
    return false;
  }
}

/**
 * Formats a Cloudinary URL with responsive transformations
 */
export function getOptimizedImageUrl(
  urlOrPublicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "limit" | "thumb";
    quality?: "auto" | number;
  } = {}
): string {
  if (!urlOrPublicId) return "/placeholder-property.jpg";

  if (urlOrPublicId.startsWith("http")) {
    // If it's already a full URL (Cloudinary or Unsplash)
    return urlOrPublicId;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "demo";
  const { width = 800, height = 600, crop = "fill", quality = "auto" } = options;

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},w_${width},h_${height},q_${quality},f_auto/${urlOrPublicId}`;
}
