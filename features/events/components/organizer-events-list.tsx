"use client";

import { Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { useOrganizerEvents } from "../hooks/use-organizer-events";
import { EventAttendeesModal } from "./event-attendees-modal";
import { EventSearchFilter } from "./event-search-filter";
import { EventStatsCards } from "./event-stats-cards";
import { OrganizerEventCard } from "./organizer-event-card";

export function OrganizerEventsList() {
  const {
    events,
    isLoading,
    selectedEventId,
    attendeesData,
    isAttendeesLoading,
    attendeeSearch,
    openAttendees,
    closeAttendees,
    searchAttendees,
  } = useOrganizerEvents();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchSearch =
        ev.title.toLowerCase().includes(search.toLowerCase()) ||
        ev.location?.toLowerCase().includes(search.toLowerCase()) ||
        ev.city?.toLowerCase().includes(search.toLowerCase()) ||
        ev.category.name.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "ALL" || ev.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [events, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: events.length,
      published: events.filter((e) => e.status === "PUBLISHED").length,
      completed: events.filter((e) => e.status === "COMPLETED").length,
    };
  }, [events]);

  return (
    <div className="flex flex-col gap-6">
      <EventStatsCards
        counts={counts}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <EventSearchFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-2">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Loading your events...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-16 text-center border border-dashed rounded-xl bg-muted/10">
          <Calendar className="size-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <h4 className="text-sm font-semibold text-foreground">No events found</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {search ? "Try adjusting your search filter." : "You have not created any events yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => (
            <OrganizerEventCard key={event.id} event={event} onViewAttendees={openAttendees} />
          ))}
        </div>
      )}

      <EventAttendeesModal
        isOpen={Boolean(selectedEventId)}
        onClose={closeAttendees}
        data={attendeesData}
        isLoading={isAttendeesLoading}
        search={attendeeSearch}
        onSearchChange={searchAttendees}
      />
    </div>
  );
}
