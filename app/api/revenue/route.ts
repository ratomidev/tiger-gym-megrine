import { startOfMonth, endOfMonth, addMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);
    const firstDayOfNextMonth = startOfMonth(addMonths(now, 1));
    const lastDayOfNextMonth = endOfMonth(addMonths(now, 1));
    const firstDayOfPrevMonth = startOfMonth(addMonths(now, -1));
    const lastDayOfPrevMonth = endOfMonth(addMonths(now, -1));

    // Current month subscriptions
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

    // Previous month subscriptions
    const prevMonthSubscriptions = await prisma.subscription.findMany({
      where: {
        startDate: {
          gte: firstDayOfPrevMonth,
          lte: lastDayOfPrevMonth,
        },
      },
      select: {
        price: true,
      },
    });

    // Projected subscriptions
    const projectedSubscriptions = await prisma.subscription.findMany({
      where: {
        startDate: {
          gte: firstDayOfNextMonth,
          lte: lastDayOfNextMonth,
        },
      },
      select: {
        price: true,
      },
    });

    // Subscriptions by plan
    const subscriptionsByPlan = await prisma.subscription.groupBy({
      by: ["plan"],
      where: {
        startDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      currentMonthSubscriptions: currentMonthSubscriptions.map((s) => ({
        price: Number(s.price),
      })),
      prevMonthSubscriptions: prevMonthSubscriptions.map((s) => ({
        price: Number(s.price),
      })),
      projectedSubscriptions: projectedSubscriptions.map((s) => ({
        price: Number(s.price),
      })),
      subscriptionsByPlan: subscriptionsByPlan.map((plan) => ({
        name: plan.plan,
        revenue: Number(plan._sum.price) || 0,
        count: plan._count.id,
      })),
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
