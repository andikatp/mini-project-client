import BreadcrumbComp from "@/components/dashboard-layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { CustomerTransactionsView } from "@/features/transactions/components/customer-transactions-view";

export default function TransactionsRoute() {
  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <BreadcrumbComp title="My Transactions" />
      <StyleDivider />
      <CustomerTransactionsView />
    </StyleAwareWrapper>
  );
}
