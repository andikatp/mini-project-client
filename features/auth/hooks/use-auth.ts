import { useAuthStore } from "../context/auth-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    setSession,
    clearSession,
    fetchCurrentUser,
    logout,
  };
}
