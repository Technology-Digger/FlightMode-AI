import { NavLink } from "react-router";

import { MOBILE_NAV } from "@/constants/navigation";
import { cn } from "@/lib/utils";

/** Bottom navigation shown on small screens. */
export function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto flex max-w-md items-stretch">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg transition-colors",
                      isActive && "bg-primary/10",
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </span>
                  {item.title}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
