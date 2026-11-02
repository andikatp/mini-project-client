"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/features/auth/context/auth-store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, RefreshCcw, Download } from "lucide-react";

export type TimeGrouping = "day" | "month" | "year";

interface OverviewTabProps {
  readonly grouping?: TimeGrouping;
  readonly onGroupingChange?: (grouping: TimeGrouping) => void;
  readonly onRefresh?: () => void;
}

const emptySubscribe = () => () => {};

function getGreetingText() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

export default function OverviewTab({
  grouping = "month",
  onGroupingChange,
  onRefresh,
}: OverviewTabProps) {
  const user = useAuthStore((s) => s.user);

  // Safely resolve greeting on client without triggering unstable prerender warning
  const greeting = useSyncExternalStore(emptySubscribe, getGreetingText, () => "Welcome");

  return (
    <div className="flex items-center flex-wrap lg:flex-nowrap lg:gap-0 gap-4 justify-between">
      <div className="flex flex-col items-start">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {greeting}, {user?.name ?? "Organizer"} 👋
        </h2>
        <p className="text-sm font-normal text-muted-foreground">
          Overview of your event tickets, revenue, and transaction analytics
        </p>
      </div>

      <div className="flex items-center lg:flex-nowrap flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="p-2.5 h-auto rounded-lg cursor-pointer hover:bg-muted/50"
          title="Refresh Data"
        >
          <RefreshCcw size={16} />
        </Button>

        <Select value={grouping} onValueChange={(val) => onGroupingChange?.(val as TimeGrouping)}>
          <SelectTrigger className="w-fit h-auto! text-foreground cursor-pointer gap-2">
            <CalendarDays size={16} />
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day" className="cursor-pointer">
              Daily Grouping
            </SelectItem>
            <SelectItem value="month" className="cursor-pointer">
              Monthly Grouping
            </SelectItem>
            <SelectItem value="year" className="cursor-pointer">
              Yearly Grouping
            </SelectItem>
          </SelectContent>
        </Select>

        <Button className="flex items-center gap-1.5 h-auto px-4 py-2 rounded-lg cursor-pointer">
          <Download size={16} />
          <span className="text-sm font-medium">Export Report</span>
        </Button>
      </div>
    </div>
  );
}
