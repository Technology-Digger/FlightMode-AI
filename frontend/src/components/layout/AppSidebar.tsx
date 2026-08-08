import { useQuery } from "@tanstack/react-query";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/components/common/Logo";
import { IconButton } from "@/components/common/IconButton";
import { getGatewayHealth } from "@/services/healthService";
import { SIDEBAR_NAV } from "@/constants/navigation";
import { APP_NAME, APP_VERSION } from "@/constants/app";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "flightmode.sidebar.collapsed";

function GatewayStatus({ collapsed }: { collapsed: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ["gateway-health"],
    queryFn: getGatewayHealth,
    refetchInterval: 45_000,
  });

  if (isLoading) {
    return <div className="h-9 animate-pulse rounded-lg bg-muted/60" aria-hidden="true" />;
  }

  const online = data?.status === "online";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2",
        collapsed && "justify-center px-2",
      )}
    >
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          online ? "bg-emerald-500" : "animate-pulse-soft bg-amber-500",
        )}
      />
      {!collapsed && (
        <>
          <span className="truncate text-xs font-medium">
            {online ? "Gateway online" : "Gateway degraded"}
          </span>
          <span className="ml-auto shrink-0 text-[10px] tabular-nums text-muted-foreground">
            {data?.latencyMs}ms
          </span>
        </>
      )}
    </div>
  );
}

/** Desktop sidebar with collapse-to-rail behavior. */
export function AppSidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex",
        collapsed ? "w-[68px]" : "w-60",
      )}
      aria-label="Sidebar"
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-1 border-b border-sidebar-border/70",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        <Logo showWordmark={!collapsed} size={30} to="/app/workspace" />
        <IconButton
          label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          icon={collapsed ? PanelLeftOpen : PanelLeftClose}
          onClick={() => setCollapsed((value) => !value)}
          className={cn("hidden lg:inline-flex", collapsed && "absolute left-1/2 -translate-x-1/2")}
        />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Primary">
        {SIDEBAR_NAV.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const link = (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-200",
                        collapsed && "justify-center px-2",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )
                    }
                  >
                    <Icon className="size-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </NavLink>
                );
                return (
                  <li key={item.to}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-2.5 border-t border-sidebar-border/70 p-3">
        <GatewayStatus collapsed={collapsed} />
        {!collapsed && (
          <p className="px-1 text-[10px] text-muted-foreground/70">
            {APP_NAME} v{APP_VERSION} · frontend demo
          </p>
        )}
      </div>
    </aside>
  );
}
