import "@vly-ai/integrations";
import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import React, { StrictMode, Suspense, useEffect, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouteLoading } from "@/components/common/RouteLoading";
import { SettingsProvider, useSettings } from "@/contexts/settings-context";
import { queryClient } from "@/lib/queryClient";
import App from "@/App";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import "./index.css";

/** Wire the reduce-motion preference into Framer Motion. */
function MotionSettings({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  return (
    <MotionConfig reducedMotion={settings.reduceMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 break-words text-xs text-muted-foreground">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 max-h-40 overflow-auto rounded border border-border/60 p-2 text-left text-[10px] leading-4 text-muted-foreground/80">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SettingsProvider>
          <MotionSettings>
            <TooltipProvider delayDuration={200}>
              <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                  <RouteSyncer />
                  <Suspense fallback={<RouteLoading />}>
                    <App />
                  </Suspense>
                </BrowserRouter>
                <Toaster richColors position="bottom-right" />
              </QueryClientProvider>
            </TooltipProvider>
          </MotionSettings>
        </SettingsProvider>
      </ThemeProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
