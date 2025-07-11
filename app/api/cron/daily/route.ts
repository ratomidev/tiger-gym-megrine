import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check authorization from header OR query parameter
    const authHeader = request.headers.get("authorization");
    const queryKey = request.nextUrl.searchParams.get("key");

    const hasValidHeader = authHeader === `Bearer ${process.env.CRON_API_KEY}`;
    const hasValidQuery = queryKey === process.env.CRON_API_KEY;

    if (!hasValidHeader && !hasValidQuery) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          debug: {
            hasHeader: !!authHeader,
            hasQuery: !!queryKey,
          },
        },
        { status: 401 }
      );
    }

    console.log("✅ Running daily cron job...");
    console.log("Auth method:", hasValidHeader ? "Header" : "Query parameter");

    const now = new Date();

    // 1. Expire subscriptions that have passed their end date
    const expiredSubscriptions = await prisma.subscription.updateMany({
      where: {
        endDate: {
          lt: now,
        },
        status: "actif",
      },
      data: {
        status: "expiré",
      },
    });

    console.log(`📅 Expired ${expiredSubscriptions.count} subscriptions`);

    // 2. Mark adherents as inactive if they have no active subscriptions
    const adherentsWithExpiredSubscriptions = await prisma.adherent.findMany({
      where: {
        subscription: {
          OR: [
            {
              status: "expire",
            },
            {
              endDate: {
                lt: now,
              },
            },
          ],
        },
        isValidated: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    // Update validation status for adherents with expired subscriptions
    if (adherentsWithExpiredSubscriptions.length > 0) {
      await prisma.adherent.updateMany({
        where: {
          id: {
            in: adherentsWithExpiredSubscriptions.map(
              (a: { id: string; firstName: string; lastName: string }) => a.id
            ),
          },
        },
        data: {
          isValidated: false,
        },
      });
    }

    console.log(
      `👥 Marked ${adherentsWithExpiredSubscriptions.length} adherents as inactive`
    );

    // 3. Clean up old logs or notifications (optional)
    // Example: Delete logs older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Uncomment if you have a logs table
    // const deletedLogs = await prisma.log.deleteMany({
    //   where: {
    //     createdAt: {
    //       lt: thirtyDaysAgo,
    //     },
    //   },
    // });
    // console.log(`🗑️ Deleted ${deletedLogs.count} old logs`);

    const result = {
      timestamp: now.toISOString(),
      expiredSubscriptions: expiredSubscriptions.count,
      inactiveAdherents: adherentsWithExpiredSubscriptions.length,
      status: "success",
    };

    console.log("✅ Daily cron job completed successfully:", result);

    return NextResponse.json({
      message: "Daily cron job completed successfully ✅",
      data: result,
    });
  } catch (error) {
    console.error("❌ Daily cron job error:", error);
    return NextResponse.json(
      {
        error: "Daily cron job failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Ensure this route is treated as dynamic
export const dynamic = "force-dynamic";
