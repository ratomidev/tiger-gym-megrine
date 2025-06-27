import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define params type as a Promise
type UserParamsType = Promise<{ userId: string }>;

// DELETE endpoint to remove a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: UserParamsType }
) {
  try {
    // Await the params promise to get the actual value
    const { userId } = await params;

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "User successfully deleted",
      user: {
        id: deletedUser.id,
        email: deletedUser.email,
        name: deletedUser.name,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete user: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}