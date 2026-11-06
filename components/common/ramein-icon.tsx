import React from "react";

interface RameinIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function RameinIcon({ size = 32, className = "", ...props }: RameinIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Dynamic Electric Blue to Violet gradient */}
        <linearGradient id="ramein-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="45%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        <linearGradient id="accent-streak" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
      </defs>

      {/* Main squircle: radius pas (9px), tipis border putihnya (1.5px), crisp & clean */}
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="9"
        fill="url(#ramein-bg)"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Modern Ribbon loop dynamic R (simbol tiket + kumpul rame-rame/infinity vibe) */}
      {/* Dynamic ribbon stem & loop */}
      <path
        d="M12.5 28.5V11.5H19.5C23.5 11.5 26.5 14 26.5 17.5C26.5 20.2 24.5 22.2 21.8 23L27.5 28.5H23L18 23.5H15.5V28.5H12.5Z"
        fill="#FFFFFF"
      />

      {/* Clean inner cutout */}
      <path
        d="M15.5 14V21H19.2C21.6 21 23.5 19.6 23.5 17.5C23.5 15.4 21.6 14 19.2 14H15.5Z"
        fill="#1E40AF"
      />

      {/* Festive vibrant ticket spark / lightning dot on the leg */}
      <path d="M21 23.5L25.5 18L23.8 23.5H27L22 29L23 25H21Z" fill="url(#accent-streak)" />
    </svg>
  );
}
