import Image from "next/image";

interface ArtworkProps {
  readonly className?: string;
}

interface BaseArtworkProps extends ArtworkProps {
  readonly svgSrc: string;
  readonly bgGlowClass: string;
  readonly title: string;
  readonly description: string;
  readonly alt: string;
}

function BaseArtwork({
  className = "",
  svgSrc,
  bgGlowClass,
  title,
  description,
  alt,
}: Readonly<BaseArtworkProps>) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full max-w-[340px] aspect-4/3 flex items-center justify-center">
        <div className={`absolute inset-4 rounded-3xl ${bgGlowClass} -z-10`} />
        <Image
          src={svgSrc}
          alt={alt}
          width={400}
          height={300}
          priority
          className="w-full h-full object-contain drop-shadow-sm select-none"
        />
      </div>

      <div className="mt-4 text-center max-w-sm px-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function CustomerLoginArtwork(props: Readonly<ArtworkProps>) {
  return (
    <BaseArtwork
      {...props}
      svgSrc="/images/auth/customer-login.svg"
      bgGlowClass="bg-blue-500/10"
      alt="Customer Login Illustration"
      title="Tidak lagi ketinggalan event dan aktivitas favoritmu"
      description="Gabung dan rasakan kemudahan beli tiket, tukar voucher diskon, dan nikmati pengalaman event terbaik."
    />
  );
}

export function OrganizerLoginArtwork(props: Readonly<ArtworkProps>) {
  return (
    <BaseArtwork
      {...props}
      svgSrc="/images/auth/organizer-login.svg"
      bgGlowClass="bg-indigo-500/10"
      alt="Organizer Portal Illustration"
      title="Kelola event sukses & pantau penjualan tiketmu"
      description="Akses portal penyelenggara: atur kuota tiket, rilis voucher promosi, dan monitor performa finansial real-time."
    />
  );
}

export function RegisterArtwork(props: Readonly<ArtworkProps>) {
  return (
    <BaseArtwork
      {...props}
      svgSrc="/images/auth/register.svg"
      bgGlowClass="bg-amber-500/10"
      alt="Registration Reward Illustration"
      title="Mulai petualangan event spektakuler sekarang"
      description="Daftar sekarang untuk dapatkan voucher diskon referral 10% dan kemudahan akses ke ribuan konser & festival."
    />
  );
}

export function VerifyEmailArtwork(props: Readonly<ArtworkProps>) {
  return (
    <BaseArtwork
      {...props}
      svgSrc="/images/auth/verify-email.svg"
      bgGlowClass="bg-sky-500/10"
      alt="Verify Email Illustration"
      title="Periksa kotak masuk email kamu"
      description="Tautan konfirmasi telah dikirimkan. Verifikasi email untuk mengamankan akun dan menikmati seluruh fitur."
    />
  );
}

export function ForgotPasswordArtwork(props: Readonly<ArtworkProps>) {
  return (
    <BaseArtwork
      {...props}
      svgSrc="/images/auth/forgot-password.svg"
      bgGlowClass="bg-amber-500/10"
      alt="Forgot Password Illustration"
      title="Lupa kata sandi? Kami siap bantu"
      description="Jangan khawatir, masukkan email kamu dan kami akan mengirimkan tautan aman untuk membuat kata sandi baru."
    />
  );
}

export function ResetPasswordArtwork(props: Readonly<ArtworkProps>) {
  return (
    <BaseArtwork
      {...props}
      svgSrc="/images/auth/reset-password.svg"
      bgGlowClass="bg-emerald-500/10"
      alt="Reset Password Security Illustration"
      title="Buat kata sandi baru yang kuat"
      description="Kombinasikan huruf, angka, dan simbol untuk melindungi transaksi tiket dan data akunmu dengan maksimal."
    />
  );
}

export function ChangePasswordArtwork(props: Readonly<ArtworkProps>) {
  return (
    <BaseArtwork
      {...props}
      svgSrc="/images/auth/change-password.svg"
      bgGlowClass="bg-blue-500/10"
      alt="Change Password Routine Illustration"
      title="Perbarui kata sandi secara berkala"
      description="Menjaga keamanan akun secara berkala memastikan privasi dan transaksi tiket kamu selalu terlindungi."
    />
  );
}
