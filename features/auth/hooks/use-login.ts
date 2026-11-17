import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth-api";
import { useAuthStore } from "../context/auth-store";

export function useLogin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setErrorMsg(null);
      setSuccessMsg(null);

      if (!email.trim() || !password) {
        setErrorMsg("Harap masukkan email dan kata sandi Anda.");
        return false;
      }

      setIsLoading(true);

      try {
        const response = await authApi.login(email, password);
        const user = response.data?.user;

        if (user) {
          setSession(user);
        }

        setSuccessMsg("Berhasil masuk! Mengalihkan ke beranda...");

        const destination = user?.role === "EVENT_ORGANIZER" ? "/dashboard" : "/";
        void navigate(destination, { replace: true });

        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal masuk. Periksa kembali email dan kata sandi Anda.";

        if (
          message.toLowerCase().includes("verify your email") ||
          message.toLowerCase().includes("verifikasi email")
        ) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("registered_email", email.trim());
          }
          void navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
          return false;
        }

        setErrorMsg(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setSession],
  );

  const clearMessages = useCallback(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, []);

  return {
    login,
    isLoading,
    errorMsg,
    successMsg,
    clearMessages,
  };
}
