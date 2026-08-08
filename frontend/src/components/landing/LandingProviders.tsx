import { motion } from "framer-motion";

import { AI_PROVIDERS } from "@/data/providers";
import { stagger, staggerItem, viewportOnce } from "@/animations/variants";
import { cn } from "@/lib/utils";

export function LandingProviders() {
  return (
    <section id="providers" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={staggerItem}
            className="text-xs font-semibold uppercase tracking-widest text-primary"
          >
            Supported AI providers
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            One orchestrator, every major model
          </motion.h2>
          <motion.p variants={staggerItem} className="mt-4 text-muted-foreground">
            Flight Mode routes each stage to the strongest model for the job — and falls
            back automatically when a provider stumbles.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {AI_PROVIDERS.map((provider) => {
            const Icon = provider.icon;
            return (
              <motion.div
                key={provider.id}
                variants={staggerItem}
                className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${provider.color}1a`, color: provider.color }}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      provider.status === "operational"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        provider.status === "operational" ? "bg-emerald-500" : "animate-pulse-soft bg-amber-500",
                      )}
                    />
                    {provider.status === "operational" ? "Operational" : "Degraded"}
                  </span>
                </div>
                <h3 className="mt-4 flex items-baseline gap-2">
                  <span className="text-base font-semibold">{provider.name}</span>
                  <span className="text-xs text-muted-foreground">{provider.model}</span>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {provider.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="tabular-nums">{provider.latencyMs}ms avg</span>
                  <span className="size-0.5 rounded-full bg-border" />
                  <span>${provider.costPer1k.toFixed(3)}/1k tokens</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
