import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { uploadImageServer } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(false);
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, and AVIF are allowed." },
        { status: 400 }
      );
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const folder = `real-estate-saas/${session.organizationId || "global"}/properties`;
    const imageResult = await uploadImageServer(base64, folder);

    return NextResponse.json({ success: true, image: imageResult });
  } catch (error: any) {
    console.error("Direct upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: error.statusCode || 500 }
    );
  }
}
