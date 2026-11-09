"use client";

import { DashboardCard } from "@/components/common/dashboard-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { OrganizerTransaction } from "../types";

interface TotalsAssetsProps {
  transactions: OrganizerTransaction[];
  isLoading?: boolean;
}

const statusColorMap: Record<string, { label: string; color: string }> = {
  DONE: { label: "Done", color: "#10b981" },
  WAITING_FOR_ADMIN_CONFIRMATION: {
    label: "Waiting Organizer",
    color: "#3b82f6",
  },
  WAITING_FOR_PAYMENT: { label: "Waiting Payment", color: "#f59e0b" },
  REJECTED: { label: "Rejected", color: "#ef4444" },
  EXPIRED: { label: "Expired", color: "#9ca3af" },
  CANCELED: { label: "Canceled", color: "#6b7280" },
};

export default function TotalsAssets({ transactions, isLoading }: TotalsAssetsProps) {
  const counts: Record<string, number> = {
    DONE: 0,
    WAITING_FOR_ADMIN_CONFIRMATION: 0,
    WAITING_FOR_PAYMENT: 0,
    REJECTED: 0,
    EXPIRED: 0,
    CANCELED: 0,
  };

  for (const tx of transactions) {
    if (counts[tx.status] !== undefined) {
      counts[tx.status] += 1;
    }
  }

  const statusDistribution = Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    label: statusColorMap[name]?.label ?? name,
    color: statusColorMap[name]?.color ?? "#6b7280",
  }));

  const total = statusDistribution.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <PieIcon size={16} className="text-primary" />
          <span>Transaction Status Distribution</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 flex flex-col gap-4">
        <div className="h-44 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="count"
              >
                {statusDistribution.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-foreground">{isLoading ? "..." : total}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Total Trx</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          {statusDistribution.map((item) => {
            const percentage = total > 0 ? ((item.count / total) * 100).toFixed(0) : "0";
            return (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground truncate">{item.label}</span>
                </div>
                <span className="font-semibold text-foreground shrink-0">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
