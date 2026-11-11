import { useCallback, useEffect, useState } from "react";
import { organizerEventsApi } from "../api/events-api";
import type { EventAttendeesResponse, OrganizerEvent } from "../types";

export function useOrganizerEvents() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [attendeesData, setAttendeesData] = useState<EventAttendeesResponse | null>(null);
  const [isAttendeesLoading, setIsAttendeesLoading] = useState(false);
  const [attendeeSearch, setAttendeeSearch] = useState("");

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await organizerEventsApi.getEvents();
      if (res.data) {
        setEvents(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAttendees = useCallback(async (eventId: string, search?: string) => {
    setIsAttendeesLoading(true);
    try {
      const res = await organizerEventsApi.getEventAttendees(eventId, { search, limit: 50 });
      if (res.data) {
        setAttendeesData(res.data);
      }
    } catch (err: unknown) {
      console.error("Failed to load attendees:", err);
    } finally {
      setIsAttendeesLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await organizerEventsApi.getEvents();
        if (!ignore && res.data) {
          setEvents(res.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load events");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  const openAttendees = (eventId: string) => {
    setSelectedEventId(eventId);
    setAttendeeSearch("");
    void fetchAttendees(eventId);
  };

  const closeAttendees = () => {
    setSelectedEventId(null);
    setAttendeesData(null);
  };

  return {
    events,
    isLoading,
    error,
    refresh: fetchEvents,
    selectedEventId,
    attendeesData,
    isAttendeesLoading,
    attendeeSearch,
    setAttendeeSearch,
    openAttendees,
    closeAttendees,
    searchAttendees: (search: string) => {
      setAttendeeSearch(search);
      if (selectedEventId) {
        void fetchAttendees(selectedEventId, search);
      }
    },
  };
}
