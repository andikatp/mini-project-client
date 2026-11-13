import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function ProfileSecurityCard() {
  return (
    <div className="md:p-6 p-4 bg-background flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-primary" />
            <h3 className="font-semibold text-lg text-foreground">Security & Password</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Active
          </Badge>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-md bg-muted/40 border border-border">
            <div className="border border-border p-2.5 w-fit rounded-md text-foreground shrink-0">
              <Lock size={18} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold text-foreground">Password Management</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Perbarui kata sandi akun Anda secara berkala melalui halaman khusus ganti kata sandi
                demi menjaga keamanan data dan transaksi Anda.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-foreground">Aksi Keamanan</span>
            <Link href="/change-password">
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-3 px-4 cursor-pointer hover:border-primary/50 group"
              >
                <div className="flex items-center gap-2.5">
                  <Lock
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <span className="text-sm font-medium">Buka Halaman Ganti Kata Sandi</span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5"
                />
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-md border border-border/80 bg-muted/20 flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              Autentikasi Akun
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Akun Anda dilindungi dengan enkripsi standar industri. Jika Anda mencurigai adanya
              aktivitas mencurigakan, segera ganti kata sandi Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
