"use client";

import { CardContent } from "@/components/ui/card";
import { DashboardCard } from "@/components/shared-dashboard-card";
import { Coins, Tag, Clock } from "lucide-react";
import type { PointsResponse, CouponsResponse } from "../types";

interface RewardsStatsCardsProps {
  pointsData: PointsResponse | null;
  couponsData: CouponsResponse | null;
}

export function RewardsStatsCards({ pointsData, couponsData }: RewardsStatsCardsProps) {
  const activeCoupons = couponsData?.coupons?.filter((c) => c.isUsable).length || 0;
  const totalPoints = pointsData?.totalPoints || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
      {/* 1. Active Points */}
      <DashboardCard className="py-6">
        <CardContent className="flex justify-between flex-row px-6">
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-normal text-muted-foreground">Active Points</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold">{totalPoints.toLocaleString("id-ID")}</h3>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </div>
              <div className="border border-border p-2.5 w-fit rounded-md text-amber-500">
                <Coins size={16} />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">1 point = Rp 1 ticket discount</div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* 2. Available Coupons */}
      <DashboardCard className="py-6">
        <CardContent className="flex justify-between flex-row px-6">
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-normal text-muted-foreground">Available Coupons</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold">{activeCoupons}</h3>
                  <span className="text-xs text-muted-foreground">coupons</span>
                </div>
              </div>
              <div className="border border-border p-2.5 w-fit rounded-md text-primary">
                <Tag size={16} />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">10% discount on next event</div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* 3. Validity */}
      <DashboardCard className="py-6">
        <CardContent className="flex justify-between flex-row px-6">
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-normal text-muted-foreground">Points Validity</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold">3 Months</h3>
                </div>
              </div>
              <div className="border border-border p-2.5 w-fit rounded-md text-blue-500">
                <Clock size={16} />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Valid from referral grant date</div>
          </div>
        </CardContent>
      </DashboardCard>
    </div>
  );
}
