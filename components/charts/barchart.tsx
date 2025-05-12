"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Add styles for dark mode
import React from "react";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    theme: {
      light: "hsl(215, 70%, 60%)",
      dark: "hsl(215, 80%, 65%)",
    },
  },
  mobile: {
    label: "Mobile",
    theme: {
      light: "hsl(280, 65%, 60%)",
      dark: "hsl(280, 75%, 70%)",
    },
  },
} satisfies ChartConfig;

export function BarChartComponent() {  return (
    <Card className="max-w-full overflow-hidden dark:border-slate-700 h-full">
      <CardHeader className="px-3 py-3">
        <CardTitle className="text-sm">
          Bar Chart - Multiple
        </CardTitle>
        <CardDescription className="text-xs">
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <ChartContainer
          config={chartConfig}
          className="w-full h-[170px] dark:text-slate-200"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--grid-color, #e0e0e0)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm px-4 sm:px-6">
        <div className="flex gap-2 font-medium leading-none text-xs sm:text-sm">
          Trending up by 5.2% this month{" "}
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <div className="leading-none text-muted-foreground text-xs sm:text-sm">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
