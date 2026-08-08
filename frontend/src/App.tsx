import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router";

import { AppLayout } from "@/layouts/AppLayout";
import { RouteLoading } from "@/components/common/RouteLoading";
import { ROUTES } from "@/routes/paths";

const Landing = lazy(() => import("@/pages/Landing"));
const Workspace = lazy(() => import("@/pages/Workspace"));
const Executions = lazy(() => import("@/pages/Executions"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Settings = lazy(() => import("@/pages/Settings"));
const Help = lazy(() => import("@/pages/Help"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Page({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoading />}>{children}</Suspense>;
}

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.landing} element={<Page><Landing /></Page>} />

      <Route element={<AppLayout />}>
        <Route path="/app" element={<Navigate to={ROUTES.workspace} replace />} />
        <Route path={ROUTES.workspace} element={<Page><Workspace /></Page>} />
        <Route path={ROUTES.executions} element={<Page><Executions /></Page>} />
        <Route path={ROUTES.analytics} element={<Page><Analytics /></Page>} />
        <Route path={ROUTES.settings} element={<Page><Settings /></Page>} />
        <Route path={ROUTES.help} element={<Page><Help /></Page>} />
        <Route path={ROUTES.about} element={<Page><About /></Page>} />
      </Route>

      <Route path="*" element={<Page><NotFound /></Page>} />
    </Routes>
  );
}
