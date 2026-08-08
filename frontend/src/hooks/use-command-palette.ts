import { useCallback, useState } from "react";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  return { open, setOpen, toggle };
}
