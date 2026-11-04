import { apiClient, HttpMethod } from "@/lib/api-client";
import type {
  ApiResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginResponseData,
  RegisterInput,
  ResetPasswordInput,
  User,
  VerifyEmailInput,
  VerifyResetPasswordInput,
  VerifyResetPasswordResponseData
} from "../types";

export const authApi = {
  async register(input: RegisterInput): Promise<ApiResponse<User>> {
    return apiClient<User>("/auth/register", {
      method: HttpMethod.POST,
      body: JSON.stringify({
        email: input.email.trim(),
        password: input.password,
        name: input.name.trim(),
        role: input.role,
        ...(input.referralCode ? { referralCode: input.referralCode.trim() } : {}),
      }),
    });
  },

  async login(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
    return apiClient<LoginResponseData>("/auth/login", {
      method: HttpMethod.POST,
      body: JSON.stringify({ email: email.trim(), password }),
    });
  },

  async logout(): Promise<ApiResponse<null>> {
    return apiClient<null>("/auth/logout", {
      method: HttpMethod.POST,
    });
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return apiClient<{ user: User }>("/auth/me", {
      method: HttpMethod.GET,
    });
  },

  async verifyEmail(input: VerifyEmailInput): Promise<ApiResponse<null>> {
    return apiClient<null>("/auth/verify-email", {
      method: HttpMethod.POST,
      body: JSON.stringify({ token: input.token.trim() }),
    });
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<ApiResponse<null>> {
    return apiClient<null>("/auth/forgot-password", {
      method: HttpMethod.POST,
      body: JSON.stringify({ email: input.email.trim() }),
    });
  },

  async verifyResetPassword(
    input: VerifyResetPasswordInput,
  ): Promise<ApiResponse<VerifyResetPasswordResponseData>> {
    return apiRequest<VerifyResetPasswordResponseData>("/auth/verify-reset-password", {
      method: "POST",
      body: JSON.stringify({
        email: input.email.trim(),
        otp: input.otp.trim(),
      }),
    });
  },

  async resetPassword(input: ResetPasswordInput): Promise<ApiResponse<null>> {
    return apiClient<null>("/auth/reset-password", {
      method: HttpMethod.POST,
      body: JSON.stringify({
        password: input.password,
        ...(input.resetToken ? { resetToken: input.resetToken } : {}),
        ...(input.email ? { email: input.email.trim() } : {}),
        ...(input.otp ? { otp: input.otp.trim() } : {}),
      }),
    });
  },

  async changePassword(input: ChangePasswordInput): Promise<ApiResponse<null>> {
    return apiClient<null>("/users/me/password", {
      method: HttpMethod.PATCH,
      body: JSON.stringify({
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      }),
    });
  },
};
