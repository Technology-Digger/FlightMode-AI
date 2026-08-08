import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { STATS } from "@/data/landing";
import { ROUTES } from "@/routes/paths";
import { stagger, staggerItem, viewportOnce } from "@/animations/variants";

export function LandingCta() {
  return (
    <section className="py-20 sm:py-24">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        <motion.div
          variants={staggerItem}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-indigo-500/10 px-6 py-14 text-center shadow-xl sm:px-12"
        >
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to put your workflows on autopilot?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Describe one task — a report, an analysis, a plan — and watch Flight Mode
              orchestrate the rest in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={ROUTES.workspace}>
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/30">
                  <Play className="size-4 fill-current" />
                  Launch your first run — it&apos;s free
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore features
                  <ArrowRight className="size-4" />
                </Button>
              </a>
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold tabular-nums tracking-tight text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
