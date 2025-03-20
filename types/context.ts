import { Card, ChartData, Contact, Transaction, User } from ".";

export type AppContextType = {
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
