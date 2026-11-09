"use client";

import Link from "next/link";

type SearchType = {
  title: string;
  href: string;
};

const searchSugg: SearchType[] = [
  { title: "Terms & Conditions", href: "#" },
  { title: "Privacy Policy", href: "#" },
];

export default function Footer() {
  return (
    <div className="flex md:flex-row flex-col items-center justify-between gap-3 text-center">
      <p className="text-sm text-muted-foreground">© 2026 Ramein Platform. All rights reserved.</p>

      <div className="flex gap-4">
        {searchSugg.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="text-sm hover:text-primary text-muted-foreground"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
