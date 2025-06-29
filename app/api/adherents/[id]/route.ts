import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET endpoint to retrieve adherent by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Adherent ID is required" },
        { status: 400 }
      );
    }

    const adherent = await prisma.adherent.findUnique({
      where: {
        id: id,
      },
      include: {
        subscription: true,
      },
    });

    if (!adherent) {
      return NextResponse.json(
        { success: false, error: "Adherent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, adherent });
  } catch (error) {
    console.error("Error fetching adherent by ID:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch adherent: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update an adherent
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    // Separate adherent data from subscription data
    const {
      subscriptionPlan,
      subscriptionPrice,
      subscriptionStatus,
      subscriptionStartDate,
      subscriptionEndDate,
      hasCardioMusculation,
      hasCours,
      ...adherentData
    } = data;

    // Convert birthDate string to Date object if provided
    if (adherentData.birthDate) {
      adherentData.birthDate = new Date(adherentData.birthDate);
    }

    // Handle subscription update if subscription data is provided
    if (
      subscriptionPlan ||
      subscriptionPrice ||
      subscriptionStatus ||
      subscriptionStartDate ||
      subscriptionEndDate ||
      hasCardioMusculation !== undefined ||
      hasCours !== undefined
    ) {
      const subscriptionData: any = {};

      if (subscriptionPlan) subscriptionData.plan = subscriptionPlan;
      if (subscriptionPrice)
        subscriptionData.price = parseFloat(subscriptionPrice);
      if (subscriptionStatus) subscriptionData.status = subscriptionStatus;
      if (subscriptionStartDate)
        subscriptionData.startDate = new Date(subscriptionStartDate);
      if (subscriptionEndDate)
        subscriptionData.endDate = new Date(subscriptionEndDate);
      if (hasCardioMusculation !== undefined)
        subscriptionData.hasCardioMusculation = hasCardioMusculation;
      if (hasCours !== undefined) subscriptionData.hasCours = hasCours;

      // Upsert subscription (update if exists, create if doesn't exist)
      await prisma.subscription.upsert({
        where: {
          adherentId: id,
        },
        update: subscriptionData,
        create: {
          ...subscriptionData,
          adherentId: id,
        },
      });
    }

    // Fetch the updated adherent with subscription
    const finalAdherent = await prisma.adherent.findUnique({
      where: { id: id },
      include: { subscription: true },
    });

    return NextResponse.json({ success: true, adherent: finalAdherent });
  } catch (error) {
    console.error("Error updating adherent:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update adherent: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove an adherent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // First delete the subscription to avoid foreign key constraint issues
    await prisma.subscription.deleteMany({
      where: {
        adherentId: id,
      },
    });

    // Then delete the adherent
    const deletedAdherent = await prisma.adherent.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Adherent successfully deleted",
      adherent: deletedAdherent,
    });
  } catch (error) {
    console.error("Error deleting adherent:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete adherent: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
