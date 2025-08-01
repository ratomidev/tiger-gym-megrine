import { startOfMonth, endOfMonth, addMonths, subMonths, parseISO } from "date-fns";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Récupérer le mois sélectionné de la requête
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get('month');
    
    // Déterminer la date de référence (mois sélectionné ou mois actuel)
    let referenceDate: Date;
    
    if (monthParam) {
      // Format attendu: "yyyy-MM"
      referenceDate = parseISO(`${monthParam}-01`);
      if (isNaN(referenceDate.getTime())) {
        throw new Error("Format de date invalide");
      }
    } else {
      referenceDate = new Date();
    }

    // Calculer les dates de début et fin pour le mois sélectionné
    const firstDayOfMonth = startOfMonth(referenceDate);
    const lastDayOfMonth = endOfMonth(referenceDate);
    
    // Calculer les dates pour le mois suivant
    const firstDayOfNextMonth = startOfMonth(addMonths(referenceDate, 1));
    const lastDayOfNextMonth = endOfMonth(addMonths(referenceDate, 1));
    
    // Calculer les dates pour le mois précédent
    const firstDayOfPrevMonth = startOfMonth(subMonths(referenceDate, 1));
    const lastDayOfPrevMonth = endOfMonth(subMonths(referenceDate, 1));

    // Abonnements du mois sélectionné
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

    // Abonnements du mois précédent
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

    // Abonnements projetés pour le mois suivant
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

    // Abonnements par plan pour le mois sélectionné
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
      // Ajouter des informations sur le mois sélectionné pour le frontend
      selectedMonth: {
        current: firstDayOfMonth.toISOString(),
        previous: firstDayOfPrevMonth.toISOString(),
        next: firstDayOfNextMonth.toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
