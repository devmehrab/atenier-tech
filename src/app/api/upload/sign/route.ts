import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await requireAuth(false);
    const body = await req.json().catch(() => ({}));
    const folder = body.folder || `real-estate-saas/${session.organizationId || "global"}/properties`;

    const signData = generateUploadSignature(folder);
    return NextResponse.json(signData);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate upload signature" },
      { status: error.statusCode || 500 }
    );
  }
}
