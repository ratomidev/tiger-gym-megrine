import { startOfMonth, endOfMonth, addMonths, format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconCash,
} from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Type for Prisma query result
type SubscriptionWithPrice = {
  price: Decimal;
};

// Type for Prisma groupBy result
type SubscriptionGroupByPlan = {
  plan: string;
  _sum: {
    price: Decimal | null;
  };
  _count: {
    id: number;
  };
};

// Fonction utilitaire pour formater les valeurs monétaires
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function RevenueSection() {
  // Obtenir les informations de date actuelles
  const now = new Date();

  // Calculer les limites du mois en cours
  const firstDayOfMonth = startOfMonth(now);
  const lastDayOfMonth = endOfMonth(now);

  // Calculer les limites du mois prochain
  const firstDayOfNextMonth = startOfMonth(addMonths(now, 1));
  const lastDayOfNextMonth = endOfMonth(addMonths(now, 1));

  // Calculer les limites du mois précédent (pour comparaison)
  const firstDayOfPrevMonth = startOfMonth(addMonths(now, -1));
  const lastDayOfPrevMonth = endOfMonth(addMonths(now, -1));

  // ---------------------------------------------------------------
  // 1. Revenu total ce mois-ci
  // ---------------------------------------------------------------
  // Obtenir le revenu du mois en cours
  const currentMonthSubscriptions: SubscriptionWithPrice[] =
    await prisma.subscription.findMany({
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

  const totalRevenueThisMonth = currentMonthSubscriptions.reduce(
    (sum: number, subscription) => sum + Number(subscription.price),
    0
  );

  // Obtenir le revenu du mois précédent pour comparaison
  const prevMonthSubscriptions: SubscriptionWithPrice[] =
    await prisma.subscription.findMany({
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

  const totalRevenuePrevMonth = prevMonthSubscriptions.reduce(
    (sum: number, subscription) => sum + Number(subscription.price),
    0
  );

  // Calculer le pourcentage de changement d'un mois à l'autre
  const revenueChangePercent =
    totalRevenuePrevMonth > 0
      ? ((totalRevenueThisMonth - totalRevenuePrevMonth) /
          totalRevenuePrevMonth) *
        100
      : 100;

  // ---------------------------------------------------------------
  // 2. Revenu prévisionnel pour le mois prochain
  // ---------------------------------------------------------------
  const projectedSubscriptions: SubscriptionWithPrice[] =
    await prisma.subscription.findMany({
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

  const projectedRevenueNextMonth = projectedSubscriptions.reduce(
    (sum: number, subscription) => sum + Number(subscription.price),
    0
  );

  // Calculer le pourcentage de changement prévisionnel
  const projectedChangePercent =
    totalRevenueThisMonth > 0
      ? ((projectedRevenueNextMonth - totalRevenueThisMonth) /
          totalRevenueThisMonth) *
        100
      : 100;

  // ---------------------------------------------------------------
  // 3. Prix moyen d'abonnement
  // ---------------------------------------------------------------
  const averagePrice =
    currentMonthSubscriptions.length > 0
      ? totalRevenueThisMonth / currentMonthSubscriptions.length
      : 0;

  // Obtenir la moyenne du mois précédent pour comparaison
  const prevAveragePrice =
    prevMonthSubscriptions.length > 0
      ? totalRevenuePrevMonth / prevMonthSubscriptions.length
      : 0;

  // Calculer le pourcentage de changement du prix moyen
  const averagePriceChangePercent =
    prevAveragePrice > 0
      ? ((averagePrice - prevAveragePrice) / prevAveragePrice) * 100
      : 0;

  // ---------------------------------------------------------------
  // 4. Répartition des revenus par type d'abonnement
  // ---------------------------------------------------------------
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

  // Trier les plans par revenu (du plus élevé au plus bas)
  const planBreakdown = subscriptionsByPlan
    .map((plan: SubscriptionGroupByPlan) => ({
      name: plan.plan,
      revenue: Number(plan._sum.price) || 0,
      count: plan._count.id,
      percentage:
        totalRevenueThisMonth > 0
          ? (Number(plan._sum.price) / totalRevenueThisMonth) * 100
          : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Analyse des Revenus</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Carte de revenu du mois en cours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenu Total ({format(now, "MMMM yyyy", { locale: fr })})
            </CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenueThisMonth)}
            </div>
            <div className="flex items-center pt-1">
              {revenueChangePercent >= 0 ? (
                <IconArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <IconArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <Badge
                variant={revenueChangePercent >= 0 ? "outline" : "destructive"}
              >
                {Math.abs(revenueChangePercent).toFixed(1)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                par rapport au mois dernier
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Carte de revenu prévisionnel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenu Prévisionnel (
              {format(addMonths(now, 1), "MMMM yyyy", { locale: fr })})
            </CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(projectedRevenueNextMonth)}
            </div>
            <div className="flex items-center pt-1">
              {projectedChangePercent >= 0 ? (
                <IconArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <IconArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <Badge
                variant={
                  projectedChangePercent >= 0 ? "outline" : "destructive"
                }
              >
                {Math.abs(projectedChangePercent).toFixed(1)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                vs. mois actuel
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Carte de prix moyen d'abonnement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Abonnement Moyen
            </CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(averagePrice)}
            </div>
            <div className="flex items-center pt-1">
              {averagePriceChangePercent >= 0 ? (
                <IconArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <IconArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <Badge
                variant={
                  averagePriceChangePercent >= 0 ? "outline" : "destructive"
                }
              >
                {Math.abs(averagePriceChangePercent).toFixed(1)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                par rapport au mois dernier
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Carte de nombre d'abonnements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nouveaux Abonnements
            </CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMonthSubscriptions.length}
            </div>
            <div className="flex items-center pt-1">
              {currentMonthSubscriptions.length -
                prevMonthSubscriptions.length >=
              0 ? (
                <IconArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <IconArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <Badge
                variant={
                  currentMonthSubscriptions.length -
                    prevMonthSubscriptions.length >=
                  0
                    ? "outline"
                    : "destructive"
                }
              >
                {Math.abs(
                  currentMonthSubscriptions.length -
                    prevMonthSubscriptions.length
                )}
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                par rapport au mois dernier
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition des revenus par plan */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des Revenus par Plan</CardTitle>
          <CardDescription>
            Distribution des revenus selon les différents types
            d&apos;abonnements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planBreakdown.map((plan) => (
              <div key={plan.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ({plan.count} abonnements)
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(plan.revenue)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={plan.percentage} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {plan.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
