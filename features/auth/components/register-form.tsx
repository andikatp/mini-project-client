"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import type { UserRole } from "../types";
import { useRegister } from "../hooks/use-register";
import { RegisterRoleTabs } from "./register-role-tabs";
import { RegisterReferralField } from "./register-referral-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

interface RegisterFormProps {
  initialRole?: UserRole;
}

export function RegisterForm({ initialRole = "CUSTOMER" }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role");
  const [userSelectedRole, setUserSelectedRole] = useState<UserRole | null>(null);
  const role: UserRole =
    userSelectedRole ??
    (queryRole === "organizer" || queryRole === "EVENT_ORGANIZER"
      ? "EVENT_ORGANIZER"
      : initialRole);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, errorMsg, successMsg } = useRegister();

  const handleSelectRole = (newRole: UserRole) => {
    setUserSelectedRole(newRole);
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", newRole === "EVENT_ORGANIZER" ? "organizer" : "customer");
    router.replace(`/register?${params.toString()}`, { scroll: false });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register({
      name,
      email,
      password,
      confirmPassword,
      role,
      referralCode: referralCode ? referralCode.trim() : undefined,
    });
  };

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">Buat Akun Baru</CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Gratis
          </span>
        </div>
        <CardDescription>
          Pilih tipe akun dan isi formulir pendaftaran di bawah ini.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Role Selection Tabs */}
        <RegisterRoleTabs role={role} onSelectRole={handleSelectRole} disabled={isLoading} />

        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle />
            <AlertTitle>Pendaftaran Gagal</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {successMsg && (
          <Alert className="mb-4 border-emerald-500/30 text-emerald-700 bg-emerald-50/50">
            <CheckCircle2 />
            <AlertTitle>Pendaftaran Sukses</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errorMsg && !name}>
              <FieldLabel htmlFor="register-name">Nama Lengkap</FieldLabel>
              <Input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder={role === "CUSTOMER" ? "Nama Anda" : "Nama Perusahaan / Organizer"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && !name}
              />
            </Field>

            <Field data-invalid={!!errorMsg && !email}>
              <FieldLabel htmlFor="register-email">Alamat Email</FieldLabel>
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!errorMsg && !email}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field data-invalid={!!errorMsg && password.length < 6}>
                <FieldLabel htmlFor="register-password">Kata Sandi</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="register-password"
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
                <FieldLabel htmlFor="register-confirm-password">Ulangi Sandi</FieldLabel>
                <Input
                  id="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!errorMsg && password !== confirmPassword}
                />
              </Field>
            </div>

            {/* Optional Referral Code field */}
            <RegisterReferralField
              value={referralCode}
              onChange={setReferralCode}
              disabled={isLoading}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-2.5 shadow-sm transition-all mt-2 ${
                role === "EVENT_ORGANIZER"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Mendaftarkan Akun...
                </>
              ) : (
                `Daftar Akun ${role === "EVENT_ORGANIZER" ? "Organizer" : "Customer"}`
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href={role === "EVENT_ORGANIZER" ? "/login/organizer" : "/login"}
            className="font-semibold text-blue-600 hover:underline"
          >
            Masuk di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
