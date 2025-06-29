// fetch all the users from the database
import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db/user";
import { User } from "@/lib/auth/types";

export async function GET() {
  try {
    const users = await getAllUsers();
    // Convert the Prisma result to User type
    const sanitizedUsers: User[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}
