import { useCallback } from "react";
import { useTheme as useNextTheme } from "next-themes";

/** Theme helpers built on next-themes (persists to localStorage). */
export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return { theme, resolvedTheme, isDark, setTheme, toggleTheme };
}
