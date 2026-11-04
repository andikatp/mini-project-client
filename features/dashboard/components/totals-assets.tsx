"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/common/dashboard-card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

// Sesuai PRD Bagian 5: 6 status transaksi
const statusDistribution = [
  { name: "DONE", count: 280, color: "#10b981", label: "Done" },
  {
    name: "WAITING_FOR_ADMIN_CONFIRMATION",
    count: 45,
    color: "#3b82f6",
    label: "Waiting Organizer",
  },
  { name: "WAITING_FOR_PAYMENT", count: 32, color: "#f59e0b", label: "Waiting Payment" },
  { name: "REJECTED", count: 18, color: "#ef4444", label: "Rejected" },
  { name: "EXPIRED", count: 22, color: "#9ca3af", label: "Expired" },
  { name: "CANCELED", count: 15, color: "#6b7280", label: "Canceled" },
];

export default function TotalsAssets() {
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
        {/* Pie Chart */}
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
            <span className="text-xl font-bold text-foreground">{total}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Total Trx</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          {statusDistribution.map((item) => {
            const percentage = ((item.count / total) * 100).toFixed(0);
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
