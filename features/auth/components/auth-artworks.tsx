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
    <div
      className={`relative flex flex-col items-center justify-center w-full max-w-md ${className}`}
    >
      <div className="relative w-full max-w-[350px] h-[230px] sm:h-[240px] flex items-center justify-center">
        <div className={`absolute inset-0 rounded-3xl ${bgGlowClass} -z-10`} />
        <Image
          src={svgSrc}
          alt={alt}
          width={360}
          height={250}
          priority
          className="w-full h-full object-contain drop-shadow-sm select-none p-2"
        />
      </div>

      <div className="mt-5 text-center max-w-[360px] px-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h2>
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
      description="Kode OTP verifikasi telah dikirimkan. Verifikasi email untuk mengamankan akun dan menikmati seluruh fitur."
    />
  );
}

export function VerifyResetPasswordArtwork(props: Readonly<ArtworkProps>) {
  return (
    <BaseArtwork
      {...props}
      svgSrc="/images/auth/verify-email.svg"
      bgGlowClass="bg-amber-500/10"
      alt="Verify Reset Password Illustration"
      title="Periksa kotak masuk email kamu"
      description="Masukkan 6 digit kode OTP pemulihan kata sandi yang telah dikirimkan ke email kamu."
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
      description="Jangan khawatir, masukkan email kamu dan kami akan mengirimkan kode OTP untuk membuat kata sandi baru."
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
