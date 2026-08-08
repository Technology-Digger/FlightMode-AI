import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  label: string;
  icon?: LucideIcon;
  tooltip?: string;
  children?: ReactNode;
}

/** Icon-only button with an accessible label and optional tooltip. */
export function IconButton({ label, icon: Icon, tooltip, children, className, ...props }: IconButtonProps) {
  const button = (
    <Button variant="ghost" size="icon" aria-label={label} className={cn(className)} {...props}>
      {children ?? (Icon ? <Icon /> : null)}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
