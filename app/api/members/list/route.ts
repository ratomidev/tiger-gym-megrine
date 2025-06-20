import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      select: {
        id: true,
        membershipNumber: true,
        firstname: true,
        lastname: true,
        email: true,
        tel: true,
        sexe: true,
        subscriptionType: true,
        subscriptionStatus: true,
        subscriptionEndDate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
