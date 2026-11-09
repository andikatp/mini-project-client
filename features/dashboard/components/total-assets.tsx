"use client";

import { DashboardCard } from "@/components/common/dashboard-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CalendarCheck, Receipt, Ticket } from "lucide-react";
import type { OrganizerDashboardSummary } from "../types";

interface TotalAssetsProps {
  summary: OrganizerDashboardSummary | null;
  isLoading?: boolean;
}

function formatCurrency(amount: number) {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}K`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function TotalAssets({ summary, isLoading }: TotalAssetsProps) {
  const metrics = [
    {
      id: "Revenue",
      title: "Total Revenue",
      value: summary ? formatCurrency(summary.totalRevenueIdr) : "Rp 0",
      change: `${summary?.totalTransactionsCount ?? 0} paid`,
      icon: Banknote,
    },
    {
      id: "Tickets",
      title: "Tickets Sold",
      value: summary ? summary.totalTicketsSold.toLocaleString("id-ID") : "0",
      change: `${summary?.events.reduce((acc, ev) => acc + ev.totalCapacity, 0) ?? 0} cap`,
      icon: Ticket,
    },
    {
      id: "Transactions",
      title: "Transactions",
      value: summary ? summary.totalTransactionsCount.toLocaleString("id-ID") : "0",
      change: `${summary?.pendingConfirmationsCount ?? 0} review`,
      icon: Receipt,
    },
    {
      id: "Events",
      title: "Active Events",
      value: summary ? String(summary.activeEventsCount) : "0",
      change: `${summary?.totalEventsCount ?? 0} total`,
      icon: CalendarCheck,
    },
  ];

  return (
    <DashboardCard className="flex flex-col gap-0! pb-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-sm font-semibold tracking-wide text-foreground">
          Key Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full! px-0!">
        <div className="grid grid-cols-2 h-full! gap-px bg-border">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex flex-col justify-between p-5 bg-background">
                <div className="flex items-center justify-between">
                  <div className="border border-border rounded-lg p-2 bg-muted/30">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    {item.change}
                  </span>
                </div>
                <div className="mt-3">
                  <h6 className="text-xl font-bold tracking-tight text-foreground">
                    {isLoading ? "..." : item.value}
                  </h6>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
