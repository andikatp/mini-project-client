"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link, { useSearchParams } from "@/lib/router-compat";
import React, { useEffect, useState } from "react";
import { useVerifyEmail } from "../hooks/use-verify-email";
import { maskEmail } from "../utils/mask-email";
import { OtpInputSection } from "./otp-input-section";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState<string>(() => {
    if (initialEmail) return initialEmail;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("registered_email") || "";
    }
    return "";
  });

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verify, resendVerification, isLoading, isResending, errorMsg, successMsg, isVerified } =
    useVerifyEmail();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    if (otp.length === 6 && email && !isLoading && !isVerified) {
      void verify(email.trim(), otp.trim());
    }
  }, [otp, email, isLoading, isVerified, verify]);

  const handleResend = async () => {
    if (!email.trim() || resendCooldown > 0 || isResending || isVerified) return;
    const success = await resendVerification(email.trim());
    if (success) {
      setResendCooldown(60);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || otp.length !== 6) return;
    await verify(email.trim(), otp.trim());
  };

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">
            Verifikasi Alamat Email
          </CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 border border-sky-500/20">
            Aktivasi
          </span>
        </div>
        <CardDescription>
          {email ? (
            <span>
              Masukkan 6 digit kode OTP yang telah dikirimkan ke{" "}
              <strong className="text-foreground">{maskEmail(email)}</strong>.
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
          <FieldGroup className="gap-6">
            {!email && (
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

            <OtpInputSection
              id="verify-email-otp"
              value={otp}
              onChange={setOtp}
              disabled={isLoading || isVerified}
              hasError={!!errorMsg}
            />

            <Button
              type="submit"
              disabled={isLoading || isVerified || !email.trim() || otp.length !== 6}
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
                  Verifikasi Akun
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Tidak menerima kode?</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={resendCooldown > 0 || isResending || isVerified || !email.trim()}
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

        <div className="mt-4 pt-3 border-t border-border text-center text-sm text-muted-foreground">
          Sudah berhasil diverifikasi?{" "}
          <Link
            href="/login"
            prefetch={false}
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
