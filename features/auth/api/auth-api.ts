import type {
  ApiResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginResponseData,
  RegisterInput,
  ResetPasswordInput,
  User,
  VerifyEmailInput,
} from "../types";

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    "https://mini-project-server-i490.onrender.com/api/v1";
  const url = `${baseUrl}${endpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data: ApiResponse<T> = await res.json().catch(() => ({
      status: "error" as const,
      message: res.statusText || "Terjadi kesalahan pada server",
    }));

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || `Request gagal dengan kode ${res.status}`);
    }

    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal terhubung ke server";
    throw new Error(message);
  }
}

export const authApi = {
  async register(input: RegisterInput): Promise<ApiResponse<User>> {
    return apiRequest<User>("/auth/register", {
      method: "POST",
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
    return apiRequest<LoginResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });
  },

  async logout(): Promise<ApiResponse<null>> {
    return apiRequest<null>("/auth/logout", {
      method: "POST",
    });
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return apiRequest<{ user: User }>("/auth/me", {
      method: "GET",
    });
  },

  async verifyEmail(input: VerifyEmailInput): Promise<ApiResponse<null>> {
    return apiRequest<null>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token: input.token.trim() }),
    });
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<ApiResponse<null>> {
    return apiRequest<null>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: input.email.trim() }),
    });
  },

  async resetPassword(input: ResetPasswordInput): Promise<ApiResponse<null>> {
    return apiRequest<null>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: input.token.trim(),
        password: input.password,
      }),
    });
  },

  async changePassword(input: ChangePasswordInput): Promise<ApiResponse<null>> {
    return apiRequest<null>("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify({
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      }),
    });
  },
};
