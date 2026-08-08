import { Github, Globe, Heart, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router";

import { APP_DESCRIPTION, APP_LICENSE, APP_NAME, APP_VERSION } from "@/constants/app";
import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/routes/paths";

const PRODUCT_LINKS = [
  { label: "Workspace", to: ROUTES.workspace },
  { label: "Executions", to: ROUTES.executions },
  { label: "Analytics", to: ROUTES.analytics },
  { label: "Templates", to: ROUTES.workspace },
];

const RESOURCE_LINKS = [
  { label: "Settings", to: ROUTES.settings },
  { label: "Help & Docs", to: ROUTES.help },
  { label: "About", to: ROUTES.about },
  { label: "Back to landing", to: ROUTES.landing },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {APP_DESCRIPTION}
            </p>
            <div className="mt-5 flex items-center gap-1">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Globe, label: "Website" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-3 space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-3 space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © 2026 {APP_NAME} · Released under the {APP_LICENSE} License · v{APP_VERSION}
          </p>
          <p className="inline-flex items-center gap-1">
            Built with <Heart className="size-3 fill-current text-destructive" /> for the AI
            gateway era
          </p>
        </div>
      </div>
    </footer>
  );
}
