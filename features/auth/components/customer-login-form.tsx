"use client";

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
import { AlertCircle, Building2, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useLogin } from "../hooks/use-login";

export function CustomerLoginForm() {
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
          <CardTitle className="text-xl font-bold tracking-tight">Masuk sebagai Customer</CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
            Pembeli Tiket
          </span>
        </div>
        <CardDescription>
          Sudah punya akun? Masuk untuk membeli tiket dan menikmati diskon.
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
              <FieldLabel htmlFor="customer-email">Email</FieldLabel>
              <Input
                id="customer-email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && !email}
              />
              {!email && errorMsg && <FieldError errors={[{ message: "Email wajib diisi" }]} />}
            </Field>

            <Field data-invalid={!!errorMsg && !password}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="customer-password">Kata Sandi</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:underline font-medium"
                  tabIndex={0}
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="customer-password"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Memproses...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>

            <FieldSeparator>atau</FieldSeparator>

            <Button
              type="button"
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted"
              onClick={() => router.push("/login/organizer")}
            >
              <Building2 data-icon="inline-start" />
              Masuk sebagai Event Organizer
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register?role=customer"
            className="font-semibold text-blue-600 hover:underline"
          >
            Daftar di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
