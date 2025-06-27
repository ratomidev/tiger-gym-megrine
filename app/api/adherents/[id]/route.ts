import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define params type as a Promise
type ParamsType = Promise<{ id: string }>;

// GET a single adherent by ID
export async function GET(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    // Await the params promise to get the actual value
    const { id } = await params;

    const adherent = await prisma.adherent.findUnique({
      where: { id },
      include: { subscription: true },
    });

    if (!adherent) {
      return NextResponse.json({ error: "Adherent not found" }, { status: 404 });
    }

    return NextResponse.json({ adherent });
  } catch (error) {
    console.error("Error fetching adherent:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// PUT endpoint to update an adherent
export async function PUT(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    // Await the params promise
    const { id } = await params;
    const data = await request.json();

    const updatedAdherent = await prisma.adherent.update({
      where: { id },
      data: {
        ...data,
        subscription: data.subscription
          ? {
              update: {
                where: { adherentId: id },
                data: data.subscription,
              },
            }
          : undefined,
      },
      include: { subscription: true },
    });

    return NextResponse.json({ success: true, adherent: updatedAdherent });
  } catch (error) {
    console.error("Error updating adherent:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update adherent: " + (error as Error).message,
    }, { status: 500 });
  }
}

// DELETE endpoint to remove an adherent
export async function DELETE(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    // Await the params promise
    const { id } = await params;

    await prisma.subscription.deleteMany({
      where: { adherentId: id },
    });

    const deletedAdherent = await prisma.adherent.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Adherent successfully deleted",
      adherent: deletedAdherent,
    });
  } catch (error) {
    console.error("Error deleting adherent:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to delete adherent: " + (error as Error).message,
    }, { status: 500 });
  }
}
