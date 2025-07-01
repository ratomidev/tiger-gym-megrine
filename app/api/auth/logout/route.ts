// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/service";

export async function POST() {
  // Fix: Await the clearSessionCookie function
  await clearSessionCookie();
  
  return NextResponse.json({ 
    message: "Logged out successfully" 
  });
}