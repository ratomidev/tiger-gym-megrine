"use client";

import { useState, useEffect } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

type DashboardData = {
  currentMonthSubscriptions: { price: number }[];
  previousMonthSubscriptions: { price: number }[];
  newCustomers: number;
  previousMonthNewCustomers: number;
  activeSubscriptions: number;
  previousMonthActiveSubscriptions: number;
};

export default function SectionCards() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard-cards");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>
                <Skeleton className="h-4 w-24" />
              </CardDescription>
              <CardTitle>
                <Skeleton className="h-8 w-32" />
              </CardTitle>
              <CardAction>
                <Skeleton className="h-6 w-16" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const now = new Date();

  // Calculate metrics
  const totalRevenue = data.currentMonthSubscriptions.reduce(
    (sum, subscription) => sum + subscription.price,
    0
  );

  const previousMonthRevenue = data.previousMonthSubscriptions.reduce(
    (sum, subscription) => sum + subscription.price,
    0
  );

  const revenueGrowth =
    previousMonthRevenue > 0
      ? ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 100;

  const customerGrowth =
    data.previousMonthNewCustomers > 0
      ? ((data.newCustomers - data.previousMonthNewCustomers) / data.previousMonthNewCustomers) * 100
      : 100;

  const activeAccountsGrowth =
    data.previousMonthActiveSubscriptions > 0
      ? ((data.activeSubscriptions - data.previousMonthActiveSubscriptions) / data.previousMonthActiveSubscriptions) * 100
      : 100;

  const growthRate = (revenueGrowth + customerGrowth) / 2;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalRevenue)}
          </CardTitle>
          <CardAction>
            <Badge variant={revenueGrowth >= 0 ? "outline" : "destructive"}>
              {revenueGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {revenueGrowth.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {revenueGrowth >= 0 ? "Trending up" : "Trending down"} this month
            {revenueGrowth >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Revenue for{" "}
            {now.toLocaleString("default", { month: "long" })}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Members</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.newCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant={customerGrowth >= 0 ? "outline" : "destructive"}>
              {customerGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {customerGrowth.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {customerGrowth >= 0 ? "Up" : "Down"}{" "}
            {Math.abs(customerGrowth).toFixed(1)}% this period
            {customerGrowth >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {customerGrowth < 0
              ? "Acquisition needs attention"
              : "Healthy member growth"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Memberships</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.activeSubscriptions}
          </CardTitle>
          <CardAction>
            <Badge variant={activeAccountsGrowth >= 0 ? "outline" : "destructive"}>
              {activeAccountsGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {activeAccountsGrowth.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activeAccountsGrowth >= 0
              ? "Strong member retention"
              : "Retention declining"}
            {activeAccountsGrowth >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {activeAccountsGrowth >= 0
              ? "Engagement exceeds targets"
              : "Engagement below targets"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {growthRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant={growthRate >= 0 ? "outline" : "destructive"}>
              {growthRate >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {growthRate.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {growthRate >= 0 ? "Steady performance increase" : "Performance declining"}
            {growthRate >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {growthRate >= 0
              ? "Meets growth projections"
              : "Below growth projections"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
