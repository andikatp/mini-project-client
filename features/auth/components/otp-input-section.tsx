import { Field, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Clock } from "lucide-react";
import React from "react";

interface OtpInputSectionProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function OtpInputSection({
  id,
  value,
  onChange,
  disabled = false,
  hasError = false,
}: OtpInputSectionProps) {
  return (
    <Field data-invalid={hasError && value.length !== 6}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={id}>Kode OTP (6 Digit)</FieldLabel>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Clock className="size-3" /> Berlaku 10 menit
        </span>
      </div>
      <div className="flex justify-center py-2">
        <InputOTP id={id} maxLength={6} value={value} onChange={onChange} disabled={disabled}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </Field>
  );
}
