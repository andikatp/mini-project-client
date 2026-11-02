"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/common/dashboard-card";
import { Banknote, Ticket, Receipt, CalendarCheck } from "lucide-react";

const metrics = [
  {
    id: "Revenue",
    title: "Total Revenue",
    value: "Rp 86.9M",
    change: "+18.2%",
    icon: Banknote,
  },
  {
    id: "Tickets",
    title: "Tickets Sold",
    value: "570",
    change: "+24.5%",
    icon: Ticket,
  },
  {
    id: "Transactions",
    title: "Transactions",
    value: "412",
    change: "+12.0%",
    icon: Receipt,
  },
  {
    id: "Events",
    title: "Active Events",
    value: "6",
    change: "2 upcoming",
    icon: CalendarCheck,
  },
];

export default function TotalAssets() {
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
              <div
                key={item.id}
                className="flex flex-col justify-between p-5 bg-background"
              >
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
                    {item.value}
                  </h6>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
