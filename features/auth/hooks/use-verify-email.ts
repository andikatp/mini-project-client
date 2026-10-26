import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth-api";

export function useVerifyEmail() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const verify = async (token: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!token.trim()) {
      setErrorMsg("Harap masukkan token verifikasi akun Anda.");
      return false;
    }

    setIsLoading(true);

    try {
      const response = await authApi.verifyEmail({ token: token.trim() });

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
          : "Gagal memverifikasi email. Token tidak valid atau sudah kedaluwarsa.";
      setErrorMsg(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = (email?: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email?.trim()) {
      setErrorMsg("Email tidak ditemukan. Silakan login kembali untuk mengirim ulang verifikasi.");
      return false;
    }

    setSuccessMsg("Tautan verifikasi baru telah dikirimkan ke email Anda.");
    return true;
  };

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return {
    verify,
    resendVerification,
    isLoading,
    errorMsg,
    successMsg,
    isVerified,
    clearMessages,
  };
}
