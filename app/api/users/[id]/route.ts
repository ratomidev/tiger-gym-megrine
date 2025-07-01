import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, role } = body;

    // Validate phone number if provided
    if (phone && !/^\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone number should be 8 digits (e.g., 54806948)" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !['OWNER', 'STAFF'].includes(role)) {
      return NextResponse.json(
        { error: "Role must be either OWNER or STAFF" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name || null,
        phone: phone || null,
        role: role || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the user" },
      { status: 500 }
    );
  }
}