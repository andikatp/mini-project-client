import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth-api";

export function useVerifyResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const verifyOtp = async (email: string, otp: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Alamat email tidak valid.");
      return null;
    }

    if (!otp.trim() || otp.trim().length !== 6 || !/^\d{6}$/.test(otp.trim())) {
      setErrorMsg("Harap masukkan 6 digit kode OTP verifikasi.");
      return null;
    }

    setIsLoading(true);

    try {
      const response = await authApi.verifyResetPassword({
        email: email.trim(),
        otp: otp.trim(),
      });

      const token =
        response.data?.resetToken ||
        response.data?.token ||
        (typeof response.data === "string" ? response.data : null);

      if (!token) {
        throw new Error("Token pemulihan tidak diterima dari server.");
      }

      setSuccessMsg("Kode OTP terverifikasi! Mengalihkan...");

      // Save token in sessionStorage as fallback
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reset_password_token", token);
      }

      router.push(`/reset-password?token=${encodeURIComponent(token)}`);
      return token;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Kode OTP tidak valid atau telah kedaluwarsa.";
      setErrorMsg(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Alamat email wajib diisi.");
      return false;
    }

    setIsResending(true);

    try {
      const response = await authApi.forgotPassword({ email: email.trim() });
      setSuccessMsg(
        response.message || "Kode OTP baru telah dikirimkan ke email Anda.",
      );
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengirim ulang kode OTP. Silakan coba lagi.";
      setErrorMsg(message);
      return false;
    } finally {
      setIsResending(false);
    }
  };

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return {
    verifyOtp,
    resendOtp,
    isLoading,
    isResending,
    errorMsg,
    successMsg,
    clearMessages,
  };
}

