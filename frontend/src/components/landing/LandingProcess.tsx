import { motion } from "framer-motion";

import { PROCESS_STEPS } from "@/data/landing";
import { stagger, staggerItem, viewportOnce } from "@/animations/variants";

export function LandingProcess() {
  return (
    <section id="process" className="scroll-mt-20 border-y border-border/60 bg-muted/30 py-20 sm:py-24">
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
            How it works
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            From request to result
          </motion.h2>
          <motion.p variants={staggerItem} className="mt-4 text-muted-foreground">
            No pipelines to configure, no scripts to maintain — just a goal, and the
            orchestrator handles the coordination.
          </motion.p>
        </motion.div>

        <div className="relative mt-14">
          <div
            className="absolute left-1/2 top-6 hidden h-px w-[calc(100%-6rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
            aria-hidden="true"
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={staggerItem}
                  className="relative rounded-2xl border border-border/60 bg-background p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-muted-foreground/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
