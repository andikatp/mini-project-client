import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth-api";
import type { ChangePasswordInput } from "../types";

export function useChangePassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const changePassword = async (input: ChangePasswordInput) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!input.currentPassword) {
      setErrorMsg("Kata sandi saat ini wajib diisi.");
      return false;
    }

    if (!input.newPassword || input.newPassword.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter.");
      return false;
    }

    if (input.confirmPassword && input.newPassword !== input.confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi baru tidak sesuai.");
      return false;
    }

    setIsLoading(true);

    try {
      const response = await authApi.changePassword(input);

      setSuccessMsg(
        response.message ||
          "Kata sandi berhasil diubah! Silakan gunakan kata sandi baru untuk sesi berikutnya.",
      );

      setTimeout(() => {
        router.push("/profile");
      }, 2000);

      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengubah kata sandi. Periksa apakah kata sandi saat ini sudah benar.";
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
    changePassword,
    isLoading,
    errorMsg,
    successMsg,
    clearMessages,
  };
}
