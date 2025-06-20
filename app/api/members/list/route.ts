import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch members with all their related information
    const members = await prisma.member.findMany({
      select: {
        id: true,
        membershipNumber: true,
        firstname: true,
        lastname: true,
        email: true,
        tel: true,
        sexe: true,
        birthdate: true,
        photoUrl: true,
        subscriptionType: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        subscriptionStatus: true,
        inscriptionDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Return the members data
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members: " + (error as Error).message },
      { status: 500 }
    );
  }
}