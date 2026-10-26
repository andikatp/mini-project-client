import { useState } from "react";
import { authApi } from "../api/auth-api";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const requestReset = async (email: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Harap masukkan alamat email Anda.");
      return false;
    }

    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });

      setSuccessMsg(
        response.message ||
          "Jika email Anda terdaftar, Anda akan segera menerima tautan pemulihan kata sandi.",
      );
      setIsSubmitted(true);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengirim permintaan pemulihan kata sandi. Silakan coba lagi.";
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

  const reset = () => {
    setIsSubmitted(false);
    clearMessages();
  };

  return {
    requestReset,
    isLoading,
    errorMsg,
    successMsg,
    isSubmitted,
    clearMessages,
    reset,
  };
}
