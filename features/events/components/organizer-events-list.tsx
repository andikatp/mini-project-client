"use client";

import { useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { EventStatsCards } from "./event-stats-cards";
import { EventSearchFilter } from "./event-search-filter";
import { OrganizerEventCard } from "./organizer-event-card";
import { EventAttendeesModal } from "./event-attendees-modal";
import { useOrganizerEvents } from "../hooks/use-organizer-events";

export function OrganizerEventsList() {
  const {
    events,
    isLoading,
    attendeesData,
    isAttendeesLoading,
    selectedEventId,
    attendeeSearch,
    openAttendees,
    closeAttendees,
    searchAttendees,
  } = useOrganizerEvents();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const counts = useMemo(() => {
    return {
      all: events.length,
      published: events.filter((e) => e.status === "PUBLISHED").length,
      completed: events.filter((e) => e.status === "COMPLETED").length,
    };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
      const term = search.toLowerCase().trim();
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        (event.city ? event.city.toLowerCase().includes(term) : false) ||
        (event.location ? event.location.toLowerCase().includes(term) : false);
      return matchesStatus && matchesSearch;
    });
  }, [events, statusFilter, search]);

  return (
    <div className="p-6 flex flex-col gap-6 rounded-none bg-background">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">My Events</h2>
          <p className="text-sm text-muted-foreground">
            Manage your organized events, check capacity, and track attendees.
          </p>
        </div>
      </div>

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
        <div className="py-16 text-center border border-dashed rounded-md bg-muted/10">
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
