"use client"
import { CardItem } from "@/components/dashboard/card-item"
import { Skeleton } from "@/components/ui/skeleton"
import { useApp } from "@/context/app-context"
import { Card } from "@/types"
import { memo } from "react"

export default function CardsPage() {
  const { cards, isLoading } = useApp()
  const MemoizedCardItem = memo(CardItem)

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">My Cards</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3  ">
        {cards.map((card: Card) => (
          <MemoizedCardItem key={card.id} card={card} />
        ))}
      </div>
    </>
  )
}
