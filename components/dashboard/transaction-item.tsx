import { CreditCard, User, DollarSign, BanknoteIcon } from "lucide-react";
import type { Transaction } from "@/types";

type TransactionIcon = "credit-card" | "paypal" | "user" | "default";
import { cn, formatAmount } from "@/lib/utils";
import { ReactElement, memo } from "react";

interface TransactionItemProps {
  transaction: Transaction;
  className?: string;
}

const TransactionItem = memo(({ transaction, className }: TransactionItemProps) => {
  const isPositive = transaction.amount > 0;

  const IconByTransaction: Record<TransactionIcon, ReactElement> = {
    "credit-card": <CreditCard className="h-5 w-5 text-yellow-600" />,
    paypal: <BanknoteIcon className="text-blue-600" />,
    user: <User className="h-5 w-5 text-green-600" />,
    default: <DollarSign className="h-5 w-5 text-gray-600" />,
  };

  const BgByTransaction: Record<TransactionIcon, string> = {
    "credit-card": "bg-yellow-100",
    paypal: "bg-blue-100",
    user: "bg-green-100",
    default: "bg-gray-100",
  };

  return (
    <div className={cn("flex items-center gap-3 py-3", className)}>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          BgByTransaction[transaction.icon as TransactionIcon]
        }`}
      >
        {IconByTransaction[transaction.icon as TransactionIcon]}
      </div>
      <div className="flex-1">
        <div className="font-medium">{transaction.title}</div>
        <div className="text-sm text-muted-foreground">{transaction.date}</div>
      </div>
      <div className={cn("font-medium", isPositive ? "text-green-600" : "text-red-600")}>
        {isPositive ? "+" : ""}
        {formatAmount(transaction.amount)}
      </div>
    </div>
  );
});

TransactionItem.displayName = "TransactionItem";

export { TransactionItem };
