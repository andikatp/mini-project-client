import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { CustomerTransactionsView } from "@/features/transactions/components/customer-transactions-view";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "My Transactions - Ramein",
  description: "View and manage your event bookings and payments",
};

export default function CustomerTransactionsPage() {
  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <BreadcrumbComp title="My Transactions" />
      <StyleDivider />
      <CustomerTransactionsView />
    </StyleAwareWrapper>
  );
}
