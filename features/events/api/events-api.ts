import type { ApiResponse } from "@/lib/api-client";
import { apiClient, HttpMethod } from "@/lib/api-client";
import type { EventAttendeesResponse, OrganizerEvent } from "../types";

export const organizerEventsApi = {
  async getEvents(): Promise<ApiResponse<OrganizerEvent[]>> {
    return apiClient<OrganizerEvent[]>("/organizer/events", {
      method: HttpMethod.GET,
    });
  },

  async getEventAttendees(
    eventId: string,
    params?: { page?: number; limit?: number; search?: string },
  ): Promise<ApiResponse<EventAttendeesResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.search) searchParams.append("search", params.search);

    const qs = searchParams.toString();
    const endpoint = `/organizer/events/${eventId}/attendees${qs ? `?${qs}` : ""}`;

    return apiClient<EventAttendeesResponse>(endpoint, {
      method: HttpMethod.GET,
    });
  },
};
