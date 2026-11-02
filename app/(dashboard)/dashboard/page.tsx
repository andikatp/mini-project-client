import OverviewTab from "@/features/dashboard/components/overview-tab";
import ProjectsOrders from "@/features/dashboard/components/projects-orders";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import TotalAssets from "@/features/dashboard/components/total-assets";
import TotalSales from "@/features/dashboard/components/total-sales";
import TotalsAssets from "@/features/dashboard/components/totals-assets";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - EventMgmt",
  description: "Organizer & Customer event analytics dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Overview Filter Header */}
      <OverviewTab />

      <StyleAwareWrapper
        lyraClassName="grid grid-cols-12 p-px gap-px bg-border"
        defaultClassName="grid grid-cols-12 gap-4"
      >
        {/* Timeseries Revenue Chart (7 Cols) */}
        <div className="lg:col-span-7 col-span-12">
          <TotalSales />
        </div>

        {/* 4 Key Metrics (5 Cols) */}
        <div className="lg:col-span-5 col-span-12">
          <TotalAssets />
        </div>

        <StyleDivider wrapperClassName="col-span-12" />

        {/* Status Distribution Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 col-span-12">
          <TotalsAssets />
        </div>

        {/* Recent Transactions & Attendees Table (7 Cols) */}
        <div className="lg:col-span-7 col-span-12">
          <ProjectsOrders />
        </div>
      </StyleAwareWrapper>
    </div>
  );
}
