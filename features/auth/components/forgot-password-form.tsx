"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { requestReset, isLoading, errorMsg, successMsg, isSubmitted, reset } = useForgotPassword();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await requestReset(email);
  };

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">Lupa Kata Sandi?</CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Pemulihan
          </span>
        </div>
        <CardDescription>
          Masukkan alamat email yang terdaftar untuk menerima tautan pembuatan kata sandi baru.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle />
            <AlertTitle>Gagal Mengirim</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {isSubmitted && successMsg && (
          <div className="mb-6 space-y-4">
            <Alert className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
              <CheckCircle2 />
              <AlertTitle>Email Terkirim</AlertTitle>
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
            <div className="p-4 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Langkah berikutnya:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>
                  Buka inbox email <span className="font-medium text-blue-600">{email}</span>
                </li>
                <li>Klik tautan &quot;Reset Password&quot; di dalam pesan</li>
                <li>Buat kata sandi baru dan masuk kembali ke akunmu</li>
              </ol>
            </div>
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup className="gap-4">
              <Field data-invalid={!!errorMsg && !email}>
                <FieldLabel htmlFor="forgot-email">Email Terdaftar</FieldLabel>
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!errorMsg && !email}
                />
                <FieldDescription>
                  Pastikan email yang dimasukkan sama dengan saat mendaftar.
                </FieldDescription>
                {!email && errorMsg && <FieldError errors={[{ message: "Email wajib diisi" }]} />}
              </Field>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm transition-all mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    Mengirim Tautan...
                  </>
                ) : (
                  <>
                    <Mail data-icon="inline-start" />
                    Kirim Link Reset Password
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full text-foreground border-border hover:bg-muted"
            onClick={() => reset()}
          >
            Kirim Ulang ke Email Lain
          </Button>
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
