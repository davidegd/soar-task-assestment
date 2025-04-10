"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import type { Card, Transaction, User, Contact, ChartData } from "@/types"
import {
  fetchCards,
  fetchTransactions,
  fetchUser,
  fetchContacts,
  fetchChartData,
} from "@/services/api"
import { type Product, type ProductGroup } from "@/services/product-service"
import { fetchClientProductGroup } from "@/services/alegra-service"

type AppContextType = {
  user: User | null
  cards: Card[]
  transactions: Transaction[]
  contacts: Contact[]
  weeklyActivityData: ChartData
  expenseStatisticsData: ChartData
  balanceHistoryData: ChartData
  productGroups: ProductGroup[]
  currentProductGroup: ProductGroup | null
  categorizedProducts: Record<string, Product[]>
  alegraProducts: Product[]
  isLoading: boolean
  error: string | null
  updateUserProfile: (userData: Partial<User>) => Promise<void>
  transferMoney: (contactId: string, amount: number) => Promise<void>
  refreshData: () => Promise<void>
  loadProductGroup: (
    id: string,
    params?: { clientId?: string | null; dateAfter?: string | null }
  ) => Promise<void>
  setAlegraProducts: (products: Product[]) => void
  setCategorizedProducts: (categorized: Record<string, Product[]>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [weeklyActivityData, setWeeklyActivityData] = useState<ChartData>({
    labels: [],
    datasets: [],
  })
  const [expenseStatisticsData, setExpenseStatisticsData] = useState<ChartData>({
    labels: [],
    datasets: [],
  })
  const [balanceHistoryData, setBalanceHistoryData] = useState<ChartData>({
    labels: [],
    datasets: [],
  })
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [currentProductGroup, setCurrentProductGroup] = useState<ProductGroup | null>(null)
  const [categorizedProducts, setCategorizedProducts] = useState<Record<string, Product[]>>({})
  const [alegraProducts, setAlegraProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)

      // Fetch all data in parallel
      const [userData, cardsData, transactionsData, contactsData, chartData] = await Promise.all([
        fetchUser(),
        fetchCards(),
        fetchTransactions(),
        fetchContacts(),
        fetchChartData(),
      ])

      setUser(userData)
      setCards(cardsData)
      setTransactions(transactionsData)
      setContacts(contactsData)
      setWeeklyActivityData(chartData.weeklyActivity)
      setExpenseStatisticsData(chartData.expenseStatistics)
      setBalanceHistoryData(chartData.balanceHistory)

      setError(null)
    } catch (err) {
      setError("Failed to load data. Please try again later.")
      toast.error("Failed to load data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    // Set up polling for real-time updates (every 5 minutes)
    const intervalId = setInterval(
      () => {
        loadData()
      },
      5 * 60 * 1000
    )

    return () => clearInterval(intervalId)
  }, [loadData])

  const updateUserProfile = useCallback(async (userData: Partial<User>) => {
    try {
      setIsLoading(true)
      // In a real app, this would be an API call
      // await updateUserAPI(userData)

      // For now, just update the local state
      setUser((prev) => (prev ? { ...prev, ...userData } : null))

      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      })
    } catch (err) {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const transferMoney = useCallback(async (contactId: string, amount: number) => {
    try {
      setIsLoading(true)
      // In a real app, this would be an API call
      // await transferMoneyAPI(contactId, amount)

      // For now, just show a success message
      toast.success("Transfer Successful", {
        description: `$${amount.toFixed(2)} has been sent successfully.`,
      })
    } catch (err) {
      toast.error("Error", {
        description: "Failed to transfer money. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshData = useCallback(async () => {
    await loadData()
    toast.success("Data Refreshed", {
      description: "Your dashboard has been updated with the latest data.",
    })
  }, [loadData])

  const value = useMemo(
    () => ({
      user,
      cards,
      transactions,
      contacts,
      weeklyActivityData,
      expenseStatisticsData,
      balanceHistoryData,
      productGroups,
      currentProductGroup,
      categorizedProducts,
      alegraProducts,
      isLoading,
      error,
      updateUserProfile,
      transferMoney,
      refreshData,
      setAlegraProducts,
      setCategorizedProducts,
    }),
    [
      user,
      cards,
      transactions,
      contacts,
      weeklyActivityData,
      expenseStatisticsData,
      balanceHistoryData,
      productGroups,
      currentProductGroup,
      categorizedProducts,
      alegraProducts,
      isLoading,
      error,
      updateUserProfile,
      transferMoney,
      refreshData,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
