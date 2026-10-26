import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth-api";
import type { RegisterInput } from "../types";

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const register = async (input: RegisterInput) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!input.name.trim()) {
      setErrorMsg("Nama lengkap wajib diisi.");
      return false;
    }

    if (!input.email.trim()) {
      setErrorMsg("Email wajib diisi.");
      return false;
    }

    if (input.password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return false;
    }

    if (input.confirmPassword && input.password !== input.confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return false;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register(input);

      setSuccessMsg(
        response.message ||
          "Pendaftaran berhasil! Tautan verifikasi telah dikirimkan ke email Anda.",
      );

      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(input.email.trim())}`);
      }, 1500);

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mendaftar. Silakan coba kembali.";
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
    register,
    isLoading,
    errorMsg,
    successMsg,
    clearMessages,
  };
}
