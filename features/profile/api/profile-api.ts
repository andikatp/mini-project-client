import type { ApiResponse } from "@/lib/api-client";
import { apiClient, HttpMethod } from "@/lib/api-client";
import type { UpdateProfileInput, UploadImageResponse, UserProfile } from "../types";

export const profileApi = {
  async getUserProfile(): Promise<ApiResponse<{ user: UserProfile }>> {
    return apiClient<{ user: UserProfile }>("/users/me", {
      method: HttpMethod.GET,
    });
  },

  async updateProfile(input: UpdateProfileInput): Promise<ApiResponse<{ user: UserProfile }>> {
    return apiClient<{ user: UserProfile }>("/users/me", {
      method: HttpMethod.PATCH,
      body: JSON.stringify(input),
    });
  },

  async uploadImage(
    file: File,
    folder = "mini-project/avatars",
  ): Promise<ApiResponse<UploadImageResponse>> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    return apiClient<UploadImageResponse>("/upload/image", {
      method: HttpMethod.POST,
      body: formData,
    });
  },
};
