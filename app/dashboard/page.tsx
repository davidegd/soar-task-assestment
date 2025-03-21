"use client";

import { CardItem } from "@/components/dashboard/card-item";
import {
  DynamicBalanceHistoryChart,
  DynamicExpenseStatisticsChart,
  DynamicWeeklyActivityChart,
} from "@/components/dashboard/charts/dynamic-chart";
import { QuickTransfer } from "@/components/dashboard/quick-transfer";
import { TransactionItem } from "@/components/dashboard/transaction-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/app-context";
import Link from "next/link";
import React from "react";
import { memo, Suspense } from "react";

const MemoizedCardItem = memo(CardItem);
const MemoizedTransactionItem = memo(TransactionItem);
const ChartFallback = () => <Skeleton className="h-64 w-full rounded-xl" />;

export default function DashboardPage() {
  const {
    cards,
    transactions,
    weeklyActivityData,
    expenseStatisticsData,
    balanceHistoryData,
    isLoading,
    contacts,
  } = useApp();

  if (isLoading) {
    return (
      <div className="space-y-8" aria-busy="true" aria-live="polite">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-60" aria-hidden="true" />
          <Skeleton className="h-8 w-40" aria-hidden="true" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" aria-hidden="true" />
          <Skeleton className="h-48 rounded-xl" aria-hidden="true" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-40" aria-hidden="true" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" aria-hidden="true" />
            <Skeleton className="h-16 w-full" aria-hidden="true" />
            <Skeleton className="h-16 w-full" aria-hidden="true" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" aria-hidden="true" />
          <Skeleton className="h-80 rounded-xl" aria-hidden="true" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 lg:grid-cols-3">
        <div className="col-span-2 flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary" id="my-cards-heading">
              My Cards
            </h2>
            <Link
              href="/cards"
              className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-muted-foreground"
              aria-label="See all cards"
            >
              See All
            </Link>
          </div>
          <div
            className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto py-3 pr-4"
            role="list"
            aria-labelledby="my-cards-heading"
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="w-10/12 flex-shrink-0 snap-center md:w-1/2"
                role="listitem"
              >
                <MemoizedCardItem key={card.id} card={card} />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary" id="recent-transactions-heading">
            Recent Transactions
          </h2>
          <div
            className="flex min-h-60 flex-col justify-between rounded-2xl bg-background px-4 py-2.5 shadow-sm"
            role="list"
            aria-labelledby="recent-transactions-heading"
          >
            {transactions.map((transaction) => (
              <MemoizedTransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <h2 className="text-xl font-semibold text-secondary" id="weekly-activity-heading">
            Weekly Activity
          </h2>
          <div
            className="rounded-2xl bg-background p-4 shadow-sm"
            role="region"
            aria-labelledby="weekly-activity-heading"
          >
            <Suspense fallback={<ChartFallback />}>
              <DynamicWeeklyActivityChart
                data={weeklyActivityData}
                className="h-64"
                aria-label="Weekly activity chart"
              />
            </Suspense>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary" id="expense-statistics-heading">
            Expense Statistics
          </h2>
          <div
            className="flex flex-col items-center space-x-8 rounded-2xl bg-background p-4 shadow-sm md:flex-row"
            role="region"
            aria-labelledby="expense-statistics-heading"
          >
            <div className="my-2 flex flex-col gap-2 text-sm">
              {expenseStatisticsData.labels.map((label, index) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: Array.isArray(
                        expenseStatisticsData.datasets[0].backgroundColor
                      )
                        ? expenseStatisticsData.datasets[0].backgroundColor[index]
                        : undefined,
                    }}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                  <span className="font-medium">
                    {expenseStatisticsData.datasets[0].data[index]}%
                  </span>
                </div>
              ))}
            </div>
            <div className="relative flex h-64">
              <Suspense fallback={<ChartFallback />}>
                <DynamicExpenseStatisticsChart
                  data={expenseStatisticsData}
                  className="h-64"
                  aria-label="Expense statistics chart"
                />
              </Suspense>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="-white flex flex-col items-center justify-center rounded-full bg-background p-4 shadow-sm">
                  <span className="text-lg font-bold">35%</span>
                  <span className="text-xs text-muted-foreground">Others</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary" id="quick-transfer-heading">
            Quick Transfer
          </h2>
          <div
            className="rounded-2xl bg-background p-4 shadow-sm"
            role="region"
            aria-labelledby="quick-transfer-heading"
          >
            <QuickTransfer contacts={contacts} />
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-secondary" id="balance-history-heading">
            Balance History
          </h2>
          <div
            className="rounded-2xl bg-background p-4 shadow-sm"
            role="region"
            aria-labelledby="balance-history-heading"
          >
            <Suspense fallback={<ChartFallback />}>
              <DynamicBalanceHistoryChart
                data={balanceHistoryData}
                className="h-64"
                aria-label="Balance history chart"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
