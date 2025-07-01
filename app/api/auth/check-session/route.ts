// app/api/auth/check-session/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/service";

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
  
  return NextResponse.json({ valid: true });
}