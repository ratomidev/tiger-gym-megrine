import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Récupérer un membre par son ID avec toutes ses relations
    const member = await prisma.member.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        services: true,
        medicalRecord: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Membre non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Erreur lors de la récupération du membre:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Erreur lors de la récupération des détails du membre: " +
          (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    // Mise à jour du membre
    const updatedMember = await prisma.member.update({
      where: {
        id,
      },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        tel: data.tel,
        sexe: data.sexe,
        birthdate: data.birthdate ? new Date(data.birthdate) : null,
        subscriptionType: data.subscriptionType,
        subscriptionStartDate: new Date(data.subscriptionStartDate),
        subscriptionEndDate: new Date(data.subscriptionEndDate),
        subscriptionStatus: data.subscriptionStatus,
        notes: data.notes,

        // Mise à jour de l'adresse si fournie
        ...(data.address && {
          address: {
            update: {
              street: data.address.street,
              city: data.address.city,
              postalCode: data.address.postalCode,
              country: data.address.country,
            },
          },
        }),

        // Mise à jour des services si fournis
        ...(data.services && {
          services: {
            update: {
              musculation: data.services.musculation,
              cardio: data.services.cardio,
              fitness: data.services.fitness,
              boxing: data.services.boxing,
              yoga: data.services.yoga,
            },
          },
        }),

        // Mise à jour du dossier médical si fourni
        ...(data.medicalRecord && {
          medicalRecord: {
            update: {
              medicalCertificateDate: data.medicalRecord.medicalCertificateDate
                ? new Date(data.medicalRecord.medicalCertificateDate)
                : null,
              hasMedicalCertificate: data.medicalRecord.hasMedicalCertificate,
              allergies: data.medicalRecord.allergies || "",
              healthIssues: data.medicalRecord.healthIssues || "",
              specialPermissions: data.medicalRecord.specialPermissions || "",
              contraindications: data.medicalRecord.contraindications || "",
            },
          },
        }),
      },
      include: {
        address: true,
        services: true,
        medicalRecord: true,
      },
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du membre:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Erreur lors de la mise à jour du membre: " +
          (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Supprimer le membre et toutes ses relations (cascade delete devrait être configuré dans le schema prisma)
    await prisma.member.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Membre supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du membre:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Erreur lors de la suppression du membre: " +
          (error as Error).message,
      },
      { status: 500 }
    );
  }
}
