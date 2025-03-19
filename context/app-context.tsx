"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Card, Transaction, User, Contact, ChartData } from "@/types";
import {
  fetchCards,
  fetchTransactions,
  fetchUser,
  fetchContacts,
  fetchChartData,
} from "@/services/api";

type AppContextType = {
  user: User | null;
  cards: Card[];
  transactions: Transaction[];
  contacts: Contact[];
  weeklyActivityData: ChartData;
  expenseStatisticsData: ChartData;
  balanceHistoryData: ChartData;
  isLoading: boolean;
  error: string | null;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  transferMoney: (contactId: string, amount: number) => Promise<void>;
};

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
  const { toast } = useToast();

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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      setUser((prev) => (prev ? { ...prev, ...userData } : null));

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const transferMoney = async (contactId: string, amount: number) => {
    try {
      setIsLoading(true);
      toast({
        title: "Transfer Successful",
        description: `$${amount.toFixed(2)} has been sent successfully.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to transfer money. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
