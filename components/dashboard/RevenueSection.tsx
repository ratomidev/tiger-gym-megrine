"use client";

import { useState, useEffect } from "react";
import { addMonths, format, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconCash,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select,
  SelectContent,  
  SelectItem,
  SelectTrigger,
  SelectValue
 } from "../ui/select";

// Types
type SubscriptionData = {
  price: number;
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
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Définir le type pour les options de mois
  interface MonthOption {
    value: string;
    label: string;
    date: Date;
  }

  // Générer la liste des 12 derniers mois
  const generateMonthOptions = (): MonthOption[] => {
    const months: MonthOption[] = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const monthDate = subMonths(currentDate, i);
      const value = format(monthDate, "yyyy-MM");
      const label = format(monthDate, "MMMM yyyy", { locale: fr });
      
      months.push({
        value,
        label: i === 0 ? `${label} (Actuel)` : label,
        date: monthDate
      });
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();

  useEffect(() => {
    // Définir le mois actuel comme sélectionné par défaut
    if (!selectedMonth && monthOptions.length > 0) {
      setSelectedMonth(monthOptions[0].value);
    }
  }, [selectedMonth, monthOptions]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Ajouter le mois sélectionné à la requête API
        const url = selectedMonth 
          ? `/api/revenue?month=${selectedMonth}`
          : "/api/revenue";
          
        const response = await fetch(url);
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

    if (selectedMonth) {
      setLoading(true);
      fetchRevenueData();
    }
  }, [selectedMonth]);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
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

  // Obtenir le nom du mois sélectionné pour l'affichage
  const selectedMonthData = monthOptions.find(m => m.value === selectedMonth);
  const selectedMonthLabel = selectedMonthData?.label || "Mois sélectionné";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analyse des Revenus</h2>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Sélectionner un mois" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Carte de revenu du mois sélectionné */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenu Total ({selectedMonthLabel.replace(" (Actuel)", "")})
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
                vs. {format(subMonths(selectedMonthData?.date || new Date(), 1), "MMMM yyyy", { locale: fr })}
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
                vs. mois sélectionné
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
                par rapport au mois précédent
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
                par rapport au mois précédent
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
