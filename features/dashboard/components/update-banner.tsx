"use client";

import { DashboardCard } from "@/components/common/dashboard-card";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ArrowRight, Ticket } from "lucide-react";
import Link from "next/link";

export default function UpdateBanner() {
  return (
    <DashboardCard className="py-3 bg-primary/5 border-primary/20">
      <CardContent className="flex items-center flex-wrap justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute inline-flex" />
            <span className="h-2 w-2 rounded-full bg-emerald-500 relative inline-flex" />
            <p className="text-sm font-semibold text-foreground">Live Activity</p>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <p className="text-sm font-normal text-muted-foreground">
              Tickets sold increased <span className="text-emerald-600 font-semibold">+24%</span>{" "}
              compared to previous period
            </p>
          </div>
        </div>

        <Link href="/organizer/events">
          <Button
            variant="outline"
            className="flex items-center gap-1.5 px-4 py-2 h-auto rounded-md cursor-pointer text-xs font-medium"
          >
            <Ticket size={14} />
            Manage My Events
            <ArrowRight size={14} />
          </Button>
        </Link>
      </CardContent>
    </DashboardCard>
  );
}
