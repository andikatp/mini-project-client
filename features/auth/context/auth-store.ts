import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "../api/auth-api";
import type { User } from "../types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setSession: (user: User) => void;
  clearSession: () => void;
  fetchCurrentUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      setSession: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      clearSession: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const res = await authApi.getMe();
          const user = res.data?.user || null;
          if (user) {
            get().setSession(user);
            return user;
          }
          get().clearSession();
          return null;
        } catch {
          get().clearSession();
          return null;
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch {
          // ignore network failure on logout
        } finally {
          get().clearSession();
        }
      },
    }),
    {
      name: "eventmgmt_auth_session",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
    },
  ),
);
