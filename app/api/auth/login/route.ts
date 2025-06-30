import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { createSessionToken, setSessionCookie } from "@/lib/auth/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" }, 
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 }
      );
    }
    
    // Create session token
    const token = await createSessionToken(user);
    
    // Set session cookie
    setSessionCookie(token);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      user: userWithoutPassword,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
}