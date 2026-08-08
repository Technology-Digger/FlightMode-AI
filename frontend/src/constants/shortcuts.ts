export interface ShortcutDef {
  id: string;
  label: string;
  description: string;
  keys: string[];
}

export const KEYBOARD_SHORTCUTS: ShortcutDef[] = [
  { id: "command-palette", label: "Command palette", description: "Search commands and navigate", keys: ["⌘", "K"] },
  { id: "new-automation", label: "New automation", description: "Reset the composer and focus the prompt", keys: ["⌘", "N"] },
  { id: "start-automation", label: "Start automation", description: "Run the current task", keys: ["⌘", "⏎"] },
  { id: "cancel-automation", label: "Cancel automation", description: "Stop the running workflow", keys: ["Esc"] },
  { id: "toggle-theme", label: "Toggle theme", description: "Switch between light and dark", keys: ["⌘", "⇧", "L"] },
  { id: "focus-search", label: "Focus search", description: "Jump to execution history search", keys: ["/"] },
];

export const SHORTCUT_BINDINGS = {
  commandPalette: "mod+k",
  newAutomation: "mod+n",
  startAutomation: "mod+enter",
  cancelAutomation: "escape",
  toggleTheme: "mod+shift+l",
  focusSearch: "/",
} as const;

export type ShortcutBinding = (typeof SHORTCUT_BINDINGS)[keyof typeof SHORTCUT_BINDINGS];
