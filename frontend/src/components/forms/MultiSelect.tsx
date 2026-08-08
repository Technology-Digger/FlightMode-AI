import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  buttonLabel?: string;
}

/** Multi-select combobox with checkmarks and removable chips. */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
  buttonLabel = "Filter",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.filter((option) => value.includes(option.value));

  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", className)}
        >
          <span className="flex items-center gap-1.5">
            <span>{buttonLabel}</span>
            {selected.length > 0 && (
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                {selected.length}
              </span>
            )}
          </span>
          <ChevronsUpDown className="size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1.5">
        {selected.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1 border-b border-border/70 pb-1.5">
            {selected.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium"
              >
                {option.label}
                <button
                  type="button"
                  aria-label={`Remove ${option.label}`}
                  onClick={() => toggle(option.value)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <ul className="grid gap-0.5">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => toggle(option.value)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                    isSelected && "text-primary",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border",
                    )}
                  >
                    {isSelected && <Check className="size-3" />}
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
