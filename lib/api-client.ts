import { API_BASE_URL } from "@/constants";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
}

export interface ApiClientOptions extends Omit<RequestInit, "method"> {
  method?: HttpMethod | `${HttpMethod}`;
  /**
   * Number of retry attempts on network failures or timeouts (default: 1).
   */
  retries?: number;
  /**
   * Request timeout in milliseconds (default: 15000ms).
   */
  timeoutMs?: number;
}

/**
 * Unified HTTP client for API requests.
 * Features:
 * - Automatic base URL configuration
 * - Automatic JSON content-type (unless FormData) & credentials: "include" for HttpOnly session cookie
 * - Auto-handling for 401 Unauthorized (session cleanup & redirect to /login)
 * - Auto-retry mechanism for transient network dropouts / cold-start timeouts
 * - Request timeout via AbortController
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<ApiResponse<T>> {
  const { retries = 1, timeoutMs = 15000, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let attempt = 0;
  while (attempt <= retries) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data: ApiResponse<T> = await res.json().catch(() => ({
        status: "error" as const,
        message: res.statusText || "Terjadi kesalahan pada server",
      }));

      // Handle 401 Unauthorized (expired or invalid session cookie)
      if (res.status === 401) {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register") &&
          !window.location.pathname.startsWith("/verify-email") &&
          !window.location.pathname.startsWith("/forgot-password") &&
          !window.location.pathname.startsWith("/reset-password")
        ) {
          localStorage.removeItem("eventmgmt_auth_session");
          window.location.href = "/login";
        }
        throw new Error(data.message || "Sesi Anda telah berakhir. Silakan masuk kembali.");
      }

      if (!res.ok || data.status === "error") {
        throw new Error(data.message || `Request gagal dengan status ${res.status}`);
      }

      return data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      const isTimeout = err instanceof DOMException && err.name === "AbortError";
      const isNetworkError = err instanceof TypeError; 

      // Retry only on transient network failures or timeouts
      if ((isTimeout || isNetworkError) && attempt <= retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      if (err instanceof Error) {
        throw err;
      }
      throw new Error("Gagal terhubung ke server");
    }
  }

  throw new Error("Gagal terhubung ke server setelah beberapa percobaan.");
}
