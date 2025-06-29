import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DateTime } from "luxon";

export const maxDuration = 300; // Set max duration to 5 minutes for this API route

// This function is triggered by a cron job running at midnight
export async function GET(request: NextRequest) {
  try {
    // Verify API key for security (you should store this in .env)
    const authHeader = request.headers.get("authorization") ?? request.headers.get("Authorization");
    if (!process.env.CRON_API_KEY || authHeader !== `Bearer ${process.env.CRON_API_KEY}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get current date
    const now = DateTime.now().setZone("Africa/Tunis").toJSDate();
    
    // Find all active subscriptions that have expired
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "actif",
        endDate: {
          lt: now, // Less than current date = expired
        },
      },
      include: {
        adherent: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Early exit if no subscriptions need updating
    if (expiredSubscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired subscriptions to update",
        updatedCount: 0,
      });
    }

    // Update status of expired subscriptions
    const updatePromises = expiredSubscriptions.map((subscription) => {
      return prisma.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: "expiré",
        },
      });
    });

    // Execute all updates
    const updatedSubscriptions = await prisma.$transaction(updatePromises);

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Updated ${updatedSubscriptions.length} expired subscriptions`,
      updatedCount: updatedSubscriptions.length,
      updatedIds: updatedSubscriptions.map(sub => sub.id),
    });
  } catch (error) {
    console.error("Error updating subscription statuses:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update subscription statuses",
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}