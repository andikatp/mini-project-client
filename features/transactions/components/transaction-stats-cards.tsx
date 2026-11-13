"use client";

import { CardContent } from "@/components/ui/card";
import { DashboardCard } from "@/components/shared-dashboard-card";
import { Ticket, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import type { CustomerTransaction } from "../types";

interface TransactionStatsCardsProps {
  transactions: CustomerTransaction[];
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

export function TransactionStatsCards({
  transactions,
  activeFilter,
  onFilterChange,
}: TransactionStatsCardsProps) {
  const waitingPayment = transactions.filter((t) => t.status === "WAITING_FOR_PAYMENT").length;
  const waitingConfirm = transactions.filter(
    (t) => t.status === "WAITING_FOR_ADMIN_CONFIRMATION",
  ).length;
  const done = transactions.filter((t) => t.status === "DONE").length;

  const cards = [
    {
      id: "ALL",
      title: "All Orders",
      value: transactions.length,
      icon: Ticket,
      desc: "Total tickets ordered",
    },
    {
      id: "WAITING_FOR_PAYMENT",
      title: "Pending Payment",
      value: waitingPayment,
      icon: Clock,
      desc: "Needs payment proof",
    },
    {
      id: "WAITING_FOR_ADMIN_CONFIRMATION",
      title: "Waiting Review",
      value: waitingConfirm,
      icon: AlertCircle,
      desc: "Organizer reviewing proof",
    },
    {
      id: "DONE",
      title: "Completed",
      value: done,
      icon: CheckCircle2,
      desc: "Confirmed and ready",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeFilter === c.id;

        return (
          <button
            key={c.id}
            type="button"
            aria-label={`Filter by ${c.title}`}
            onClick={() => onFilterChange(c.id)}
            className={`text-left cursor-pointer transition-colors relative bg-background ${
              isActive
                ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                : "hover:bg-muted/30"
            }`}
          >
            <DashboardCard className="py-6 bg-transparent">
              <CardContent className="flex justify-between flex-row px-6">
                <div className="flex flex-col items-start gap-4 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-normal text-muted-foreground">{c.title}</p>
                      <h3 className="text-2xl font-semibold text-foreground">{c.value}</h3>
                    </div>
                    <div className="border border-border p-2.5 w-fit rounded-md text-foreground">
                      <Icon size={16} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
              </CardContent>
            </DashboardCard>
          </button>
        );
      })}
    </div>
  );
}
