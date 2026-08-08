import { Command, Info, LifeBuoy, Menu, Settings2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { IconButton } from "@/components/common/IconButton";
import { SearchBar } from "@/components/common/SearchBar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { SIDEBAR_NAV } from "@/constants/navigation";
import { APP_NAME, APP_VERSION } from "@/constants/app";
import { ROUTES } from "@/routes/paths";
import { useSettings } from "@/contexts/settings-context";

interface TopNavbarProps {
  onMenuClick: () => void;
  onCommandPalette: () => void;
}

function usePageTitle() {
  const { pathname } = useLocation();
  const flat = SIDEBAR_NAV.flatMap((section) => section.items);
  return flat.find((item) => item.to === pathname)?.title ?? APP_NAME;
}

export function TopNavbar({ onMenuClick, onCommandPalette }: TopNavbarProps) {
  const navigate = useNavigate();
  const title = usePageTitle();
  const [search, setSearch] = useState("");
  const { settings } = useSettings();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <IconButton
        label="Open menu"
        icon={Menu}
        onClick={onMenuClick}
        className="lg:hidden"
      />

      <div className="flex min-w-0 items-center gap-2">
        <h2 className="truncate text-[15px] font-semibold tracking-tight">{title}</h2>
        <span className="hidden items-center gap-1 rounded-full border border-border/70 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-flex">
          <Sparkles className="size-2.5" />
          AI orchestration
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="hidden w-64 md:block">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search executions…"
            kbdHint="/"
            onSubmit={(value) => {
              navigate(value ? `${ROUTES.executions}?q=${encodeURIComponent(value)}` : ROUTES.executions);
              setSearch("");
            }}
          />
        </div>

        <IconButton
          label="New automation"
          tooltip={`New automation (⌘N)${settings.keyboardShortcuts ? "" : " — shortcuts off"}`}
          icon={Sparkles}
          onClick={() => navigate(ROUTES.workspace)}
          className="text-primary"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCommandPalette}
          className="hidden cursor-pointer gap-1.5 sm:inline-flex"
        >
          <Command className="size-3.5" />
          <span className="hidden md:inline">Command</span>
          <Kbd>⌘K</Kbd>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open profile menu"
              className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="size-8 border border-border/70">
                <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-500 text-[11px] font-semibold text-primary-foreground">
                  F
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{APP_NAME} workspace</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Local demo · v{APP_VERSION}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTES.settings}>
                <Settings2 className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.help}>
                <LifeBuoy className="size-4" />
                Help &amp; Docs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.about}>
                <Info className="size-4" />
                About
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
