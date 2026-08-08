import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { HELP_ARTICLES } from "@/data/help";
import { ROUTES } from "@/routes/paths";
import { stagger, staggerItem, viewportOnce } from "@/animations/variants";

export default function Help() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Documentation"
        description="How orchestration works, what the stages do, and what happens when things go wrong."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid gap-6 lg:grid-cols-2"
      >
        {HELP_ARTICLES.map((article) => {
          const Icon = article.icon;
          return (
            <motion.div key={article.id} variants={staggerItem}>
              <Card className="h-full border-border/70 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {article.sections.map((section) => (
                    <div
                      key={section.heading}
                      className="rounded-xl border border-border/60 bg-muted/20 p-4"
                    >
                      <h3 className="text-sm font-semibold">{section.heading}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                        {section.body}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div>
            <p className="text-base font-semibold">Still curious? Try it yourself.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The best documentation is a live run — describe a task and watch it work.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to={ROUTES.workspace}>
              Open the workspace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
