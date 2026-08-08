import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/common/Logo";
import { CommandPalette } from "@/components/common/CommandPalette";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useTheme } from "@/hooks/use-theme";
import { useSettings } from "@/contexts/settings-context";
import { SIDEBAR_NAV } from "@/constants/navigation";
import { SHORTCUT_BINDINGS } from "@/constants/shortcuts";
import { ROUTES } from "@/routes/paths";
import { pageTransition } from "@/animations/variants";
import { cn } from "@/lib/utils";

/** Shell for all authenticated (public here) app pages. */
export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { toggleTheme } = useTheme();
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useKeyboardShortcuts(
    {
      [SHORTCUT_BINDINGS.commandPalette]: () => setPaletteOpen(true),
      [SHORTCUT_BINDINGS.toggleTheme]: () => toggleTheme(),
      [SHORTCUT_BINDINGS.focusSearch]: () => navigate(ROUTES.executions),
      [SHORTCUT_BINDINGS.newAutomation]: () => navigate(ROUTES.workspace),
    },
    settings.keyboardShortcuts,
  );

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar
          onMenuClick={() => setMobileMenuOpen(true)}
          onCommandPalette={() => setPaletteOpen(true)}
        />

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mx-auto w-full max-w-6xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileNav />

      {/* Mobile drawer navigation */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 gap-0 border-r p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center border-b border-border/70 px-4">
            <Logo to="/app/workspace" />
          </div>
          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Mobile">
            {SIDEBAR_NAV.map((section) => (
              <div key={section.label}>
                <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {section.label}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;
                    return (
                      <li key={item.to}>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate(item.to);
                          }}
                          className={cn(
                            "w-full justify-start gap-2.5",
                            active && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Icon className="size-4" />
                          {item.title}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
