import type { ApiResponse } from "@/lib/api-client";
import { apiClient, HttpMethod } from "@/lib/api-client";
import type { PointsResponse, CouponsResponse } from "../types";

export const rewardsApi = {
  async getMyPoints(page = 1, limit = 50): Promise<ApiResponse<PointsResponse>> {
    return apiClient<PointsResponse>(`/rewards/points?page=${page}&limit=${limit}`, {
      method: HttpMethod.GET,
    });
  },

  async getMyCoupons(page = 1, limit = 50): Promise<ApiResponse<CouponsResponse>> {
    return apiClient<CouponsResponse>(`/rewards/coupons?page=${page}&limit=${limit}`, {
      method: HttpMethod.GET,
    });
  },
};
