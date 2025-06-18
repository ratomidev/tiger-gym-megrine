import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db/user";

export async function GET(request: NextRequest) {
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