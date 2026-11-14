"use client";

import { RefreshCw, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useCustomerRewards } from "../hooks/use-customer-rewards";
import { ReferralBanner } from "./referral-banner";
import { RewardsStatsCards } from "./rewards-stats-cards";
import { RewardsTables } from "./rewards-tables";

export function CustomerRewardsView() {
  const { user } = useAuth();
  const { pointsData, couponsData, isLoading, error, refresh } = useCustomerRewards();

  return (
    <Card className="p-6 flex flex-col gap-6 rounded-none border-0 shadow-none bg-background">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Rewards & Referral</h2>
          <p className="text-sm text-muted-foreground">
            Manage your referral code, reward points, and discount coupons.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
          className="border-border text-foreground hover:bg-muted"
        >
          <RefreshCw className={`size-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ReferralBanner referralCode={user?.referralCode} />

      <RewardsStatsCards pointsData={pointsData} couponsData={couponsData} />

      <RewardsTables pointsData={pointsData} couponsData={couponsData} isLoading={isLoading} />
    </Card>
  );
}
