import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth-api";

export function useVerifyEmail() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const verify = async (email: string, otp: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Email akun wajib diisi.");
      return false;
    }

    if (!otp.trim() || otp.trim().length !== 6 || !/^\d{6}$/.test(otp.trim())) {
      setErrorMsg("Harap masukkan 6 digit angka kode OTP.");
      return false;
    }

    setIsLoading(true);

    try {
      const response = await authApi.verifyEmail({
        email: email.trim(),
        otp: otp.trim(),
      });

      setSuccessMsg(
        response.message || "Email Anda berhasil diverifikasi! Mengalihkan ke halaman masuk...",
      );
      setIsVerified(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);

      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal memverifikasi email. Kode OTP tidak valid atau sudah kedaluwarsa.";
      setErrorMsg(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email?: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email?.trim()) {
      setErrorMsg("Email tidak ditemukan. Silakan masukkan email terlebih dahulu.");
      return false;
    }

    setIsResending(true);
    try {
      const response = await authApi.resendVerification({ email: email.trim() });
      setSuccessMsg(
        response.message || "Kode OTP verifikasi baru telah dikirimkan ke email Anda.",
      );
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim ulang kode OTP. Coba lagi.";
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
    verify,
    resendVerification,
    isLoading,
    isResending,
    errorMsg,
    successMsg,
    isVerified,
    clearMessages,
  };
}
