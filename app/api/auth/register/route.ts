import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth/service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" }, 
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" }, 
        { status: 409 }
      );
    }
    
    // Create new user with hashed password
    const user = await createUser(email, password, name);
    
    return NextResponse.json({ 
      user,
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
}