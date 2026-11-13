import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { OrganizerEventsList } from "@/features/events/components/organizer-events-list";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "My Events - Ramein",
  description: "Manage your organized events, check capacity, and track attendees",
};

export default function OrganizerEventsPage() {
  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <BreadcrumbComp title="My Events" />
      <StyleDivider />
      <OrganizerEventsList />
    </StyleAwareWrapper>
  );
}
