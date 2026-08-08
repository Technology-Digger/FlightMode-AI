import { Search, X } from "lucide-react";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  kbdHint?: string;
  className?: string;
  autoFocus?: boolean;
}

/** Search input with clear button and optional keyboard hint. */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  onSubmit,
  kbdHint,
  className,
  autoFocus,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      role="search"
      className={cn("relative w-full", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-9 pr-16"
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        kbdHint && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            <Kbd>{kbdHint}</Kbd>
          </span>
        )
      )}
    </form>
  );
}
