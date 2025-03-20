import { render, screen } from "@testing-library/react";
import { TransactionItem } from "@/components/dashboard/transaction-item";
import type { Transaction } from "@/types";

describe("TransactionItem", () => {
  const depositTransaction: Transaction = {
    id: "1",
    title: "Deposit Paypal",
    date: "25 January 2021",
    amount: 2500,
    type: "deposit",
    icon: "paypal",
  };

  const withdrawalTransaction: Transaction = {
    id: "2",
    title: "Deposit from my Card",
    date: "28 January 2021",
    amount: -850,
    type: "withdrawal",
    icon: "credit-card",
  };

  it("renders transaction title correctly", () => {
    render(<TransactionItem transaction={depositTransaction} />);
    expect(screen.getByText("Deposit Paypal")).toBeInTheDocument();
  });

  it("renders transaction date correctly", () => {
    render(<TransactionItem transaction={depositTransaction} />);
    expect(screen.getByText("25 January 2021")).toBeInTheDocument();
  });

  it("renders positive amount with plus sign", () => {
    render(<TransactionItem transaction={depositTransaction} />);
    expect(screen.getByText("+$2,500")).toBeInTheDocument();
  });

  it("renders negative amount without plus sign", () => {
    render(<TransactionItem transaction={withdrawalTransaction} />);
    expect(screen.getByText("-$850")).toBeInTheDocument();
  });

  it("applies green text for positive amounts", () => {
    const { container } = render(
      <TransactionItem transaction={depositTransaction} />
    );
    const amountElement = screen.getByText("+$2,500");
    expect(amountElement).toHaveClass("text-green-600");
  });

  it("applies red text for negative amounts", () => {
    const { container } = render(
      <TransactionItem transaction={withdrawalTransaction} />
    );
    const amountElement = screen.getByText("-$850");
    expect(amountElement).toHaveClass("text-red-600");
  });

  it("renders correct icon for paypal transactions", () => {
    const { container } = render(
      <TransactionItem transaction={depositTransaction} />
    );
    expect(container.querySelector(".bg-blue-100")).toBeInTheDocument();
  });

  it("renders correct icon for credit card transactions", () => {
    const { container } = render(
      <TransactionItem transaction={withdrawalTransaction} />
    );
    expect(container.querySelector(".bg-yellow-100")).toBeInTheDocument();
  });
});
