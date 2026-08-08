import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { STORAGE_KEYS } from "@/constants/app";
import { DEFAULT_SETTINGS, type NotificationPrefs, type Settings } from "@/types/settings";

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  updateNotifications: (patch: Partial<NotificationPrefs>) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications ?? {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // Storage unavailable (private mode) — settings live for the session.
    }
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const updateNotifications = useCallback((patch: Partial<NotificationPrefs>) => {
    setSettings((current) => ({
      ...current,
      notifications: { ...current.notifications, ...patch },
    }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(
    () => ({ settings, update, updateNotifications, reset }),
    [settings, update, updateNotifications, reset],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
