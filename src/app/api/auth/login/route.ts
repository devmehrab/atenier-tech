import { NextRequest, NextResponse } from "next/server";
import { loginAction, registerOrgAction, logoutAction } from "@/lib/actions/auth.actions";
import { getSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await loginAction(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
