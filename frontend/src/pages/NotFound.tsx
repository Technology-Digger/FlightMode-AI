import { motion } from "framer-motion";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/icons/brand";
import { ROUTES } from "@/routes/paths";
import { EASE } from "@/animations/variants";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
      <div className="bg-grid mask-fade-b absolute inset-0" aria-hidden="true" />
      <div className="animate-float absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 left-10 size-72 rounded-full bg-indigo-400/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 right-10 size-64 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative"
      >
        <div className="relative mx-auto w-fit">
          <BrandMark className="mx-auto size-20" style={{ filter: "blur(1px)" }} />
          <span className="absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-md">
            <Compass className="size-4 text-muted-foreground" />
          </span>
        </div>

        <h1 className="mt-8 text-7xl font-bold tracking-tight sm:text-8xl">
          <span className="text-gradient">404</span>
        </h1>
        <p className="mt-4 text-xl font-semibold tracking-tight">This flight never left the ground</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist — maybe it was moved, or it
          simply wasn&apos;t in the flight plan.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to={ROUTES.landing}>
            <Button size="lg" variant="outline" className="gap-2">
              <ArrowLeft className="size-4" />
              Return home
            </Button>
          </Link>
          <Link to={ROUTES.workspace}>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
              <Sparkles className="size-4" />
              Launch the workspace
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
