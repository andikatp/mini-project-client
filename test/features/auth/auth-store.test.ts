import { describe, expect, it, beforeEach, vi } from "vite-plus/test";
import { useAuthStore } from "@/features/auth/context/auth-store";
import { authApi } from "@/features/auth/api/auth-api";
import type { User } from "@/features/auth/types";

describe("useAuthStore (Zustand Session Store)", () => {
  const mockCustomerUser: User = {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    role: "CUSTOMER",
    isEmailVerified: true,
  };

  const mockOrganizerUser: User = {
    id: "org-456",
    name: "Festival Corp",
    email: "admin@festival.com",
    role: "EVENT_ORGANIZER",
    isEmailVerified: true,
  };

  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it("should have correct initial unauthenticated state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("should set session correctly for customer user", () => {
    useAuthStore.getState().setSession(mockCustomerUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockCustomerUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.role).toBe("CUSTOMER");
  });

  it("should set session correctly for organizer user", () => {
    useAuthStore.getState().setSession(mockOrganizerUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockOrganizerUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.role).toBe("EVENT_ORGANIZER");
  });

  it("should clear session on clearSession call", () => {
    useAuthStore.getState().setSession(mockCustomerUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().clearSession();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should fetch current user and update session on success", async () => {
    const spy = vi.spyOn(authApi, "getMe").mockImplementation(async () => ({
      status: "success",
      message: "User fetched",
      data: { user: mockCustomerUser },
    }));

    try {
      const user = await useAuthStore.getState().fetchCurrentUser();
      expect(user).toEqual(mockCustomerUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockCustomerUser);
    } finally {
      spy.mockRestore();
    }
  });

  it("should clear session if fetchCurrentUser fails", async () => {
    useAuthStore.getState().setSession(mockCustomerUser);

    const spy = vi.spyOn(authApi, "getMe").mockImplementation(async () => {
      throw new Error("Unauthorized");
    });

    try {
      const user = await useAuthStore.getState().fetchCurrentUser();
      expect(user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    } finally {
      spy.mockRestore();
    }
  });

  it("should clear session when logout is called", async () => {
    useAuthStore.getState().setSession(mockCustomerUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    const spy = vi.spyOn(authApi, "logout").mockImplementation(async () => ({
      status: "success",
      message: "Logged out",
    }));

    try {
      await useAuthStore.getState().logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    } finally {
      spy.mockRestore();
    }
  });
});
