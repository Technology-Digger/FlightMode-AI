import { motion } from "framer-motion";
import { ArrowDown, Boxes, Heart, Layers, Server, Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { Logo } from "@/components/common/Logo";
import { APP_DESCRIPTION, APP_LICENSE, APP_NAME, APP_REPOSITORY, APP_VERSION } from "@/constants/app";
import { stagger, staggerItem, viewportOnce } from "@/animations/variants";

const TECH_STACK = [
  "React 19", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "React Router",
  "TanStack Query", "React Hook Form", "Zod", "Framer Motion", "Recharts",
  "Lucide Icons", "Sonner", "cmdk", "date-fns", "next-themes", "react-markdown",
];

const CREDITS = [
  { name: "shadcn/ui", role: "Accessible component primitives", url: "https://ui.shadcn.com" },
  { name: "Lucide", role: "Icon set", url: "https://lucide.dev" },
  { name: "Framer Motion", role: "Motion system", url: "https://motion.dev" },
  { name: "TanStack Query", role: "Server-state management", url: "https://tanstack.com/query" },
  { name: "Recharts", role: "Charting", url: "https://recharts.org" },
  { name: "Zod", role: "Schema validation", url: "https://zod.dev" },
];

const LAYERS = [
  { icon: Boxes, title: "React UI", subtitle: "Pages · components · hooks · contexts" },
  { icon: Layers, title: "Service layer", subtitle: "automationService · providerService · healthService" },
  { icon: Server, title: "FastAPI AI Gateway", subtitle: "REST + streaming — ready to connect" },
  { icon: Sparkles, title: "AI providers", subtitle: "OpenAI · Anthropic · Google · Mistral · xAI · DeepSeek" },
];

function LayerRow({ icon: Icon, title, subtitle }: (typeof LAYERS)[number]) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3.5 shadow-sm transition-colors hover:border-primary/30">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About Flight Mode AI"
        description="Version, architecture, and the people who made this possible."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Logo showWordmark={false} size={44} />
              <Badge variant="secondary">v{APP_VERSION}</Badge>
            </div>
            <CardTitle className="mt-3 text-lg">{APP_NAME}</CardTitle>
            <CardDescription className="leading-relaxed">{APP_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/70 px-2.5 py-1">{APP_LICENSE} License</span>
            <a
              href={APP_REPOSITORY}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border/70 px-2.5 py-1 transition-colors hover:text-foreground"
            >
              Repository ↗
            </a>
            <span className="rounded-full border border-border/70 px-2.5 py-1">Frontend demo</span>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Architecture</CardTitle>
            <CardDescription>
              Clean service boundaries so the FastAPI gateway can drop in without UI changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col items-center"
            >
              {LAYERS.map((layer, index) => (
                <div key={layer.title} className="flex w-full flex-col items-center">
                  <motion.div variants={staggerItem} className="w-full">
                    <LayerRow {...layer} />
                  </motion.div>
                  {index < LAYERS.length - 1 && (
                    <motion.div variants={staggerItem} className="py-1 text-muted-foreground/50">
                      <ArrowDown className="size-4" />
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Technology stack</CardTitle>
            <CardDescription>Everything this interface is built with.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Credits</CardTitle>
            <CardDescription>Open-source libraries powering this experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border/60">
              {CREDITS.map((credit) => (
                <li key={credit.name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{credit.name}</p>
                    <p className="text-xs text-muted-foreground">{credit.role}</p>
                  </div>
                  <a
                    href={credit.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Visit ↗
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">License</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
              <p>MIT License</p>
              <p className="mt-2">Copyright © 2026 Flight Mode AI</p>
              <p className="mt-2">
                Permission is hereby granted, free of charge, to any person obtaining a copy of
                this software and associated documentation files (the &quot;Software&quot;), to deal
                in the Software without restriction, including without limitation the rights to
                use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
                the Software…
              </p>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              Built with <Heart className="size-3 fill-current text-destructive" /> and a
              frontend-first philosophy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
