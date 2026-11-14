"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "@/lib/router-compat";
import { useRouter } from "@/lib/router-compat";
import React, { useEffect, useState } from "react";
import { useVerifyResetPassword } from "../hooks/use-verify-reset-password";
import { maskEmail } from "../utils/mask-email";
import { OtpInputSection } from "./otp-input-section";

export function VerifyResetPasswordForm() {
  const router = useRouter();

  const [email] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("reset_email") || "";
    }
    return "";
  });

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verifyOtp, resendOtp, isLoading, isResending, isSuccess, errorMsg, successMsg } =
    useVerifyResetPassword();

  useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    if (otp.length === 6 && email && !isLoading && !isSuccess) {
      void verifyOtp(email.trim(), otp.trim());
    }
  }, [otp, email, isLoading, isSuccess, verifyOtp]);

  const handleResend = async () => {
    if (!email.trim() || resendCooldown > 0 || isResending) return;
    const ok = await resendOtp(email.trim());
    if (ok) {
      setResendCooldown(60);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || otp.length !== 6) return;
    await verifyOtp(email.trim(), otp.trim());
  };

  if (!email) {
    return null;
  }

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">Verifikasi Kode OTP</CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Pemulihan
          </span>
        </div>
        <CardDescription>
          Masukkan 6 digit kode pemulihan yang dikirimkan ke{" "}
          <strong className="text-foreground">{maskEmail(email)}</strong>.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle />
            <AlertTitle>Verifikasi Gagal</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {successMsg && (
          <Alert className="mb-4 border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
            <CheckCircle2 />
            <AlertTitle>Berhasil</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-6">
            <OtpInputSection
              id="reset-verify-otp"
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
              hasError={!!errorMsg}
            />

            <Button
              type="submit"
              disabled={isLoading || !email.trim() || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <ShieldCheck data-icon="inline-start" />
                  Verifikasi Kode OTP
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 className="size-3" />
            Ubah Email
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={resendCooldown > 0 || isResending || !email.trim()}
            onClick={handleResend}
            className="text-blue-600 hover:bg-muted font-medium"
          >
            <RefreshCw className={isResending ? "animate-spin" : ""} data-icon="inline-start" />
            {resendCooldown > 0
              ? `Kirim Ulang (${resendCooldown}s)`
              : isResending
                ? "Mengirim..."
                : "Kirim Ulang OTP"}
          </Button>
        </div>

        <div className="mt-4 pt-3 border-t border-border text-center text-sm">
          <Link
            href="/login"
            prefetch={false}
            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
