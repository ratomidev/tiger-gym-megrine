import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, excludePassword } from "@/lib/db/user";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Validate phone number format (Tunisian format - 8 digits)
    if (phone && !/^\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone number should be 8 digits (e.g., 54806948)" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        // phone: phone || null,
      },
    });

    // Return user without password
    const userWithoutPassword = excludePassword(user);

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the user" },
      { status: 500 }
    );
  }
}
