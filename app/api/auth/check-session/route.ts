// app/api/auth/check-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/service";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
  
  return NextResponse.json({ valid: true });
}