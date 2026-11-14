import BreadcrumbComp from "@/components/dashboard-layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { CustomerReviewsView } from "@/features/reviews/components/customer-reviews-view";

export default function ReviewsPage() {
  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <BreadcrumbComp title="Reviews" />
      <StyleDivider />
      <CustomerReviewsView />
    </StyleAwareWrapper>
  );
}
