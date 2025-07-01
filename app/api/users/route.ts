import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

/**
 * Get all users from the database with sensitive fields excluded
 * Returns users with all necessary fields for the UsersList component
 */
async function getAllUsers() {
  // Direct database query using Prisma
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true, // Added phone field
      role: true,  // Added role field
      createdAt: true,
      updatedAt: true,
      // Explicitly exclude password
      password: false,
    },
    orderBy: {
      createdAt: 'desc' // Most recent users first
    }
  });

  return users;
}

/**
 * Exclude password from a user object for safe return
 */
function excludePassword(user: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

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
    const { email, password, name, phone, role } = body;

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

    // Hash password using service
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        phone: phone || null,
        role: role || 'STAFF', // Default to STAFF if not provided
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
