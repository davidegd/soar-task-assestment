"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { Card, Transaction, User, Contact, ChartData } from "@/types";
import {
  fetchCards,
  fetchTransactions,
  fetchUser,
  fetchContacts,
  fetchChartData,
} from "@/services/api";
import { toast } from "sonner";
import type { AppContextType } from "@/types/context";
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(
    async (forceRefresh = false) => {
      if (
        !forceRefresh &&
        lastUpdated &&
        new Date().getTime() - lastUpdated.getTime() < 5 * 60 * 1000 &&
        user
      ) {
        return;
      }

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
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        toast.error("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
        if (typeof window !== "undefined") {
          act(() => setIsLoading(false));
        }
      }
    },
    [lastUpdated, user]
  );

  useEffect(() => {
    loadData();

    const intervalId = setInterval(() => {
      loadData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [loadData]);

  const updateUserProfile = useCallback(async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUser((prev: User | null) => (prev ? { ...prev, ...userData } : null));
      toast.success("Your profile has been updated successfully.");
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
      if (typeof window !== "undefined") {
        act(() => setIsLoading(false));
      }
    }
  }, []);

  const transferMoney = useCallback(
    async (contactId: string, amount: number) => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        setCards((prevCards: Card[]) => {
          if (prevCards.length === 0) return prevCards;

          const updatedCards = [...prevCards];
          updatedCards[0] = {
            ...updatedCards[0],
            balance: updatedCards[0].balance - amount,
          };

          return updatedCards;
        });

        const contact = contacts.find((c: Contact) => c.id === contactId);
        if (contact) {
          const newTransaction: Transaction = {
            id: `tx-${Date.now()}`,
            title: `Transfer to ${contact.name}`,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            amount: -amount,
            type: "withdrawal",
            icon: "user",
          };

          setTransactions((prev: TransactionType) => [newTransaction, ...prev]);
        }

        toast.success(`$${amount.toFixed(2)} has been sent successfully.`);
      } catch (err) {
        toast.error("Failed to transfer money. Please try again.");
      } finally {
        setIsLoading(false);
        if (typeof window !== "undefined") {
          act(() => setIsLoading(false));
        }
      }
    },
    [contacts]
  );

  const value = useMemo(
    () => ({
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
      refreshData: () => loadData(true),
    }),
    [
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
      loadData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
