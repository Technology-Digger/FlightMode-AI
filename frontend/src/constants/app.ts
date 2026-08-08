export const APP_BRAND = "Flight Mode";
export const APP_NAME = "Flight Mode AI";
export const APP_TAGLINE = "Complex workflows, on autopilot";
export const APP_DESCRIPTION =
  "Flight Mode AI orchestrates AI models and external APIs to complete complex workflows automatically. Describe a task, launch a run, and receive a finished result — minimal input, complete confidence.";

export const APP_VERSION = "1.0.0";
export const APP_LICENSE = "MIT";
export const APP_REPOSITORY = "https://github.com/your-org/flight-mode-ai";
export const APP_WEBSITE = "https://flightmode.ai";
export const CONTACT_EMAIL = "hello@flightmode.ai";

/**
 * Base URL of the FastAPI AI gateway.
 * Override with VITE_API_BASE_URL — never hardcode a URL in feature code.
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "https://flightmode-ai-1.onrender.com";

export const STORAGE_KEYS = {
  settings: "flightmode.settings.v1",
} as const;

export const GATEWAY_NAME = "FastAPI AI Gateway";
