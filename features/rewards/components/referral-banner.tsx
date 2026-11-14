"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/shared-dashboard-card";
import { Button } from "@/components/ui/button";

interface ReferralBannerProps {
  referralCode?: string | null;
}

export function ReferralBanner({ referralCode }: ReferralBannerProps) {
  const [copied, setCopied] = useState(false);

  const code = referralCode || "RAMEIN-REF";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <DashboardCard className="py-6 border-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md border border-border text-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Refer a Friend Program
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Invite friends, get 10,000 points + discounts
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Share your unique referral code with friends. When they register, they get a discount
            coupon for their first event ticket, and you earn 10,000 reward points (valid for 3
            months)!
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-md bg-muted/40 border border-border w-full sm:w-auto shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Your Referral Code
            </span>
            <span className="font-mono text-base font-extrabold text-foreground tracking-wider">
              {code}
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-8 px-3 border-border hover:bg-background cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-600 mr-1.5" />
                <span className="text-xs text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 mr-1.5" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
