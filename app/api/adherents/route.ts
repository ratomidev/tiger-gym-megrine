import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AdherentFormValues } from "@/types/adherent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received adherent data:", body);

    // Process adherent data
    const adherentData: AdherentFormValues = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      birthDate: new Date(body.birthDate),
      Address: body.Address,
      sexe: body.sexe,
      photoUrl: body.photoUrl || null,
    };

    // Check if subscription data is provided
    const hasSubscription = body.hasSubscription === true;

    // Create adherent with or without subscription
    if (hasSubscription) {
      const subscriptionData = {
        plan: body.plan,
        price: parseFloat(body.price),
        remaining: body.remaining !== undefined ? parseFloat(body.remaining) : 0, // Handle the new field
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: body.status || "actif",
        hasCardioMusculation: body.hasCardioMusculation === true,
        hasCours: body.hasCours === true,
      };

      // Create adherent with subscription
      const adherent = await prisma.adherent.create({
        data: {
          ...adherentData,
          isValidated: true,
          subscription: {
            create: subscriptionData,
          },
        },
        include: {
          subscription: true,
        },
      });

      return NextResponse.json({ success: true, adherent });
    } else {
      // Create adherent without subscription
      const adherent = await prisma.adherent.create({
        data: {
          ...adherentData,
          isValidated: false,
        },
      });

      return NextResponse.json({ success: true, adherent });
    }
  } catch (error) {
    console.error("Error creating adherent:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create adherent: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all adherents
export async function GET() {
  try {
    const adherents = await prisma.adherent.findMany({
      include: {
        subscription: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, adherents });
  } catch (error) {
    console.error("Error fetching adherents:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch adherents: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
