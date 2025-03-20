"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const DynamicWeeklyActivityChart = dynamic(
  () =>
    import("@/components/dashboard/charts/weekly-activity-chart").then(
      (mod) => mod.WeeklyActivityChart
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

export const DynamicExpenseStatisticsChart = dynamic(
  () =>
    import("@/components/dashboard/charts/expense-statistics-chart").then(
      (mod) => mod.ExpenseStatisticsChart
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

export const DynamicBalanceHistoryChart = dynamic(
  () =>
    import("@/components/dashboard/charts/balance-history-chart").then(
      (mod) => mod.BalanceHistoryChart
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);
