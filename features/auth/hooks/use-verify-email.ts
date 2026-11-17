import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth-api";

export function useVerifyEmail() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const verify = useCallback(
    async (email: string, otp: string) => {
      if (isLoading || isVerified) return false;
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

        void navigate("/login", { replace: true });

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
    },
    [isLoading, isVerified, navigate],
  );

  const resendVerification = useCallback(async (email?: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    let targetEmail = email;
    if (!targetEmail && typeof window !== "undefined") {
      targetEmail = sessionStorage.getItem("registered_email") || undefined;
    }

    if (!targetEmail?.trim()) {
      setErrorMsg("Alamat email tidak ditemukan. Silakan masukkan ulang email.");
      return false;
    }

    setIsResending(true);

    try {
      const response = await authApi.resendVerification({ email: targetEmail.trim() });
      setSuccessMsg(response.message || "Kode OTP verifikasi baru telah dikirimkan ke email Anda.");
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim ulang kode OTP verifikasi.";
      setErrorMsg(message);
      return false;
    } finally {
      setIsResending(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, []);

  return {
    verify,
    resendVerification,
    isLoading,
    isResending,
    isVerified,
    errorMsg,
    successMsg,
    clearMessages,
  };
}
