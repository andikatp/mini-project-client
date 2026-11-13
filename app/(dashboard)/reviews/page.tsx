import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import { CustomerReviewsView } from "@/features/reviews/components/customer-reviews-view";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "My Reviews - Ramein",
  description: "View and write reviews for attended events",
};

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbComp title="Reviews" />
      <CustomerReviewsView />
    </div>
  );
}
