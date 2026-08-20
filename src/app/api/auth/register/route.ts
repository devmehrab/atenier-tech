import { NextRequest, NextResponse } from "next/server";
import { registerOrgAction } from "@/lib/actions/auth.actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await registerOrgAction(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
