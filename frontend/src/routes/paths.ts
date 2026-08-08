export const ROUTES = {
  landing: "/",
  workspace: "/app/workspace",
  executions: "/app/executions",
  analytics: "/app/analytics",
  settings: "/app/settings",
  help: "/app/help",
  about: "/app/about",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
