import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}
