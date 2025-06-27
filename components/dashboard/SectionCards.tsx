import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"

// This is now a server component (no 'use client' directive)
export default async function SectionCards() {
  // Get the current month's date range
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Get the previous month's date range for comparison
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Get total revenue for current month
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
  })

  const totalRevenue = currentMonthSubscriptions.reduce(
    (sum, subscription) => sum + Number(subscription.price),
    0
  )

  // Get total revenue for previous month for comparison
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
  })

  const previousMonthRevenue = previousMonthSubscriptions.reduce(
    (sum, subscription) => sum + Number(subscription.price),
    0
  )

  // Calculate revenue growth percentage
  const revenueGrowth =
    previousMonthRevenue > 0
      ? ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 100

  // Get new customers (adherents) this month
  const newCustomers = await prisma.adherent.count({
    where: {
      createdAt: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
  })

  // Get new customers from previous month
  const previousMonthNewCustomers = await prisma.adherent.count({
    where: {
      createdAt: {
        gte: firstDayOfLastMonth,
        lte: lastDayOfLastMonth,
      },
    },
  })

  // Calculate customer growth percentage
  const customerGrowth =
    previousMonthNewCustomers > 0
      ? ((newCustomers - previousMonthNewCustomers) / previousMonthNewCustomers) * 100
      : 100

  // Get active subscriptions count
  const activeSubscriptions = await prisma.subscription.count({
    where: {
      status: "actif",
      endDate: {
        gte: now,
      },
    },
  })

  // Get active subscriptions from last month
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
  })

  // Calculate active accounts growth
  const activeAccountsGrowth =
    previousMonthActiveSubscriptions > 0
      ? ((activeSubscriptions - previousMonthActiveSubscriptions) / previousMonthActiveSubscriptions) * 100
      : 100

  // Calculate overall growth rate based on revenue and customers
  const growthRate = (revenueGrowth + customerGrowth) / 2

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
            {newCustomers}
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
            {activeSubscriptions}
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
  )
}
