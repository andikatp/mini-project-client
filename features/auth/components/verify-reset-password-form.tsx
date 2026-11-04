"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit2,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useVerifyResetPassword } from "../hooks/use-verify-reset-password";

/**
 * Mask email for privacy (e.g. ahmad.subardjo@gmail.com -> ahm***@gmail.com)
 */
function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 3) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 3)}***@${domain}`;
}

export function VerifyResetPasswordForm() {
  const router = useRouter();

  // Hanya izinkan jika user datang dari flow submit forgot-password (ada di sessionStorage)
  const [email] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("reset_email") || "";
    }
    return "";
  });

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verifyOtp, resendOtp, isLoading, isResending, errorMsg, successMsg } =
    useVerifyResetPassword();

  // Guard: If no email found in query or session, route back to forgot-password
  useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  // Handle resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // UX Improvement: Auto-verify immediately once user finishes typing 6 digits
  useEffect(() => {
    if (otp.length === 6 && email && !isLoading) {
      void verifyOtp(email.trim(), otp.trim());
    }
  }, [otp, email, isLoading, verifyOtp]);

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
            <Field data-invalid={!!errorMsg && otp.length !== 6}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="reset-verify-otp">Kode OTP (6 Digit)</FieldLabel>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> Berlaku 10 menit
                </span>
              </div>
              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </Field>

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
