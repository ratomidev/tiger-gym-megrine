// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/service";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ user: null });
  }
  
  return NextResponse.json({ user });
}