import { motion } from "framer-motion";
import { Link } from "react-router";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQS } from "@/data/landing";
import { ROUTES } from "@/routes/paths";
import { stagger, staggerItem, viewportOnce } from "@/animations/variants";

export function LandingFaq() {
  return (
    <section id="faq" className="scroll-mt-20 border-y border-border/60 bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p
            variants={staggerItem}
            className="text-xs font-semibold uppercase tracking-widest text-primary"
          >
            FAQ
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Questions, answered
          </motion.h2>
          <motion.p variants={staggerItem} className="mt-4 max-w-md text-muted-foreground">
            Everything you might wonder before launching your first run. For the full
            guide, check the documentation.
          </motion.p>
          <motion.div variants={staggerItem} className="mt-6">
            <Button variant="outline" asChild>
              <Link to={ROUTES.help}>Open documentation</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Accordion type="single" collapsible className="rounded-2xl border border-border/60 bg-background px-5 shadow-sm">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`} className="border-border/60">
                <AccordionTrigger className="py-4 text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
