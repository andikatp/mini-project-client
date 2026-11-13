"use client";

import { FilterableStatGrid, type FilterStatCardItem } from "@/components/shared-stat-filter-grid";
import { AlertCircle, CheckCircle2, Clock, Ticket } from "lucide-react";
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

  const cards: FilterStatCardItem[] = [
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
    <FilterableStatGrid
      items={cards}
      activeId={activeFilter}
      onSelect={onFilterChange}
      columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}
