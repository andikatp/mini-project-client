import BreadcrumbComp from "@/components/dashboard-layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { CustomerRewardsView } from "@/features/rewards/components/customer-rewards-view";

export default function RewardsPage() {
  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <BreadcrumbComp title="Rewards" />
      <StyleDivider />
      <CustomerRewardsView />
    </StyleAwareWrapper>
  );
}
