import { NextResponse } from "next/server";
import { logoutAction } from "@/lib/actions/auth.actions";

export async function POST() {
  const result = await logoutAction();
  return NextResponse.json(result);
}
