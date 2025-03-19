import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function maskCardNumber(cardNumber: string) {
  const masked = cardNumber.replace(/\s+/g, "");

  return `${masked.slice(0, 4)} **** **** ${masked.slice(-4)}`;
}
