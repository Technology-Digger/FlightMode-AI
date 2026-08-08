import { useCallback, useEffect, useRef } from "react";

type Handler = (event: KeyboardEvent) => void;

interface ParsedCombo {
  mod: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}

function parseCombo(combo: string): ParsedCombo {
  const parts = combo.split("+");
  const key = parts[parts.length - 1]!.toLowerCase();
  return {
    mod: parts.includes("mod"),
    alt: parts.includes("alt"),
    shift: parts.includes("shift"),
    key,
  };
}

function matches(event: KeyboardEvent, combo: ParsedCombo): boolean {
  const key = event.key.toLowerCase();
  const isMod = event.metaKey || event.ctrlKey;
  return (
    key === combo.key &&
    isMod === combo.mod &&
    event.altKey === combo.alt &&
    event.shiftKey === combo.shift
  );
}

export interface KeyboardShortcutMap {
  [combo: string]: Handler;
}

/**
 * Register global keyboard shortcuts.
 * Combos use "mod" (⌘/Ctrl), "alt", "shift" and a key, e.g. "mod+k".
 */
export function useKeyboardShortcuts(bindings: KeyboardShortcutMap, enabled = true) {
  const bindingsRef = useRef(bindings);
  bindingsRef.current = bindings;

  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      for (const [combo, callback] of Object.entries(bindingsRef.current)) {
        const parsed = parseCombo(combo);
        if (!matches(event, parsed)) continue;

        // Don't swallow plain keys while the user is typing.
        if (isTyping && !parsed.mod && parsed.key !== "escape") continue;

        event.preventDefault();
        callback(event);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled]);
}

export function useEscapeKey(onEscape: () => void, active = true) {
  const handlerRef = useRef(onEscape);
  handlerRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") handlerRef.current();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);

  return useCallback(() => handlerRef.current(), []);
}
