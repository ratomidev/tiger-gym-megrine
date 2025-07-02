"use client";

import { useState, useEffect } from "react";
import { addMonths, format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconCash,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Types
type SubscriptionData = {
  price: number;
};

type PlanBreakdown = {
  name: string;
  revenue: number;
  count: number;
  percentage: number;
};

type RevenueData = {
  currentMonthSubscriptions: SubscriptionData[];
  prevMonthSubscriptions: SubscriptionData[];
  projectedSubscriptions: SubscriptionData[];
  subscriptionsByPlan: {
    name: string;
    revenue: number;
    count: number;
  }[];
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

export default function RevenueSection() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch("/api/revenue");
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }
        const revenueData = await response.json();
        setData(revenueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Analyse des Revenus
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Erreur: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const now = new Date();

  // Calculate revenue metrics
  const totalRevenueThisMonth = data.currentMonthSubscriptions.reduce(
    (sum, subscription) => sum + subscription.price,
    0
  );

  const totalRevenuePrevMonth = data.prevMonthSubscriptions.reduce(
    (sum, subscription) => sum + subscription.price,
    0
  );

  const projectedRevenueNextMonth = data.projectedSubscriptions.reduce(
    (sum, subscription) => sum + subscription.price,
    0
  );

  const revenueChangePercent =
    totalRevenuePrevMonth > 0
      ? ((totalRevenueThisMonth - totalRevenuePrevMonth) /
          totalRevenuePrevMonth) *
        100
      : 100;

  const projectedChangePercent =
    totalRevenueThisMonth > 0
      ? ((projectedRevenueNextMonth - totalRevenueThisMonth) /
          totalRevenueThisMonth) *
        100
      : 100;

  const averagePrice =
    data.currentMonthSubscriptions.length > 0
      ? totalRevenueThisMonth / data.currentMonthSubscriptions.length
      : 0;

  const prevAveragePrice =
    data.prevMonthSubscriptions.length > 0
      ? totalRevenuePrevMonth / data.prevMonthSubscriptions.length
      : 0;

  const averagePriceChangePercent =
    prevAveragePrice > 0
      ? ((averagePrice - prevAveragePrice) / prevAveragePrice) * 100
      : 0;

  const planBreakdown: PlanBreakdown[] = data.subscriptionsByPlan
    .map((plan) => ({
      name: plan.name,
      revenue: plan.revenue,
      count: plan.count,
      percentage:
        totalRevenueThisMonth > 0
          ? (plan.revenue / totalRevenueThisMonth) * 100
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
              {data.currentMonthSubscriptions.length}
            </div>
            <div className="flex items-center pt-1">
              {data.currentMonthSubscriptions.length -
                data.prevMonthSubscriptions.length >=
              0 ? (
                <IconArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <IconArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <Badge
                variant={
                  data.currentMonthSubscriptions.length -
                    data.prevMonthSubscriptions.length >=
                  0
                    ? "outline"
                    : "destructive"
                }
              >
                {Math.abs(
                  data.currentMonthSubscriptions.length -
                    data.prevMonthSubscriptions.length
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
