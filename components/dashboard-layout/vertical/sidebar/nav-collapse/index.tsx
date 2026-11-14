"use client";

import Link, { usePathname } from "@/lib/router-compat";
import NavItem from "../nav-items/index";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import type { MenuItem, ChildItem } from "../sidebaritems";

interface NavCollapseProps {
  readonly menu: MenuItem[];
  readonly className?: string;
}

export default function NavCollapse({ menu, className }: NavCollapseProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapse = state === "collapsed";

  const isActiveRoute = (item: ChildItem): boolean => {
    if (item.url && pathname === item.url) return true;
    if (item.items) return item.items.some(isActiveRoute);
    return false;
  };

  return (
    <>
      {menu.map((section) => (
        <div key={section.heading ?? "section"}>
          {/* Heading */}
          <span
            className={cn(
              "text-xs uppercase block font-semibold text-muted-foreground mb-2 transition-all duration-200 text-center",
              isCollapse ? "hide-menu" : "text-start",
            )}
          >
            {section.heading ?? ""}
          </span>

          {section.items?.map((item: ChildItem) => {
            const hasChildren = Array.isArray(item.items) && item.items.length > 0;
            const active = isActiveRoute(item);
            const itemKey = item.id ? String(item.id) : item.name;

            // 👉 No children → direct link
            if (!hasChildren)
              return (
                <Link
                  key={itemKey}
                  href={item.url || "#"}
                  target={item.external ? "_blank" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md transition-all duration-200 ease-in-out",
                    className,
                  )}
                >
                  <NavItem item={item} hasChildren={false} isActive={active} />
                </Link>
              );

            // 👉 With children → collapsible
            return (
              <details key={itemKey} className="group/nav" open={active || item.isActive}>
                <summary
                  className={cn(
                    "cursor-pointer rounded-md flex items-center transition-all duration-200 ease-in-out",
                  )}
                >
                  <NavItem item={item} hasChildren={true} className={className} isActive={active} />
                </summary>

                <div className="pl-3 ml-5 border-l border-border">
                  {item.items?.map((sub: ChildItem) => {
                    const subKey = sub.id ? String(sub.id) : sub.name;
                    return sub.items ? (
                      <NavCollapse key={subKey} menu={[{ items: [sub] }]} className={className} />
                    ) : (
                      <Link
                        key={subKey}
                        href={sub.url || "#"}
                        target={sub.external ? "_blank" : undefined}
                        className={cn(
                          "block rounded-md transition-all duration-200 ease-in-out",
                          className,
                        )}
                      >
                        <NavItem
                          item={sub}
                          hasChildren={false}
                          className={cn(
                            "px-2! py-1! my-1!",
                            pathname === sub.url && "bg-primary/5 text-primary",
                          )}
                          isActive={pathname === sub.url}
                        />
                      </Link>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      ))}
    </>
  );
}
