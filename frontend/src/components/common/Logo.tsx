import { Link } from "react-router";

import { APP_BRAND } from "@/constants/app";
import { BrandMark } from "@/icons/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  to?: string;
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ to = "/", className, size = 30, showWordmark = true }: LogoProps) {
  return (      <Link
        to={to}
        aria-label={`${APP_BRAND} AI home`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <BrandMark
        className="transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      />
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          {APP_BRAND} <span className="text-gradient">AI</span>
        </span>
      )}
    </Link>
  );
}
