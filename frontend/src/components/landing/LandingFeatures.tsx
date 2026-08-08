import { motion } from "framer-motion";

import { FeatureCard } from "@/components/common/FeatureCard";
import { FEATURES } from "@/data/landing";
import { stagger, staggerItem, viewportOnce } from "@/animations/variants";

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-24">
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
            Features
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Your AI operations team, in one place
          </motion.h2>
          <motion.p variants={staggerItem} className="mt-4 text-muted-foreground">
            Describe a task once and let Flight Mode coordinate the models, tools, and
            services behind it — with total visibility into every step.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
