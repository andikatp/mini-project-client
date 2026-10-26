"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useResetPassword } from "../hooks/use-reset-password";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") || "";

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { resetPassword, isLoading, errorMsg, successMsg } = useResetPassword();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await resetPassword({
      token: token.trim(),
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
        <CardDescription>
          Buat kata sandi baru untuk akun Anda dan konfirmasi perubahannya.
        </CardDescription>
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

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errorMsg && !token}>
              <FieldLabel htmlFor="reset-token">Token Reset</FieldLabel>
              <Input
                id="reset-token"
                type="text"
                autoComplete="off"
                placeholder="Token dari email tautan reset"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && !token}
              />
              <FieldDescription>
                Terisi otomatis jika membuka tautan dari pesan email pemulihan.
              </FieldDescription>
            </Field>

            <Field data-invalid={!!errorMsg && password.length < 6}>
              <FieldLabel htmlFor="reset-new-password">Kata Sandi Baru</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="reset-new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!errorMsg && password.length < 6}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field data-invalid={!!errorMsg && password !== confirmPassword}>
              <FieldLabel htmlFor="reset-confirm-password">Konfirmasi Kata Sandi Baru</FieldLabel>
              <Input
                id="reset-confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && password !== confirmPassword}
              />
            </Field>

            <Button
              type="submit"
              disabled={isLoading}
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
