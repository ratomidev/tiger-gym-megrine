import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { AdherentFormValues } from "@/types/adherent";

// Ensure uploads directory exists
async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error("Error creating directory:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Process basic adherent data
    const adherentData: AdherentFormValues = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      birthDate: new Date(formData.get("birthDate") as string),
      Address: formData.get("Address") as string, 
      sexe: formData.get("sexe") as 'M' | 'F',
    };

    // Process photo file if provided
    let photoUrl = null;
    const photo = formData.get("photo") as File;
    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Ensure directory exists
      const uploadDir = join(process.cwd(), "public", "uploads", "photos");
      await ensureDirectoryExists(uploadDir);
      
      // Generate a unique filename
      const fileName = `${Date.now()}-${photo.name.replace(/\s+/g, '-')}`;
      const photoPath = join(uploadDir, fileName);
      
      // Write the file
      await writeFile(photoPath, buffer);
      
      // Set the URL (relative to public)
      photoUrl = `/uploads/photos/${fileName}`;
    }

    // Check if subscription data is provided
    const hasSubscription = formData.get("hasSubscription") === "true";
    
    // Create adherent with or without subscription
    if (hasSubscription) {
      const subscriptionData = {
        plan: formData.get("plan") as string,
        price: parseFloat(formData.get("price") as string),
        startDate: new Date(formData.get("startDate") as string),
        endDate: new Date(formData.get("endDate") as string),
        status: formData.get("status") as string || "actif",
        hasCardioMusculation: formData.get("hasCardioMusculation") === "true",
        hasCours: formData.get("hasCours") === "true",
      };

      // Create adherent with subscription
      const adherent = await prisma.adherent.create({
        data: {
          ...adherentData,
          photoUrl,
          isValidated: true,
          subscription: {
            create: subscriptionData
          }
        },
        include: {
          subscription: true
        }
      });

      return NextResponse.json({ success: true, adherent });
    } else {
      // Create adherent without subscription
      const adherent = await prisma.adherent.create({
        data: {
          ...adherentData,
          photoUrl,
          isValidated: false,
        }
      });

      return NextResponse.json({ success: true, adherent });
    }
  } catch (error) {
    console.error("Error creating adherent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create adherent: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all adherents
export async function GET(request: NextRequest) {
  try {
    const adherents = await prisma.adherent.findMany({
      include: {
        subscription: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, adherents });
  } catch (error) {
    console.error("Error fetching adherents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch adherents: " + (error as Error).message },
      { status: 500 }
    );
  }
}