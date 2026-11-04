import { apiClient, HttpMethod } from "@/lib/api-client";
import type {
  ApiResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginResponseData,
  RegisterInput,
  ResendVerificationInput,
  ResetPasswordInput,
  User,
  VerifyEmailInput,
  VerifyResetPasswordInput,
  VerifyResetPasswordResponseData,
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

  /**
   * Verify email with 6-digit OTP code (POST /auth/verify-email)
   */
  async verifyEmail(input: VerifyEmailInput): Promise<ApiResponse<null>> {
    return apiClient<null>("/auth/verify-email", {
      method: HttpMethod.POST,
      body: JSON.stringify({
        email: input.email.trim(),
        otp: input.otp.trim(),
      }),
    });
  },

  /**
   * Resend fresh 6-digit verification code to email (POST /auth/resend-verification)
   */
  async resendVerification(input: ResendVerificationInput): Promise<ApiResponse<null>> {
    return apiClient<null>("/auth/resend-verification", {
      method: HttpMethod.POST,
      body: JSON.stringify({
        email: input.email.trim(),
      }),
    });
  },

  /**
   * Request 6-digit OTP code for password reset (POST /auth/forgot-password)
   */
  async forgotPassword(input: ForgotPasswordInput): Promise<ApiResponse<null>> {
    return apiClient<null>("/auth/forgot-password", {
      method: HttpMethod.POST,
      body: JSON.stringify({ email: input.email.trim() }),
    });
  },

  /**
   * Verify 6-digit OTP code for password reset and receive one-time reset token (POST /auth/verify-reset-password)
   */
  async verifyResetPassword(
    input: VerifyResetPasswordInput,
  ): Promise<ApiResponse<VerifyResetPasswordResponseData>> {
    return apiClient<VerifyResetPasswordResponseData>("/auth/verify-reset-password", {
      method: HttpMethod.POST,
      body: JSON.stringify({
        email: input.email.trim(),
        otp: input.otp.trim(),
      }),
    });
  },

  /**
   * Reset user password using one-time reset token (POST /auth/reset-password)
   */
  async resetPassword(input: ResetPasswordInput): Promise<ApiResponse<null>> {
    return apiClient<null>("/auth/reset-password", {
      method: HttpMethod.POST,
      body: JSON.stringify({
        resetToken: input.resetToken.trim(),
        password: input.password,
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
