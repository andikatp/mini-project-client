import type { ApiResponse } from "@/lib/api-client";
import { apiClient, HttpMethod } from "@/lib/api-client";
import type {
  DashboardTimeseriesPoint,
  Granularity,
  OrganizerDashboardSummary,
  OrganizerTransactionsResponse,
} from "../types";

export const organizerDashboardApi = {
  async getSummary(): Promise<ApiResponse<OrganizerDashboardSummary>> {
    return apiClient<OrganizerDashboardSummary>("/organizer/dashboard/summary", {
      method: HttpMethod.GET,
    });
  },

  async getTimeseries(
    granularity: Granularity = "month",
    eventId?: string,
  ): Promise<ApiResponse<DashboardTimeseriesPoint[]>> {
    const params = new URLSearchParams({ granularity });
    if (eventId) {
      params.append("eventId", eventId);
    }

    return apiClient<DashboardTimeseriesPoint[]>(
      `/organizer/dashboard/timeseries?${params.toString()}`,
      {
        method: HttpMethod.GET,
      },
    );
  },

  async getTransactions(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<OrganizerTransactionsResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));

    const qs = searchParams.toString();
    const endpoint = `/organizer/transactions${qs ? `?${qs}` : ""}`;

    return apiClient<OrganizerTransactionsResponse>(endpoint, {
      method: HttpMethod.GET,
    });
  },

  async acceptTransactionProof(transactionId: string): Promise<ApiResponse<unknown>> {
    return apiClient(`/organizer/transactions/${transactionId}/accept`, {
      method: HttpMethod.POST,
    });
  },

  async rejectTransactionProof(
    transactionId: string,
    reason: string,
  ): Promise<ApiResponse<unknown>> {
    return apiClient(`/organizer/transactions/${transactionId}/reject`, {
      method: HttpMethod.POST,
      body: JSON.stringify({ reason }),
    });
  },
};
