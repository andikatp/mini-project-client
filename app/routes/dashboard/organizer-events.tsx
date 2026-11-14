import BreadcrumbComp from "@/components/dashboard-layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { OrganizerEventsList } from "@/features/events/components/organizer-events-list";

export default function OrganizerEventsRoute() {
  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <BreadcrumbComp title="My Events" />
      <StyleDivider />
      <OrganizerEventsList />
    </StyleAwareWrapper>
  );
}
