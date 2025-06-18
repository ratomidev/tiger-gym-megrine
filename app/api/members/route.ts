import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

// Ensure uploads directory exists
async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory already exists or can't be created
    console.error("Error creating directory:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Process basic member data
    const memberData = {
      membershipNumber: formData.get("membershipNumber") as string,
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      tel: formData.get("tel") as string,
      sexe: formData.get("sexe") as string,
      birthdate: formData.get("birthdate")
        ? new Date(formData.get("birthdate") as string)
        : null,

      // Subscription data
      inscriptionDate: new Date(formData.get("inscriptionDate") as string),
      subscriptionType: formData.get("subscriptionType") as string,
      subscriptionStartDate: new Date(
        formData.get("subscriptionStartDate") as string
      ),
      subscriptionEndDate: new Date(
        formData.get("subscriptionEndDate") as string
      ),
      subscriptionStatus: formData.get("subscriptionStatus") as string,

      notes: formData.get("notes") as string,
    };    // Process photo file if provided
    let photoUrl = null;
    const photo = formData.get("photo") as File;
    if (photo) {
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
    
    // Process medical certificate file if provided
    let medicalCertificateUrl = null;
    const medicalCertificateFile = formData.get("medicalCertificateFile") as File;
    if (medicalCertificateFile) {
      const bytes = await medicalCertificateFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Ensure directory exists
      const uploadDir = join(process.cwd(), "public", "uploads", "documents");
      await ensureDirectoryExists(uploadDir);
      
      // Generate a unique filename
      const fileName = `${Date.now()}-${medicalCertificateFile.name.replace(/\s+/g, '-')}`;
      const filePath = join(uploadDir, fileName);
      
      // Write the file
      await writeFile(filePath, buffer);
      
      // Set the URL (relative to public)
      medicalCertificateUrl = `/uploads/documents/${fileName}`;
    }

    // Create the member with all related data
    const member = await prisma.member.create({
      data: {
        ...memberData,
        photoUrl,
        address: {
          create: {
            street: formData.get("address.street") as string,
            city: formData.get("address.city") as string,
            postalCode: formData.get("address.postalCode") as string,
            country: (formData.get("address.country") as string) || "Tunisie",
          },
        },
        services: {
          create: {
            musculation: formData.get("services.musculation") === "true",
            cardio: formData.get("services.cardio") === "true",
            fitness: formData.get("services.fitness") === "true",
            boxing: formData.get("services.boxing") === "true",
            yoga: formData.get("services.yoga") === "true",
          },
        },        medicalRecord: {
          create: {
            medicalCertificateDate: formData.get("medicalCertificateDate")
              ? new Date(formData.get("medicalCertificateDate") as string)
              : null,
            hasMedicalCertificate:
              formData.get("hasMedicalCertificate") === "true",
            medicalCertificateUrl,
            allergies: formData.get("allergies") as string || "",
            healthIssues: formData.get("healthIssues") as string || "",
            specialPermissions: formData.get("specialPermissions") as string || "",
            contraindications: formData.get("contraindications") as string || "",
          },
        },
      },
    });

    return NextResponse.json({ success: true, member });  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create member: " + (error as Error).message },
      { status: 500 }
    );
  }
}
