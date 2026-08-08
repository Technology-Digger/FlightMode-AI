import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { WorkflowIllustration } from "@/components/automation/WorkflowIllustration";
import { ROUTES } from "@/routes/paths";
import { EASE, stagger, staggerItem } from "@/animations/variants";

const CHECKS = ["No tool coordination", "6 AI models orchestrated", "Results in under 30s"];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-grid mask-fade-b absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[26rem] w-[44rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-float absolute top-44 -left-28 size-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div
          className="animate-float absolute top-72 -right-28 size-72 rounded-full bg-indigo-400/10 blur-3xl"
          style={{ animationDelay: "2.2s" }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
          >
            <Sparkles className="size-3.5" />
            AI-powered workflow orchestration
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Describe the task.
            <br />
            <span className="text-gradient">Flight Mode completes it.</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Flight Mode AI orchestrates AI models and external APIs to run complex
            workflows end to end — you describe the goal, launch the run, and receive a
            finished result. Minimal input, complete confidence.
          </motion.p>

          <motion.div variants={staggerItem} className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={ROUTES.workspace}>
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
                <Play className="size-4 fill-current" />
                Launch your first run
              </Button>
            </Link>
            <a href="#process">
              <Button size="lg" variant="outline" className="gap-2">
                See how it works
                <ArrowRight className="size-4" />
              </Button>
            </a>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground"
          >
            {CHECKS.map((check) => (
              <span key={check} className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {check}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
        >
          <WorkflowIllustration />
        </motion.div>
      </div>
    </section>
  );
}
