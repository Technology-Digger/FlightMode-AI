import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useTheme } from "@/hooks/use-theme";
import { IconButton } from "@/components/common/IconButton";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <IconButton
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      tooltip={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={cn("relative", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: 10, opacity: 0, scale: 0.7, rotate: -30 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, scale: 0.7, rotate: 30 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="grid place-items-center"
        >
          {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
        </motion.span>
      </AnimatePresence>
    </IconButton>
  );
}
