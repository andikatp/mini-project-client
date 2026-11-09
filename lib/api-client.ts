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

function handleUnauthorized(message?: string): never {
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.startsWith("/login") &&
    !window.location.pathname.startsWith("/register") &&
    !window.location.pathname.startsWith("/verify-email") &&
    !window.location.pathname.startsWith("/forgot-password") &&
    !window.location.pathname.startsWith("/reset-password")
  ) {
    localStorage.removeItem("ramein_auth_session");
    window.location.href = "/login";
  }
  throw new Error(message || "Sesi Anda telah berakhir. Silakan masuk kembali.");
}

async function executeFetch<T>(
  url: string,
  fetchOptions: RequestInit,
  timeoutMs: number,
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      credentials: "include",
      signal: controller.signal,
    });

    const data: ApiResponse<T> = await res.json().catch(() => ({
      status: "error" as const,
      message: res.statusText || "Terjadi kesalahan pada server",
    }));

    if (res.status === 401) {
      handleUnauthorized(data.message);
    }

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || `Request gagal dengan status ${res.status}`);
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRetryableError(err: unknown): boolean {
  return (err instanceof DOMException && err.name === "AbortError") || err instanceof TypeError;
}

/**
 * Unified HTTP client for API requests.
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

  fetchOptions.headers = headers;

  const runWithRetry = async (attempt: number): Promise<ApiResponse<T>> => {
    try {
      return await executeFetch<T>(url, fetchOptions, timeoutMs);
    } catch (err: unknown) {
      if (isRetryableError(err) && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        return runWithRetry(attempt + 1);
      }

      if (err instanceof Error) {
        throw err;
      }
      throw new Error("Gagal terhubung ke server");
    }
  };

  return runWithRetry(0);
}
