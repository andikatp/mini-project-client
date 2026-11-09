import DashboardPageContent from "@/features/dashboard/components/dashboard-page-content";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard - Ramein",
  description: "Organizer & Customer event analytics dashboard",
};

export default function DashboardPage() {
  return <DashboardPageContent />;
}
