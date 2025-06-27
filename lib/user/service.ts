// fetch all the users from the database
import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db/user";
import { excludePassword } from "@/lib/db/user";
import { User } from "@/lib/auth/types";

export async function GET() {
  try {
    const users = await getAllUsers();
    const sanitizedUsers: User[] = users.map(excludePassword);
    
    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}