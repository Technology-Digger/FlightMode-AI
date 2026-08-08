import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { fadeUp, viewportOnce } from "@/animations/variants";
import type { FeatureItem } from "@/data/landing";

interface FeatureCardProps {
  feature: FeatureItem;
  index?: number;
}

/** Landing feature card with hover lift and accent icon. */
export function FeatureCard({ feature, index = 0 }: FeatureCardProps) {
  const Icon = feature.icon;
  return (
    <motion.div variants={fadeUp} viewport={viewportOnce} initial="hidden" whileInView="visible">
      <Card className="group h-full gap-3 border-border/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            <Icon className="size-5" />
          </div>
          <span className="font-mono text-xs text-muted-foreground/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mt-2 text-base font-semibold tracking-tight">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
      </Card>
    </motion.div>
  );
}
