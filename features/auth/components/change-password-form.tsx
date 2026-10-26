"use client";

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
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useChangePassword } from "../hooks/use-change-password";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { changePassword, isLoading, errorMsg, successMsg } = useChangePassword();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = await changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">Ganti Kata Sandi</CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
            Keamanan
          </span>
        </div>
        <CardDescription>
          Perbarui kata sandi secara berkala untuk menjaga akun dan transaksi tiket Anda tetap aman.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle />
            <AlertTitle>Perubahan Gagal</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {successMsg && (
          <Alert className="mb-4 border-emerald-500/30 text-emerald-600  bg-emerald-500/10">
            <CheckCircle2 />
            <AlertTitle>Berhasil Diubah</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errorMsg && !currentPassword}>
              <FieldLabel htmlFor="current-password">Kata Sandi Saat Ini</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi lama"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!errorMsg && !currentPassword}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label={showCurrent ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showCurrent ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field data-invalid={!!errorMsg && newPassword.length < 6}>
              <FieldLabel htmlFor="change-new-password">Kata Sandi Baru</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="change-new-password"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!errorMsg && newPassword.length < 6}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showNew ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Gunakan kombinasi huruf besar, huruf kecil, dan angka.
              </FieldDescription>
            </Field>

            <Field data-invalid={!!errorMsg && newPassword !== confirmPassword}>
              <FieldLabel htmlFor="change-confirm-password">Ulangi Kata Sandi Baru</FieldLabel>
              <Input
                id="change-confirm-password"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Konfirmasi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && newPassword !== confirmPassword}
              />
            </Field>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Menyimpan Perubahan...
                </>
              ) : (
                <>
                  <ShieldCheck data-icon="inline-start" />
                  Perbarui Kata Sandi
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Beranda
          </Link>
          <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
            Lupa kata sandi saat ini?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
