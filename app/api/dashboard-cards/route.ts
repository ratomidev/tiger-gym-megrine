import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get current month subscriptions
    const currentMonthSubscriptions = await prisma.subscription.findMany({
      where: {
        startDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      select: {
        price: true,
      },
    });

    // Get previous month subscriptions
    const previousMonthSubscriptions = await prisma.subscription.findMany({
      where: {
        startDate: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth,
        },
      },
      select: {
        price: true,
      },
    });

    // Get new customers counts
    const newCustomers = await prisma.adherent.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    const previousMonthNewCustomers = await prisma.adherent.count({
      where: {
        createdAt: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth,
        },
      },
    });

    // Get active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        status: "actif",
        endDate: {
          gte: now,
        },
      },
    });

    const previousMonthActiveSubscriptions = await prisma.subscription.count({
      where: {
        status: "actif",
        endDate: {
          gte: lastDayOfLastMonth,
        },
        startDate: {
          lte: lastDayOfLastMonth,
        },
      },
    });

    return NextResponse.json({
      currentMonthSubscriptions: currentMonthSubscriptions.map((s) => ({
        price: Number(s.price),
      })),
      previousMonthSubscriptions: previousMonthSubscriptions.map((s) => ({
        price: Number(s.price),
      })),
      newCustomers,
      previousMonthNewCustomers,
      activeSubscriptions,
      previousMonthActiveSubscriptions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
