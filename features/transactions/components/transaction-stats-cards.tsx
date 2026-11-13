import { Ticket, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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
      count: transactions.length,
      icon: Ticket,
      color: "text-primary",
      activeBorder: "border-primary bg-primary/5",
    },
    {
      id: "WAITING_FOR_PAYMENT",
      title: "Needs Payment",
      count: waitingPayment,
      icon: Clock,
      color: "text-amber-500",
      activeBorder: "border-amber-500 bg-amber-500/5",
    },
    {
      id: "WAITING_FOR_ADMIN_CONFIRMATION",
      title: "Waiting Confirmation",
      count: waitingConfirm,
      icon: AlertCircle,
      color: "text-blue-500",
      activeBorder: "border-blue-500 bg-blue-500/5",
    },
    {
      id: "DONE",
      title: "Completed",
      count: done,
      icon: CheckCircle2,
      color: "text-emerald-500",
      activeBorder: "border-emerald-500 bg-emerald-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onFilterChange(c.id)}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
              isActive
                ? `${c.activeBorder} shadow-xs`
                : "bg-card border-border hover:border-border/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{c.title}</span>
              <Icon className={`size-4 ${c.color}`} />
            </div>
            <h3 className="text-2xl font-bold mt-2 text-foreground">{c.count}</h3>
          </button>
        );
      })}
    </div>
  );
}
