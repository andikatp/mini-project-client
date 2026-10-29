"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useVerifyEmail } from "../hooks/use-verify-email";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verify, resendVerification, isLoading, isResending, errorMsg, successMsg, isVerified } =
    useVerifyEmail();

  // Handle countdown for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!email) return;
    const success = await resendVerification(email);
    if (success) {
      setResendCooldown(60);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verify(email, otp);
  };

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">Verifikasi Kode OTP</CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 border border-sky-500/20">
            Aktivasi
          </span>
        </div>
        <CardDescription>
          {email ? (
            <span>
              Masukkan 6 digit kode verifikasi yang telah dikirimkan ke{" "}
              <strong className="text-foreground">{email}</strong>.
            </span>
          ) : (
            "Masukkan alamat email Anda dan 6 digit kode OTP yang diterima."
          )}
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
          <FieldGroup className="gap-4">
            {!initialEmail && (
              <Field data-invalid={!!errorMsg && !email}>
                <FieldLabel htmlFor="verify-email">Alamat Email</FieldLabel>
                <Input
                  id="verify-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isVerified}
                  required
                />
              </Field>
            )}

            <Field data-invalid={!!errorMsg && otp.length !== 6}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="verify-otp">Kode OTP (6 Digit)</FieldLabel>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> Berlaku 10 menit
                </span>
              </div>
              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  disabled={isLoading || isVerified}
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
              <FieldDescription className="text-center text-xs">
                Maksimal 5 kali percobaan verifikasi kode.
              </FieldDescription>
            </Field>

            <Button
              type="submit"
              disabled={isLoading || isVerified || !email.trim() || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm transition-all mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <ShieldCheck data-icon="inline-start" />
                  Verifikasi Akun
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Tidak menerima kode?</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={resendCooldown > 0 || isResending || isVerified || !email.trim()}
            onClick={handleResend}
            className="text-blue-600 hover:bg-muted"
          >
            <RefreshCw
              className={isResending || resendCooldown > 0 ? "animate-spin" : ""}
              data-icon="inline-start"
            />
            {resendCooldown > 0
              ? `Kirim Ulang (${resendCooldown}s)`
              : isResending
                ? "Mengirim..."
                : "Kirim Ulang OTP"}
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          Sudah berhasil diverifikasi?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Lanjut ke Halaman Masuk
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
