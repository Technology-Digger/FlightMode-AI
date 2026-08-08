import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ROUTES } from "@/routes/paths";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Process", href: "#process" },
  { label: "Providers", href: "#providers" },
  { label: "FAQ", href: "#faq" },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-sm" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo to={ROUTES.landing} />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Landing">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link to={ROUTES.workspace} className="hidden sm:block">
            <Button size="sm" className="gap-1.5">
              <Sparkles className="size-3.5" />
              Open app
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0 p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3.5">
                <Logo />
                <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  to={ROUTES.workspace}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2"
                >
                  <Button className="w-full gap-1.5">
                    <Sparkles className="size-4" />
                    Open app
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
