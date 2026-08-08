import { ListChecks, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AutomationTemplate } from "@/data/mockTemplates";

interface TemplateCardProps {
  template: AutomationTemplate;
  selected?: boolean;
  onSelect?: (template: AutomationTemplate) => void;
  className?: string;
}

/** Template card used to seed the task composer. */
export function TemplateCard({ template, selected, onSelect, className }: TemplateCardProps) {
  const Icon = template.icon;
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onClick={onSelect ? () => onSelect(template) : undefined}
        onKeyDown={(event) => {
          if (onSelect && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onSelect(template);
          }
        }}
        className={cn(
          "group h-full cursor-pointer gap-2.5 border-border/70 p-4 shadow-sm transition-all duration-300",
          selected
            ? "border-primary/50 ring-2 ring-primary/25"
            : "hover:border-primary/30 hover:shadow-md",
          className,
        )}
        aria-pressed={selected}
      >
        <div className="flex items-start justify-between">
          <div
            className="flex size-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${template.color}1a`, color: template.color }}
          >
            <Icon className="size-4.5" />
          </div>
          {selected && <Sparkles className="size-4 text-primary" />}
        </div>
        <div>
          <p className="text-sm font-semibold leading-snug">{template.name}</p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {template.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium">
            {template.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <ListChecks className="size-3" />
            {template.steps} steps
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
