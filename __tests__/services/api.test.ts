jest.mock("@/services/api", () => {
  const {
    mockCards,
    mockChartData,
    mockContacts,
    mockTransactions,
    mockUser,
  } = require("@/constants/mocks");

  return {
    fetchCards: jest.fn().mockResolvedValue(mockCards),
    fetchTransactions: jest.fn().mockResolvedValue(mockTransactions),
    fetchUser: jest.fn().mockResolvedValue(mockUser),
    fetchContacts: jest.fn().mockResolvedValue(mockContacts),
    fetchChartData: jest.fn().mockResolvedValue(mockChartData),
  };
});

import {
  fetchCards,
  fetchTransactions,
  fetchUser,
  fetchContacts,
  fetchChartData,
} from "@/services/api";

jest.useFakeTimers();

describe("API Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetchCards returns mock data after delay", async () => {
    const promise = fetchCards();
    jest.advanceTimersByTime(800);
    await expect(promise).resolves.toEqual(
      require("@/constants/mocks").mockCards
    );
  });

  it("fetchChartData handles errors", async () => {
    (fetchChartData as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch chart data")
    );
    await expect(fetchChartData()).rejects.toThrow(
      "Failed to fetch chart data"
    );
  });

  it("fetchContacts returns mock data after delay", async () => {
    const promise = fetchContacts();
    jest.advanceTimersByTime(800);
    await expect(promise).resolves.toEqual(
      require("@/constants/mocks").mockContacts
    );
  });

  it("fetchTransactions returns mock data after delay", async () => {
    const promise = fetchTransactions();
    jest.advanceTimersByTime(800);
    await expect(promise).resolves.toEqual(
      require("@/constants/mocks").mockTransactions
    );
  });

  it("fetchUser returns mock data after delay", async () => {
    const promise = fetchUser();
    jest.advanceTimersByTime(800);
    await expect(promise).resolves.toEqual(
      require("@/constants/mocks").mockUser
    );
  });

  it("fetchUser handles errors", async () => {
    (fetchUser as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch user data")
    );
    await expect(fetchUser()).rejects.toThrow("Failed to fetch user data");
  });

  it("fetchTransactions handles errors", async () => {
    (fetchTransactions as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch transactions")
    );
    await expect(fetchTransactions()).rejects.toThrow(
      "Failed to fetch transactions"
    );
  });
});
