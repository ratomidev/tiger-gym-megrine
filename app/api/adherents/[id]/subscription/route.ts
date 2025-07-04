import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      plan,
      price,
      remaining = 0,
      startDate,
      endDate,
      status,
      hasCardioMusculation,
      hasCours,
    } = body;

    // Validate required fields
    if (!plan || !price || !startDate || !endDate || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if adherent exists
    const adherent = await prisma.adherent.findUnique({
      where: { id },
      include: { subscription: true },
    });

    if (!adherent) {
      return NextResponse.json(
        { success: false, error: "Adherent not found" },
        { status: 404 }
      );
    }

    // Check if adherent already has an active subscription
    if (adherent.subscription) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Adherent already has a subscription. Please update the existing one.",
        },
        { status: 400 }
      );
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        plan,
        price: parseFloat(price),
        remaining: parseFloat(remaining),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        hasCardioMusculation: Boolean(hasCardioMusculation),
        hasCours: Boolean(hasCours),
        adherentId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription added successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error adding subscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
