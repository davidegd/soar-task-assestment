"use client";

import { CardItem } from "@/components/dashboard/card-item";
import { TransactionItem } from "@/components/dashboard/transaction-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/app-context";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { memo, Suspense } from "react";

const MemoizedCardItem = memo(CardItem);
const MemoizedTransactionItem = memo(TransactionItem);

export default function DashboardPage() {
  const { cards, transactions, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div className="md:grid space-y-6 md:space-y-0 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className=" flex-col  col-span-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Cards</h2>
            <Button variant="ghost" asChild size="sm">
              <Link
                href="/dashboard/cards"
                className="flex items-center gap-1 text-sm font-medium text-primary"
              >
                See All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex overflow-x-auto py-3 gap-4 snap-x snap-mandatory ">
            {cards.map((card) => (
              <div
                key={card.id}
                className="snap-center flex-shrink-0 md:flex-shrink w-10/12 md:w-1/2"
              >
                <MemoizedCardItem key={card.id} card={card} />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold ">Recent Transaction</h2>
          <div className="flex flex-col justify-between py-2.5  rounded-2xl bg-background  px-4 shadow-sm  min-h-60">
            {transactions.map((transaction) => (
              <MemoizedTransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
