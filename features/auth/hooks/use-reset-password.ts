import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth-api";
import type { ResetPasswordInput } from "../types";

export function useResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetPassword = async (input: ResetPasswordInput) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!input.token.trim()) {
      setErrorMsg("Token pemulihan kata sandi tidak ditemukan atau tidak valid.");
      return false;
    }

    if (!input.password || input.password.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter.");
      return false;
    }

    if (input.confirmPassword && input.password !== input.confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi baru tidak sesuai.");
      return false;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword(input);

      setSuccessMsg(
        response.message || "Kata sandi berhasil diatur ulang! Mengalihkan ke halaman masuk...",
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);

      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengatur ulang kata sandi. Tautan mungkin telah kedaluwarsa.";
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
    resetPassword,
    isLoading,
    errorMsg,
    successMsg,
    clearMessages,
  };
}
