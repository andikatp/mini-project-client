"use client";

import { DashboardCard } from "@/components/common/dashboard-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { DashboardTimeseriesPoint, Granularity } from "../types";

const chartConfig = {
  revenue: { label: "Revenue (IDR)", color: "var(--color-primary)" },
  tickets: { label: "Tickets Sold", color: "color-mix(in srgb, var(--primary) 50%, transparent)" },
} satisfies ChartConfig;

function useAnimatedNumber(target: number, duration = 400) {
  const [display, setDisplay] = useState(target);
  const currentRef = useRef(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const from = currentRef.current;
    const diff = target - from;
    if (diff === 0) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + diff * eased);
      currentRef.current = next;
      setDisplay(next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentRef.current = target;
        setDisplay(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

interface CustomTooltipProps {
  readonly active?: boolean;
  readonly payload?: {
    name?: string;
    value?: number;
    color?: string;
    dataKey?: string;
  }[];
  readonly label?: string;
}

function CustomTooltipContent({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry) => {
        const isRevenue = entry.dataKey === "revenue";
        const formatted = isRevenue
          ? `Rp ${(entry.value ?? 0).toLocaleString("id-ID")}`
          : `${entry.value ?? 0} tickets`;
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.dataKey === "revenue" ? "Revenue" : "Tickets"}:
            </span>
            <span className="font-semibold text-foreground ml-auto">{formatted}</span>
          </div>
        );
      })}
    </div>
  );
}

interface TotalSalesProps {
  timeseries: DashboardTimeseriesPoint[];
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
  isLoading?: boolean;
}

export default function TotalSales({
  timeseries,
  granularity,
  onGranularityChange,
  isLoading,
}: TotalSalesProps) {
  const chartData = timeseries.map((pt) => ({
    label: pt.label,
    revenue: pt.revenueIdr,
    tickets: pt.ticketsSold,
  }));

  const totalPeriodRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalPeriodTickets = chartData.reduce((acc, curr) => acc + curr.tickets, 0);

  const animatedRevenue = useAnimatedNumber(totalPeriodRevenue);
  const animatedTickets = useAnimatedNumber(totalPeriodTickets);

  return (
    <DashboardCard className="flex flex-col gap-0! pb-0!">
      <CardHeader className="border-b border-border flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold tracking-wide text-foreground">
            Sales & Revenue Analytics
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Time-based ticket revenue and sales volume
          </p>
        </div>
        <Select
          value={granularity}
          onValueChange={(val) => onGranularityChange(val as Granularity)}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day" className="text-xs">
              Daily
            </SelectItem>
            <SelectItem value="month" className="text-xs">
              Monthly
            </SelectItem>
            <SelectItem value="year" className="text-xs">
              Yearly
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? "..." : `Rp ${animatedRevenue.toLocaleString("id-ID")}`}
            </span>
            <span className="text-sm text-muted-foreground">
              ({isLoading ? "..." : animatedTickets.toLocaleString("id-ID")} tickets)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--primary) 50%, transparent)",
                }}
              />
              <span className="text-muted-foreground">Tickets Sold</span>
            </div>
          </div>
        </div>

        <div className="h-[240px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No sales data recorded for this period
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                />
                <YAxis
                  yAxisId="revenue"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickFormatter={(val) =>
                    val >= 1_000_000 ? `${(val / 1_000_000).toFixed(0)}M` : `${val}`
                  }
                />
                <YAxis
                  yAxisId="tickets"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  hide
                />
                <ChartTooltip content={<CustomTooltipContent />} />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--primary)" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  yAxisId="tickets"
                  type="monotone"
                  dataKey="tickets"
                  stroke="color-mix(in srgb, var(--primary) 50%, transparent)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
