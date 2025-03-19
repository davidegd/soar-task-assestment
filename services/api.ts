import {
  mockCards,
  mockChartData,
  mockContacts,
  mockTransactions,
  mockUser,
} from "@/constants/mocks";
import type { Card, Transaction, User, Contact } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCards(): Promise<Card[]> {
  await delay(500);
  return mockCards;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  await delay(500);
  return mockTransactions;
}

export async function fetchUser(): Promise<User> {
  await delay(500);
  return mockUser;
}

export async function fetchContacts(): Promise<Contact[]> {
  await delay(500);
  return mockContacts;
}

export async function fetchChartData() {
  await delay(500);
  return mockChartData;
}
