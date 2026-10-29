"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useResetPassword } from "../hooks/use-reset-password";
import { PasswordInputGroup } from "./password-input-group";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const queryToken = searchParams.get("token");
    if (queryToken) {
      setToken(queryToken);
    } else if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("reset_password_token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [searchParams]);

  const { resetPassword, isLoading, errorMsg, successMsg } = useResetPassword();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    await resetPassword({
      resetToken: token,
      password,
      confirmPassword,
    });
  };

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">Atur Ulang Kata Sandi</CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Aman
          </span>
        </div>
        <CardDescription>Masukkan kata sandi baru untuk akun Anda.</CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle />
            <AlertTitle>Gagal Reset Kata Sandi</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {successMsg && (
          <Alert className="mb-4 border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
            <CheckCircle2 />
            <AlertTitle>Berhasil Diperbarui</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        {!token ? (
          <div className="space-y-4 py-2">
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Sesi Pemulihan Tidak Ditemukan</AlertTitle>
              <AlertDescription>
                Token verifikasi tidak ditemukan atau sudah kedaluwarsa. Silakan mulai kembali dari
                halaman lupa kata sandi.
              </AlertDescription>
            </Alert>
            <Link
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 text-sm shadow-sm transition-all"
            >
              Mulai Ulang Pemulihan Kata Sandi
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup className="gap-4">
              <Field data-invalid={!!errorMsg && password.length < 6}>
                <FieldLabel htmlFor="reset-new-password">Kata Sandi Baru</FieldLabel>
                <PasswordInputGroup
                  id="reset-new-password"
                  autoComplete="new-password"
                  placeholder="Min. 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || !!successMsg}
                  aria-invalid={!!errorMsg && password.length < 6}
                />
                <FieldDescription>
                  Gunakan minimal 6 karakter kombinasi huruf dan angka.
                </FieldDescription>
              </Field>

              <Field data-invalid={!!errorMsg && password !== confirmPassword}>
                <FieldLabel htmlFor="reset-confirm-password">Konfirmasi Kata Sandi Baru</FieldLabel>
                <PasswordInputGroup
                  id="reset-confirm-password"
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading || !!successMsg}
                  aria-invalid={!!errorMsg && password !== confirmPassword}
                />
              </Field>

              <Button
                type="submit"
                disabled={
                  isLoading || !!successMsg || password.length < 6 || password !== confirmPassword
                }
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 shadow-sm transition-all mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    Menyimpan Perubahan...
                  </>
                ) : (
                  <>
                    <KeyRound data-icon="inline-start" />
                    Simpan Kata Sandi Baru
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-border text-center text-sm">
          <Link
            href="/login"
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
