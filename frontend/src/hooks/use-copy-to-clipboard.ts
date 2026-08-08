import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyToClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copy = useCallback(
    async (value: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Fallback for older browsers / non-secure contexts.
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) return false;
      }

      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), timeoutMs);
      return true;
    },
    [timeoutMs],
  );

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  return { copied, copy };
}
