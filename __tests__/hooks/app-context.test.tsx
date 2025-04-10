import { renderHook, act, waitFor } from "@testing-library/react"
import { AppProvider, useApp } from "@/context/app-context"
import type { ReactNode } from "react"

jest.mock("@/services/api", () => ({
  fetchUser: jest.fn().mockResolvedValue({
    id: "1",
    name: "Charlene Ree",
    email: "charlenereed@gmail.com",
  }),
  fetchCards: jest
    .fn()
    .mockResolvedValue([{ id: "1", cardNumber: "3778341298764321", balance: 5756 }]),
  fetchTransactions: jest
    .fn()
    .mockResolvedValue([{ id: "1", title: "Test Transaction", amount: 500 }]),
  fetchContacts: jest.fn().mockResolvedValue([{ id: "1", name: "Livia Bator" }]),
  fetchChartData: jest.fn().mockResolvedValue({
    weeklyActivity: { labels: [], datasets: [] },
    expenseStatistics: { labels: [], datasets: [] },
    balanceHistory: { labels: [], datasets: [] },
  }),
}))

const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>

describe("useApp hook", () => {
  it("loads data on initialization", async () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.user).toEqual({
      id: "1",
      name: "Charlene Ree",
      email: "charlenereed@gmail.com",
    })
    expect(result.current.cards).toEqual([
      { id: "1", cardNumber: "3778341298764321", balance: 5756 },
    ])
    expect(result.current.transactions).toEqual([
      { id: "1", title: "Test Transaction", amount: 500 },
    ])
    expect(result.current.contacts).toEqual([{ id: "1", name: "Livia Bator" }])
  })

  it("updates user profile", async () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.updateUserProfile({ name: "Charlene Ree" })
    })

    expect(result.current.user?.name).toBe("Charlene Ree")
  })

  it("handles transfer money function", async () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.transferMoney("1", 100)
    })

    expect(result.current.isLoading).toBe(false)
  })

  it("handles API failure on initialization", async () => {
    require("@/services/api").fetchUser.mockRejectedValue(new Error("Failed to fetch user"))
    require("@/services/api").fetchCards.mockRejectedValue(new Error("Failed to fetch cards"))
    require("@/services/api").fetchTransactions.mockRejectedValue(
      new Error("Failed to fetch transactions")
    )
    require("@/services/api").fetchContacts.mockRejectedValue(new Error("Failed to fetch contacts"))
    require("@/services/api").fetchChartData.mockRejectedValue(
      new Error("Failed to fetch chart data")
    )

    const { result } = renderHook(() => useApp(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.user).toBeNull()
    expect(result.current.cards).toEqual([])
    expect(result.current.transactions).toEqual([])
    expect(result.current.contacts).toEqual([])
    expect(result.current.error).toBe("Failed to load data. Please try again later.")
  })
})
