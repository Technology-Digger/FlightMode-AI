import { Home, Moon, Send, Sparkles, Sun } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "@/hooks/use-theme";
import { SIDEBAR_NAV } from "@/constants/navigation";
import { ROUTES } from "@/routes/paths";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Global ⌘K palette: navigation + quick actions. */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const go = (to: string) => {
    navigate(to);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Command palette" description="Search commands and navigation">
      <CommandInput placeholder="Type a command or search…" autoFocus />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go(ROUTES.landing)}>
            <Home />
            Landing page
          </CommandItem>
          {SIDEBAR_NAV.flatMap((section) =>
            section.items.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem key={item.to} onSelect={() => go(item.to)}>
                  <Icon />
                  {item.title}
                  {item.description && (
                    <span className="ml-1 truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </CommandItem>
              );
            }),
          )}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              toggleTheme();
              onOpenChange(false);
            }}
          >
            {isDark ? <Sun /> : <Moon />}
            Toggle theme
            <CommandShortcut>⌘⇧L</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go(ROUTES.workspace)}>
            <Sparkles />
            New automation
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onOpenChange(false);
              toast.info("Issue reported", {
                description: "This demo keeps the report local. Connect your gateway for real diagnostics.",
              });
            }}
          >
            <Send />
            Report an issue
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="border-t border-border/70 px-3 py-2 text-center text-[11px] text-muted-foreground">
        <span className="text-muted-foreground/70">↑↓</span> navigate · <span className="text-muted-foreground/70">↵</span> select ·{" "}
        <span className="text-muted-foreground/70">esc</span> close
      </div>
    </CommandDialog>
  );
}
