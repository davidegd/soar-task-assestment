import { Card, Contact, Transaction, User } from "@/types";
import UserAvatar from "@/assets/images/user.png";

export const mockCards: Card[] = [
  {
    id: "1",
    cardNumber: "3778 3412 9876 4321",
    cardHolder: "Eddy Cusuma",
    validThru: "12/26",
    balance: 5756,
    type: "mastercard",
    isDark: true,
  },
  {
    id: "2",
    cardNumber: "4576 9876 3412 1234",
    cardHolder: "Eddy Cusuma",
    validThru: "12/25",
    balance: 3456,
    type: "visa",
    isDark: false,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Deposit from my Card",
    date: "28 January 2021",
    amount: -850,
    type: "withdrawal",
    icon: "credit-card",
  },
  {
    id: "2",
    title: "Deposit Paypal",
    date: "25 January 2021",
    amount: 2500,
    type: "deposit",
    icon: "paypal",
  },
  {
    id: "3",
    title: "Jemi Wilson",
    date: "21 January 2021",
    amount: 5400,
    type: "deposit",
    icon: "user",
  },
];

export const mockUser: User = {
  id: "1",
  name: "Charlene Reed",
  username: "Charlene Reed",
  email: "charlenereed@gmail.com",
  avatar: UserAvatar as unknown as string,
  dateOfBirth: "25 January 1990",
  presentAddress: "San Jose, California, USA",
  permanentAddress: "San Jose, California, USA",
  city: "San Jose",
  postalCode: "45962",
  country: "USA",
};

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Livia Bator",
    role: "CEO",
  },
  {
    id: "2",
    name: "Randy Press",
    role: "Director",
  },
  {
    id: "3",
    name: "Workman",
    role: "Designer",
  },
];

export const mockChartData = {
  weeklyActivity: {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Withdraw",
        data: [300, 150, 400, 250, 200, 250, 320, 220],
        backgroundColor: "#4F46E5",
      },
      {
        label: "Deposit",
        data: [450, 350, 300, 350, 150, 350, 400, 500],
        backgroundColor: "#1F2937",
      },
    ],
  },
  expenseStatistics: {
    labels: ["Entertainment", "Investment", "Bill Expense", "Others"],
    datasets: [
      {
        label: "Expenses",
        data: [30, 20, 15, 35],
        backgroundColor: ["#312E81", "#4F46E5", "#F97316", "#1F2937"],
      },
    ],
  },
  balanceHistory: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Balance",
        data: [100, 500, 300, 600, 800, 300, 400, 600, 800],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  },
};
