import { BarChart3, History, Info, LayoutGrid, LifeBuoy, Settings2 } from "lucide-react";

import type { NavItem, NavSection } from "@/types/navigation";
import { ROUTES } from "@/routes/paths";

export const SIDEBAR_NAV: NavSection[] = [
  {
    label: "Automation",
    items: [
      { title: "Workspace", to: ROUTES.workspace, icon: LayoutGrid, description: "Create and run automations" },
      { title: "Executions", to: ROUTES.executions, icon: History, description: "History and results" },
      { title: "Analytics", to: ROUTES.analytics, icon: BarChart3, description: "Usage and success metrics" },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Settings", to: ROUTES.settings, icon: Settings2, description: "Preferences and appearance" },
      { title: "Help & Docs", to: ROUTES.help, icon: LifeBuoy, description: "Guides and FAQ" },
      { title: "About", to: ROUTES.about, icon: Info, description: "Version and credits" },
    ],
  },
];

export const MOBILE_NAV: NavItem[] = [
  { title: "Workspace", to: ROUTES.workspace, icon: LayoutGrid },
  { title: "Executions", to: ROUTES.executions, icon: History },
  { title: "Analytics", to: ROUTES.analytics, icon: BarChart3 },
  { title: "Settings", to: ROUTES.settings, icon: Settings2 },
];
