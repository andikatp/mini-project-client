"use client";

import { Input } from "@/components/ui/input";
import { Component, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import { ChildItem, getSidebarItems, MenuItem } from "../../vertical/sidebar/sidebaritems";

type SearchableItem = {
  name: string;
  url: string;
  path: string;
};

function searchItems(
  items: (MenuItem | ChildItem)[],
  q: string,
  parentPath = "",
): SearchableItem[] {
  let results: SearchableItem[] = [];

  items.forEach((item) => {
    const itemName = item.name ?? "";
    const currentPath = parentPath ? `${parentPath} → ${itemName}` : itemName;

    if (item.name && item.url && item.name.toLowerCase().includes(q.toLowerCase())) {
      results.push({
        name: item.name,
        url: item.url,
        path: currentPath,
      });
    }

    if (item.items) {
      results = [...results, ...searchItems(item.items, q, currentPath)];
    }
  });

  return results;
}

function Search() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const allMenu = [...getSidebarItems("EVENT_ORGANIZER"), ...getSidebarItems("CUSTOMER")];
    return searchItems(allMenu, query);
  }, [query]);

  return (
    <div className="relative w-full">
      <div className="flex items-center relative w-xs mx-auto">
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search..."
          className="rounded-lg pl-10!"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div
        className={`absolute w-full bg-card rounded-md top-11 z-10 inset-s-0 shadow-md border border-border ${
          query ? "block" : "hidden"
        }`}
      >
        <SimpleBar className="h-72 p-4 custom-scroll">
          {results.length ? (
            results.map((item) => (
              <Link
                key={item.path}
                href={item.url}
                onClick={() => setQuery("")}
                className="p-2 mb-1.5 last:mb-0 flex items-center bg-input/30 gap-2 text-sm font-medium rounded-md hover:bg-primary/5 hover:text-primary w-full overflow-hidden"
              >
                <div className="flex items-center">
                  <Component width={18} height={18} />
                  <div className="ps-3">
                    <h5 className="mb-1 text-sm group-hover/link:text-primary">{item.name}</h5>
                    <span className="text-xs block truncate max-w-60">{item.url}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-medium font-medium">No Menus Found!</h1>
            </div>
          )}
        </SimpleBar>
      </div>
    </div>
  );
}

export default Search;
