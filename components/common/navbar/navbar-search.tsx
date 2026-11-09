"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface NavbarSearchProps {
  onSearch?: (query: string) => void;
}

export function NavbarSearch({ onSearch }: NavbarSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="mx-2 max-w-md flex-1">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari event di sini..."
          className="w-full rounded-md bg-muted py-2 pr-10 pl-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          aria-label="Cari event"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="size-4" />
        </button>
      </form>
    </div>
  );
}
