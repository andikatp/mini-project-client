"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, User } from "lucide-react";
import { useLogin } from "../hooks/use-login";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function OrganizerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, errorMsg, successMsg } = useLogin();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">
            Masuk sebagai Organizer
          </CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
            Penyelenggara Event
          </span>
        </div>
        <CardDescription>
          Akses dashboard untuk mengelola tiket, voucher, dan transaksi event.
        </CardDescription>
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
              <FieldLabel htmlFor="organizer-email">Email Organizer</FieldLabel>
              <Input
                id="organizer-email"
                type="email"
                autoComplete="email"
                placeholder="organizer@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && !email}
              />
              {!email && errorMsg && (
                <FieldError errors={[{ message: "Email organizer wajib diisi" }]} />
              )}
            </Field>

            <Field data-invalid={!!errorMsg && !password}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="organizer-password">Kata Sandi</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:underline font-medium"
                  tabIndex={0}
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="organizer-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!errorMsg && !password}
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
              {!password && errorMsg && (
                <FieldError errors={[{ message: "Kata sandi wajib diisi" }]} />
              )}
            </Field>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 shadow-sm transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Membuka Dashboard...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>

            <FieldSeparator>atau</FieldSeparator>

            <Button
              type="button"
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted"
              onClick={() => router.push("/login")}
            >
              <User data-icon="inline-start" />
              Masuk sebagai Customer (Pembeli Tiket)
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          Belum terdaftar sebagai Organizer?{" "}
          <Link
            href="/register?role=organizer"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Daftar Organizer di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
