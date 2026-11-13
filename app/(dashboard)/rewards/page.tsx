import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { CustomerRewardsView } from "@/features/rewards/components/customer-rewards-view";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Rewards & Referral - Ramein",
  description: "View and manage your referral points, coupons, and invitation link",
};

export default function RewardsPage() {
  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <BreadcrumbComp title="Rewards" />
      <StyleDivider />
      <CustomerRewardsView />
    </StyleAwareWrapper>
  );
}
