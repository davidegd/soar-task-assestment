"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { Card, Transaction, User, Contact, ChartData } from "@/types";
import {
  fetchCards,
  fetchTransactions,
  fetchUser,
  fetchContacts,
  fetchChartData,
} from "@/services/api";
import { toast } from "sonner";
import { AppContextType } from "@/types/context";
import { act } from "@testing-library/react";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [weeklyActivityData, setWeeklyActivityData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [expenseStatisticsData, setExpenseStatisticsData] = useState<ChartData>(
    { labels: [], datasets: [] }
  );
  const [balanceHistoryData, setBalanceHistoryData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [userData, cardsData, transactionsData, contactsData, chartData] =
          await Promise.all([
            fetchUser(),
            fetchCards(),
            fetchTransactions(),
            fetchContacts(),
            fetchChartData(),
          ]);

        setUser(userData);
        setCards(cardsData);
        setTransactions(transactionsData);
        setContacts(contactsData);
        setWeeklyActivityData(chartData.weeklyActivity);
        setExpenseStatisticsData(chartData.expenseStatistics);
        setBalanceHistoryData(chartData.balanceHistory);

        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        toast.error("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
        act(() => setIsLoading(false));
      }
    };

    loadData();
  }, [toast]);

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      setUser((prev) => (prev ? { ...prev, ...userData } : null));

      toast.success("Your profile has been updated successfully.");
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
      act(() => setIsLoading(false));
    }
  };

  const transferMoney = async (contactId: string, amount: number) => {
    try {
      setIsLoading(true);
      toast.success(`$${amount.toFixed(2)} has been sent successfully.`);
    } catch (err) {
      toast.error("Failed to transfer money. Please try again.");
    } finally {
      setIsLoading(false);
      act(() => setIsLoading(false));
    }
  };

  const value = {
    user,
    cards,
    transactions,
    contacts,
    weeklyActivityData,
    expenseStatisticsData,
    balanceHistoryData,
    isLoading,
    error,
    updateUserProfile,
    transferMoney,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
