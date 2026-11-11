"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/features/auth/context/auth-store";
import { RefreshCcw } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { OrganizerDashboardSummary } from "../types";

interface OverviewTabProps {
  summary?: OrganizerDashboardSummary | null;
  selectedEventId?: string;
  onEventChange?: (eventId: string | undefined) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
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
  summary,
  selectedEventId,
  onEventChange,
  onRefresh,
  isLoading,
}: OverviewTabProps) {
  const user = useAuthStore((s) => s.user);
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

      <div className="flex items-center gap-2">
        {summary && summary.events.length > 0 && (
          <Select
            value={selectedEventId || "all"}
            onValueChange={(val) => onEventChange?.(val === "all" || !val ? undefined : val)}
          >
            <SelectTrigger className="w-[200px] h-9 text-xs">
              <SelectValue placeholder="All Events">
                {(val) => {
                  if (!val || val === "all") {
                    return `All Events (${summary.events.length})`;
                  }
                  const ev = summary.events.find((e) => e.id === val);
                  return ev ? ev.title : val;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="w-[280px]">
              <SelectItem value="all" className="text-xs">
                All Events ({summary.events.length})
              </SelectItem>
              {summary.events.map((ev) => (
                <SelectItem key={ev.id} value={ev.id} className="text-xs">
                  <span className="truncate block max-w-[230px]" title={ev.title}>
                    {ev.title}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {onRefresh && (
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-1.5 text-xs"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCcw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </Button>
        )}
      </div>
    </div>
  );
}
