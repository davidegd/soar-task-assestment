import {
  mockCards,
  mockChartData,
  mockContacts,
  mockTransactions,
  mockUser,
} from "@/constants/mocks"
import type { Card, Transaction, User, Contact } from "@/types"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 3 * 60 * 1000

async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = CACHE_TTL
): Promise<T> {
  const now = Date.now()
  const cachedItem = cache.get(key)

  if (cachedItem && now - cachedItem.timestamp < ttl) {
    return cachedItem.data as T
  }

  const data = await fetchFn()
  cache.set(key, { data, timestamp: now })
  return data
}

export function clearCache(key?: string) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}

export async function fetchCards(): Promise<Card[]> {
  return fetchWithCache("cards", async () => {
    await delay(800)
    return mockCards
  })
}

export async function fetchTransactions(): Promise<Transaction[]> {
  return fetchWithCache("transactions", async () => {
    await delay(800)
    return mockTransactions
  })
}

export async function fetchUser(): Promise<User> {
  return fetchWithCache("user", async () => {
    await delay(800)
    return mockUser
  })
}

export async function fetchContacts(): Promise<Contact[]> {
  return fetchWithCache("contacts", async () => {
    await delay(800)
    return mockContacts
  })
}

export async function fetchChartData() {
  return fetchWithCache("chartData", async () => {
    await delay(800)
    return mockChartData
  })
}
