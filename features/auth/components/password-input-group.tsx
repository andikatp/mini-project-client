"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface PasswordInputGroupProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  "aria-invalid"?: boolean;
  className?: string;
}

export function PasswordInputGroup({
  id,
  value,
  onChange,
  disabled = false,
  required = true,
  autoComplete = "current-password",
  placeholder = "••••••••",
  "aria-invalid": ariaInvalid,
  className,
}: PasswordInputGroupProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup className={className}>
      <InputGroupInput
        id={id}
        type={showPassword ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={ariaInvalid}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
