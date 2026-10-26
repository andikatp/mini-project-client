import { describe, expect, it, beforeEach, afterEach } from "vite-plus/test";
import { authApi } from "@/features/auth/api/auth-api";

describe("authApi (Infrastructure / HTTP Layer)", () => {
  const originalFetch = globalThis.fetch;
  let lastFetchUrl = "";
  let lastFetchOptions: RequestInit | undefined;

  const getUrlString = (url: string | URL | Request): string => {
    if (typeof url === "string") return url;
    if ("url" in url) return url.url;
    return url.href;
  };

  const mockSuccessFetch = (responseData: unknown, status = 200) => {
    globalThis.fetch = (async (url: string | URL | Request, options?: RequestInit) => {
      lastFetchUrl = getUrlString(url);
      lastFetchOptions = options;
      return {
        ok: status >= 200 && status < 300,
        status,
        statusText: "OK",
        json: async () => responseData,
      } as Response;
    }) as typeof fetch;
  };

  const mockErrorFetch = (errorMessage: string, status = 400) => {
    globalThis.fetch = (async (url: string | URL | Request, options?: RequestInit) => {
      lastFetchUrl = getUrlString(url);
      lastFetchOptions = options;
      return {
        ok: false,
        status,
        statusText: "Bad Request",
        json: async () => ({
          status: "error",
          message: errorMessage,
        }),
      } as Response;
    }) as typeof fetch;
  };

  beforeEach(() => {
    lastFetchUrl = "";
    lastFetchOptions = undefined;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should send correct payload on login", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: "u1",
          email: "test@example.com",
          name: "Test User",
          role: "CUSTOMER",
        },
      },
    });

    const res = await authApi.login("test@example.com", "password123");

    expect(lastFetchUrl).toContain("/auth/login");
    expect(lastFetchOptions?.method).toBe("POST");
    expect(JSON.parse(lastFetchOptions?.body as string)).toEqual({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe("success");
    expect(res.data?.user.email).toBe("test@example.com");
  });

  it("should send correct payload on register with referral code", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Registration successful",
      data: {
        id: "u2",
        name: "New User",
        email: "new@example.com",
        role: "CUSTOMER",
      },
    });

    await authApi.register({
      name: "New User",
      email: "new@example.com",
      password: "secretpassword",
      role: "CUSTOMER",
      referralCode: "REF123",
    });

    expect(lastFetchUrl).toContain("/auth/register");
    expect(lastFetchOptions?.method).toBe("POST");
    expect(JSON.parse(lastFetchOptions?.body as string)).toEqual({
      name: "New User",
      email: "new@example.com",
      password: "secretpassword",
      role: "CUSTOMER",
      referralCode: "REF123",
    });
  });

  it("should omit referralCode in register payload when not provided", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Registration successful",
      data: {
        id: "u3",
        name: "Organizer Corp",
        email: "org@example.com",
        role: "EVENT_ORGANIZER",
      },
    });

    await authApi.register({
      name: "Organizer Corp",
      email: "org@example.com",
      password: "secretpassword",
      role: "EVENT_ORGANIZER",
    });

    const body = JSON.parse(lastFetchOptions?.body as string);
    expect(body.referralCode).toBeUndefined();
    expect(body.role).toBe("EVENT_ORGANIZER");
  });

  it("should send GET request for getMe", async () => {
    mockSuccessFetch({
      status: "success",
      data: {
        user: { id: "u1", email: "me@example.com", role: "CUSTOMER" },
      },
    });

    const res = await authApi.getMe();
    expect(lastFetchUrl).toContain("/auth/me");
    expect(lastFetchOptions?.method).toBe("GET");
    expect(res.data?.user.email).toBe("me@example.com");
  });

  it("should send POST request for logout", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Logged out",
    });

    await authApi.logout();
    expect(lastFetchUrl).toContain("/auth/logout");
    expect(lastFetchOptions?.method).toBe("POST");
  });

  it("should send correct payload for verifyEmail", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Email verified",
    });

    await authApi.verifyEmail({ token: "verify-token-xyz" });
    expect(lastFetchUrl).toContain("/auth/verify-email");
    expect(lastFetchOptions?.method).toBe("POST");
    expect(JSON.parse(lastFetchOptions?.body as string)).toEqual({
      token: "verify-token-xyz",
    });
  });

  it("should send correct payload for forgotPassword", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Reset link sent",
    });

    await authApi.forgotPassword({ email: "forgot@example.com" });
    expect(lastFetchUrl).toContain("/auth/forgot-password");
    expect(lastFetchOptions?.method).toBe("POST");
    expect(JSON.parse(lastFetchOptions?.body as string)).toEqual({
      email: "forgot@example.com",
    });
  });

  it("should send correct payload for resetPassword", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Password reset",
    });

    await authApi.resetPassword({
      token: "reset-tok",
      password: "new-super-password",
    });

    expect(lastFetchUrl).toContain("/auth/reset-password");
    expect(lastFetchOptions?.method).toBe("POST");
    expect(JSON.parse(lastFetchOptions?.body as string)).toEqual({
      token: "reset-tok",
      password: "new-super-password",
    });
  });

  it("should send PATCH request for changePassword", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Password updated",
    });

    await authApi.changePassword({
      currentPassword: "old-pwd",
      newPassword: "new-pwd",
    });

    expect(lastFetchUrl).toContain("/users/me/password");
    expect(lastFetchOptions?.method).toBe("PATCH");
    expect(JSON.parse(lastFetchOptions?.body as string)).toEqual({
      currentPassword: "old-pwd",
      newPassword: "new-pwd",
    });
  });

  it("should throw error message from server when request fails", async () => {
    mockErrorFetch("Email atau kata sandi salah.", 401);

    await expect(authApi.login("wrong@example.com", "wrongpwd")).rejects.toThrow(
      "Email atau kata sandi salah.",
    );
  });
});
