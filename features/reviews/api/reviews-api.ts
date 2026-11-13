import type { ApiResponse } from "@/lib/api-client";
import { apiClient, HttpMethod } from "@/lib/api-client";
import type { CreateReviewPayload, EventReview } from "../types";

export const reviewsApi = {
  async submitReview(
    eventId: string,
    payload: CreateReviewPayload,
  ): Promise<ApiResponse<EventReview>> {
    return apiClient<EventReview>(`/events/${eventId}/reviews`, {
      method: HttpMethod.POST,
      body: JSON.stringify(payload),
    });
  },

  async getEventReviews(
    eventId: string,
  ): Promise<ApiResponse<{ averageRating: number; totalReviews: number; reviews: EventReview[] }>> {
    return apiClient(`/events/${eventId}/reviews`, {
      method: HttpMethod.GET,
    });
  },

  async getMyReviews(): Promise<ApiResponse<EventReview[]>> {
    return apiClient<EventReview[]>("/reviews/me", {
      method: HttpMethod.GET,
    });
  },

  async getOrganizerReviews(organizerId: string): Promise<ApiResponse<EventReview[]>> {
    return apiClient<EventReview[]>(`/organizers/${organizerId}/reviews`, {
      method: HttpMethod.GET,
    });
  },
};
