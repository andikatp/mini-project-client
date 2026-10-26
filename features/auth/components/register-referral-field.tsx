import { Gift } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface RegisterReferralFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
}

export function RegisterReferralField({ value, onChange, disabled }: RegisterReferralFieldProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="register-referral">Kode Referral (Opsional)</FieldLabel>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
          <Gift className="size-3" />
          Kupon 10%
        </span>
      </div>
      <Input
        id="register-referral"
        type="text"
        autoComplete="off"
        placeholder="Contoh: TIKETKU-1234"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        disabled={disabled}
      />
      <FieldDescription>
        Punya kode dari teman? Dapatkan voucher diskon 10% untuk transaksi pertamamu.
      </FieldDescription>
    </Field>
  );
}
