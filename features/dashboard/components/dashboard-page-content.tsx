"use client";

import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import OverviewTab from "@/features/dashboard/components/overview-tab";
import ProjectsOrders from "@/features/dashboard/components/projects-orders";
import TotalAssets from "@/features/dashboard/components/total-assets";
import TotalSales from "@/features/dashboard/components/total-sales";
import TotalsAssets from "@/features/dashboard/components/totals-assets";
import { useOrganizerDashboard } from "@/features/dashboard/hooks/use-organizer-dashboard";

export default function DashboardPageContent() {
  const {
    summary,
    timeseries,
    transactions,
    granularity,
    setGranularity,
    selectedEventId,
    setSelectedEventId,
    isLoading,
    refresh,
    acceptTransaction,
    rejectTransaction,
  } = useOrganizerDashboard();

  return (
    <div className="flex flex-col gap-4">
      <OverviewTab
        summary={summary}
        selectedEventId={selectedEventId}
        onEventChange={setSelectedEventId}
        onRefresh={refresh}
        isLoading={isLoading}
      />

      <StyleAwareWrapper
        lyraClassName="grid grid-cols-12 p-px gap-px bg-border"
        defaultClassName="grid grid-cols-12 gap-4"
      >
        <div className="lg:col-span-7 col-span-12">
          <TotalSales
            timeseries={timeseries}
            granularity={granularity}
            onGranularityChange={setGranularity}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-5 col-span-12">
          <TotalAssets summary={summary} isLoading={isLoading} />
        </div>

        <StyleDivider wrapperClassName="col-span-12" />

        {/* Recent Transactions & Attendees Table (8 Cols) */}
        <div className="lg:col-span-8 col-span-12">
          <ProjectsOrders
            transactions={transactions}
            isLoading={isLoading}
            onAccept={acceptTransaction}
            onReject={rejectTransaction}
          />
        </div>

        {/* Status Distribution Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 col-span-12">
          <TotalsAssets transactions={transactions} isLoading={isLoading} />
        </div>
      </StyleAwareWrapper>
    </div>
  );
}
