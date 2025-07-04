import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

// GET endpoint to retrieve adherent by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const adherent = await prisma.adherent.findUnique({
      where: { id },
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
    console.error("Error fetching adherent:", error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Separate adherent data from subscription data - ADD subscriptionRemaining to this list
    const {
      subscriptionPlan,
      subscriptionPrice,
      subscriptionRemaining, // Add this field to be destructured
      subscriptionStatus,
      subscriptionStartDate,
      subscriptionEndDate,
      hasCardioMusculation,
      hasCours,
      ...adherentData
    } = data;

    // If photoUrl is being updated, delete the old photo
    if (adherentData.photoUrl !== undefined) {
      const existingAdherent = await prisma.adherent.findUnique({
        where: { id },
        select: { photoUrl: true },
      });

      if (
        existingAdherent?.photoUrl &&
        existingAdherent.photoUrl !== adherentData.photoUrl
      ) {
        try {
          await del(existingAdherent.photoUrl);
          console.log(`Old photo deleted: ${existingAdherent.photoUrl}`);
        } catch (photoError) {
          console.error(
            "Error deleting old photo from blob storage:",
            photoError
          );
          // Continue with update even if photo deletion fails
        }
      }
    }

    // Convert birthDate string to Date object if provided
    if (adherentData.birthDate) {
      adherentData.birthDate = new Date(adherentData.birthDate);
    }

    // First, update the adherent's personal information
    await prisma.adherent.update({
      where: { id },
      data: adherentData,
    });

    // Handle subscription update if subscription data is provided
    if (
      subscriptionPlan ||
      subscriptionPrice ||
      subscriptionRemaining !== undefined || // Add this condition
      subscriptionStatus ||
      subscriptionStartDate ||
      subscriptionEndDate ||
      hasCardioMusculation !== undefined ||
      hasCours !== undefined
    ) {
      const subscriptionUpdateData: {
        plan?: string;
        price?: number;
        remaining?: number; // Add this field
        status?: string;
        startDate?: Date;
        endDate?: Date;
        hasCardioMusculation?: boolean;
        hasCours?: boolean;
      } = {};

      const subscriptionCreateData: {
        adherentId: string;
        plan: string;
        price: number;
        remaining: number; // Add this field
        status: string;
        startDate: Date;
        endDate: Date;
        hasCardioMusculation: boolean;
        hasCours: boolean;
      } = {
        adherentId: id,
        plan: subscriptionPlan || "1 mois",
        price: subscriptionPrice ? parseFloat(subscriptionPrice) : 0,
        remaining: subscriptionRemaining ? parseFloat(subscriptionRemaining) : 0, // Add this line
        status: subscriptionStatus || "actif",
        startDate: subscriptionStartDate
          ? new Date(subscriptionStartDate)
          : new Date(),
        endDate: subscriptionEndDate
          ? new Date(subscriptionEndDate)
          : new Date(),
        hasCardioMusculation: hasCardioMusculation || false,
        hasCours: hasCours || false,
      };

      if (subscriptionPlan) subscriptionUpdateData.plan = subscriptionPlan;
      if (subscriptionPrice)
        subscriptionUpdateData.price = parseFloat(subscriptionPrice);
      if (subscriptionRemaining !== undefined) // Add this condition
        subscriptionUpdateData.remaining = parseFloat(subscriptionRemaining);
      if (subscriptionStatus)
        subscriptionUpdateData.status = subscriptionStatus;
      if (subscriptionStartDate)
        subscriptionUpdateData.startDate = new Date(subscriptionStartDate);
      if (subscriptionEndDate)
        subscriptionUpdateData.endDate = new Date(subscriptionEndDate);
      if (hasCardioMusculation !== undefined)
        subscriptionUpdateData.hasCardioMusculation = hasCardioMusculation;
      if (hasCours !== undefined) subscriptionUpdateData.hasCours = hasCours;

      // Upsert subscription (update if exists, create if doesn't exist)
      await prisma.subscription.upsert({
        where: {
          adherentId: id,
        },
        update: subscriptionUpdateData,
        create: subscriptionCreateData,
      });
    }

    // Fetch the final updated adherent with subscription
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, get the adherent to check if they have a photo
    const adherent = await prisma.adherent.findUnique({
      where: { id },
      select: { photoUrl: true },
    });

    if (!adherent) {
      return NextResponse.json(
        { success: false, error: "Adherent not found" },
        { status: 404 }
      );
    }

    // Delete photo from Vercel Blob if it exists
    if (adherent.photoUrl) {
      try {
        await del(adherent.photoUrl);
        console.log(`✅ Photo deleted from blob storage: ${adherent.photoUrl}`);
      } catch (photoError) {
        console.error("❌ Error deleting photo from blob storage:", photoError);
        // Continue with adherent deletion even if photo deletion fails
      }
    } else {
      console.log("ℹ️ No photo to delete for this adherent");
    }

    // Delete the subscription if it exists
    await prisma.subscription.deleteMany({
      where: { adherentId: id },
    });

    // Then delete the adherent
    const deletedAdherent = await prisma.adherent.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Adherent and associated photo deleted successfully",
      deletedAdherent,
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
