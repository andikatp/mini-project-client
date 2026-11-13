import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import { CustomerTransactionsView } from "@/features/transactions/components/customer-transactions-view";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "My Transactions - Ramein",
  description: "View and manage your event bookings and payments",
};

export default function CustomerTransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbComp title="My Transactions" />
      <CustomerTransactionsView />
    </div>
  );
}
