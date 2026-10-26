"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useVerifyEmail } from "../hooks/use-verify-email";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [token, setToken] = useState(urlToken);
  const [email] = useState(emailParam);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verify, resendVerification, isLoading, errorMsg, successMsg } = useVerifyEmail();

  // Handle countdown for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResend = () => {
    if (resendVerification(email)) {
      setResendCooldown(60);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verify(token);
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
              Kami telah mengirimkan instruksi ke{" "}
              <strong className="text-foreground">{email}</strong>.
            </span>
          ) : (
            "Periksa inbox atau folder spam email Anda untuk menemukan tautan verifikasi."
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
            <Field data-invalid={!!errorMsg && !token}>
              <FieldLabel htmlFor="verify-token">Token / Kode Verifikasi</FieldLabel>
              <Input
                id="verify-token"
                type="text"
                autoComplete="off"
                placeholder="Tempelkan token verifikasi di sini"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && !token}
              />
              <FieldDescription>
                Jika Anda membuka tautan langsung dari email, token akan otomatis terisi.
              </FieldDescription>
            </Field>

            <Button
              type="submit"
              disabled={isLoading || !token.trim()}
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
                  Verifikasi Sekarang
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        {email && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Tidak menerima email?</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={resendCooldown > 0}
              onClick={handleResend}
              className="text-blue-600 hover:bg-muted"
            >
              <RefreshCw
                className={resendCooldown > 0 ? "animate-spin" : ""}
                data-icon="inline-start"
              />
              {resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}d)` : "Kirim Ulang Tautan"}
            </Button>
          </div>
        )}

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
