import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { CustomerReviewsView } from "@/features/reviews/components/customer-reviews-view";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "My Reviews - Ramein",
  description: "View and write reviews for attended events",
};

export default function ReviewsPage() {
  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <BreadcrumbComp title="Reviews" />
      <StyleDivider />
      <CustomerReviewsView />
    </StyleAwareWrapper>
  );
}
