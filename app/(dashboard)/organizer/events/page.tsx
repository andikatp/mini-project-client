import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import { OrganizerEventsList } from "@/features/events/components/organizer-events-list";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "My Events - Ramein",
  description: "Manage your organized events, check capacity, and track attendees",
};

export default function OrganizerEventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbComp title="My Events" />
      <OrganizerEventsList />
    </div>
  );
}
