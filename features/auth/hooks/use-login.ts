import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth-api";
import { useAuthStore } from "../context/auth-store";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
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

      const role = user?.role;
      setTimeout(() => {
        if (role === "EVENT_ORGANIZER") {
          router.push("/organizer/dashboard");
        } else {
          router.push("/");
        }
      }, 1000);

      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal masuk. Periksa kembali email dan kata sandi Anda.";
      setErrorMsg(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return {
    login,
    isLoading,
    errorMsg,
    successMsg,
    clearMessages,
  };
}
