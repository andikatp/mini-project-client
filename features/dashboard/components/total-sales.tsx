"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/common/dashboard-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Timeseries dummy data reflecting event ticket sales and revenue
const timeseriesData: Record<string, { label: string; revenue: number; tickets: number }[]> = {
  day: [
    { label: "00:00", revenue: 450000, tickets: 3 },
    { label: "04:00", revenue: 150000, tickets: 1 },
    { label: "08:00", revenue: 1200000, tickets: 8 },
    { label: "12:00", revenue: 3500000, tickets: 22 },
    { label: "16:00", revenue: 4200000, tickets: 28 },
    { label: "20:00", revenue: 2900000, tickets: 19 },
    { label: "23:59", revenue: 1100000, tickets: 7 },
  ],
  month: [
    { label: "Week 1", revenue: 12500000, tickets: 82 },
    { label: "Week 2", revenue: 18400000, tickets: 120 },
    { label: "Week 3", revenue: 24200000, tickets: 158 },
    { label: "Week 4", revenue: 31800000, tickets: 210 },
  ],
  year: [
    { label: "Jan", revenue: 15000000, tickets: 98 },
    { label: "Feb", revenue: 22000000, tickets: 145 },
    { label: "Mar", revenue: 28000000, tickets: 180 },
    { label: "Apr", revenue: 35000000, tickets: 230 },
    { label: "May", revenue: 42000000, tickets: 275 },
    { label: "Jun", revenue: 38000000, tickets: 250 },
    { label: "Jul", revenue: 49000000, tickets: 320 },
    { label: "Aug", revenue: 53000000, tickets: 350 },
    { label: "Sep", revenue: 61000000, tickets: 400 },
    { label: "Oct", revenue: 58000000, tickets: 380 },
    { label: "Nov", revenue: 67000000, tickets: 440 },
    { label: "Dec", revenue: 75000000, tickets: 500 },
  ],
};

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
    <div className="grid min-w-36 items-start gap-1.5 rounded-lg border border-border bg-background p-2.5 text-xs shadow-lg">
      <div className="font-semibold text-foreground">{label}</div>
      <div className="grid gap-1">
        {payload.map((item) => {
          const isRevenue = item.dataKey === "revenue";
          const formatted = isRevenue
            ? `Rp ${(item.value ?? 0).toLocaleString("id-ID")}`
            : `${item.value} tiket`;
          const itemKey = `${item.dataKey ?? item.name ?? "val"}`;
          return (
            <div key={itemKey} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{isRevenue ? "Revenue" : "Tickets"}</span>
              <span className="font-semibold text-foreground">{formatted}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TotalSales() {
  const [grouping, setGrouping] = useState<"day" | "month" | "year">("month");
  const chartData = timeseriesData[grouping];

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalTickets = chartData.reduce((acc, curr) => acc + curr.tickets, 0);
  const animatedRevenue = useAnimatedNumber(totalRevenue);

  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span>Revenue & Ticket Timeseries</span>
          </div>
          <Select
            value={grouping}
            onValueChange={(v) => v && setGrouping(v as "day" | "month" | "year")}
          >
            <SelectTrigger className="h-8! w-fit text-xs font-medium cursor-pointer gap-1 px-2.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day" className="cursor-pointer text-xs">
                Hourly (Today)
              </SelectItem>
              <SelectItem value="month" className="cursor-pointer text-xs">
                Weekly (This Month)
              </SelectItem>
              <SelectItem value="year" className="cursor-pointer text-xs">
                Monthly (This Year)
              </SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
              Total Revenue
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Rp {animatedRevenue.toLocaleString("id-ID")}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                +18.4%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
              Tickets Sold
            </span>
            <span className="text-lg font-bold text-foreground">
              {totalTickets.toLocaleString("id-ID")} tickets
            </span>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[230px]! w-full">
          <LineChart data={chartData} margin={{ top: 8, right: 10, bottom: 0, left: 10 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
            />
            <ChartTooltip content={<CustomTooltipContent />} />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-primary)" }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </DashboardCard>
  );
}
