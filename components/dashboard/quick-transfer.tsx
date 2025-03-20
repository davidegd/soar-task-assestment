"use client";

import { useState } from "react";
import { ChevronRight, Send, User2Icon } from "lucide-react";
import type { Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

interface QuickTransferProps {
  contacts: Contact[];
  className?: string;
}

export function QuickTransfer({ contacts, className }: QuickTransferProps) {
  const { transferMoney } = useApp();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = async () => {
    if (!selectedContact || !amount || isNaN(Number.parseFloat(amount))) return;

    setIsLoading(true);
    try {
      await transferMoney(selectedContact, Number.parseFloat(amount));
      setAmount("");
      setSelectedContact(null);
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex h-64 flex-col justify-center", className)}>
      <div className="flex items-center justify-between gap-4 overflow-x-auto">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex flex-col items-center">
            <button
              onClick={() => setSelectedContact(contact.id)}
              className={`relative mb-2 h-16 w-16 overflow-hidden rounded-full border-2 bg-mainBackground transition-all md:h-20 md:w-20 ${
                selectedContact === contact.id
                  ? "border-primary"
                  : "border-transparent hover:border-gray-100"
              }`}
            >
              <div className="flex items-center">
                <User2Icon className="mx-auto h-8 w-8 text-foreground" />
              </div>
            </button>
            <div className="text-center text-sm font-medium">{contact.name}</div>
            <div className="text-xs text-muted-foreground">{contact.role}</div>
          </div>
        ))}
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">More</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Write Amount</span>
        <Input
          type="text"
          placeholder="123.50"
          value={amount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, "");
            setAmount(value);
          }}
          className="-mr-8 h-12 flex-1 rounded-bl-full rounded-tl-full bg-mainBackground px-6 py-2 focus-visible:border-none focus-visible:ring-0"
        />
        <Button
          onClick={handleTransfer}
          disabled={!selectedContact || !amount || isLoading}
          className="h-12 gap-2 rounded-full disabled:bg-gray-500 disabled:opacity-100 md:w-32"
        >
          Send
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
