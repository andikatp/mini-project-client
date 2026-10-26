"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle, Building2, CheckCircle2, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useLogin } from "../hooks/use-login";
import { PasswordInputGroup } from "./password-input-group";

interface BaseLoginFormProps {
  variant: "customer" | "organizer";
}

export function BaseLoginForm({ variant }: BaseLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, errorMsg, successMsg } = useLogin();

  const isCustomer = variant === "customer";

  const config = {
    title: isCustomer ? "Masuk sebagai Customer" : "Masuk sebagai Organizer",
    badgeText: isCustomer ? "Pembeli Tiket" : "Penyelenggara Event",
    badgeClass: isCustomer
      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
      : "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    description: isCustomer
      ? "Sudah punya akun? Masuk untuk membeli tiket dan menikmati diskon."
      : "Akses dashboard untuk mengelola tiket, voucher, dan transaksi event.",
    emailLabel: isCustomer ? "Email" : "Email Organizer",
    emailPlaceholder: isCustomer ? "nama@email.com" : "organizer@perusahaan.com",
    submitText: isCustomer ? "Masuk Sekarang" : "Masuk ke Dashboard",
    submitClass: isCustomer ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700",
    switchText: isCustomer
      ? "Masuk sebagai Event Organizer"
      : "Masuk sebagai Customer (Pembeli Tiket)",
    switchRoute: isCustomer ? "/login/organizer" : "/login",
    registerPrompt: isCustomer ? "Belum punya akun? " : "Belum terdaftar sebagai Organizer? ",
    registerLinkText: isCustomer ? "Daftar di sini" : "Daftar Organizer di sini",
    registerHref: isCustomer ? "/register?role=customer" : "/register?role=organizer",
    linkColor: isCustomer ? "text-blue-600" : "text-indigo-600",
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">{config.title}</CardTitle>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${config.badgeClass}`}
          >
            {config.badgeText}
          </span>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle />
            <AlertTitle>Gagal Masuk</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {successMsg && (
          <Alert className="mb-4 border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
            <CheckCircle2 />
            <AlertTitle>Sukses</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errorMsg && !email}>
              <FieldLabel htmlFor={`${variant}-email`}>{config.emailLabel}</FieldLabel>
              <Input
                id={`${variant}-email`}
                type="email"
                autoComplete="email"
                placeholder={config.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && !email}
              />
              {!email && errorMsg && (
                <FieldError errors={[{ message: `${config.emailLabel} wajib diisi` }]} />
              )}
            </Field>

            <Field data-invalid={!!errorMsg && !password}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={`${variant}-password`}>Kata Sandi</FieldLabel>
                <Link
                  href="/forgot-password"
                  className={`text-xs ${config.linkColor} hover:underline font-medium`}
                  tabIndex={0}
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <PasswordInputGroup
                id={`${variant}-password`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                aria-invalid={!!errorMsg && !password}
              />
              {!password && errorMsg && (
                <FieldError errors={[{ message: "Kata sandi wajib diisi" }]} />
              )}
            </Field>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-2.5 shadow-sm transition-all mt-2 ${config.submitClass}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Memproses...
                </>
              ) : (
                config.submitText
              )}
            </Button>

            <FieldSeparator>atau</FieldSeparator>

            <Button
              type="button"
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted"
              onClick={() => router.push(config.switchRoute)}
            >
              {isCustomer ? (
                <Building2 data-icon="inline-start" />
              ) : (
                <User data-icon="inline-start" />
              )}
              {config.switchText}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          {config.registerPrompt}
          <Link
            href={config.registerHref}
            className={`font-semibold ${config.linkColor} hover:underline`}
          >
            {config.registerLinkText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
