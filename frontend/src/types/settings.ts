export type ThemeMode = "light" | "dark" | "system";

export interface NotificationPrefs {
  runStarted: boolean;
  runCompleted: boolean;
  runFailed: boolean;
  fallbackUsed: boolean;
}

export interface Settings {
  /** Preferred AI provider for new runs. */
  defaultProviderId: string;
  /** Automatically fall back to a secondary provider on failure. */
  enableFallback: boolean;
  /** Master switch for UI animations. */
  animations: boolean;
  notifications: NotificationPrefs;
  /** Accessibility: respect reduced motion. */
  reduceMotion: boolean;
  /** Accessibility: announce run state changes with a live region. */
  announceResults: boolean;
  /** Enable global keyboard shortcuts. */
  keyboardShortcuts: boolean;
  /** Developer mode: reveals API payloads and internal details. */
  devMode: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultProviderId: "openai",
  enableFallback: true,
  animations: true,
  notifications: {
    runStarted: true,
    runCompleted: true,
    runFailed: true,
    fallbackUsed: true,
  },
  reduceMotion: false,
  announceResults: true,
  keyboardShortcuts: true,
  devMode: false,
};
