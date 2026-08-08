# Flight Mode AI — AI-Powered Workflow Automation

A production-ready, frontend-only web app for an AI-powered workflow
automation platform. Flight Mode AI orchestrates AI models and external APIs
end to end: describe a task, launch a run, monitor it live with automatic
fallback, and receive a polished, formatted result — with minimal input.

Built with **React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router,
TanStack Query, React Hook Form, Zod, Framer Motion, Recharts, and Lucide**.

> **Frontend only.** No backend, database, or auth is included. The service
> layer returns typed mock data and is designed so a **FastAPI AI Gateway** can
> be connected later without touching the UI.

## Features

- **Landing page** — hero with live workflow illustration, features, process
  timeline, AI providers, benefits, FAQ, and CTA sections.
- **Automation Workspace** — validated task composer (React Hook Form + Zod),
  templates, suggested prompts, provider selection, fallback toggle.
- **Live execution** — animated progress tracker, workflow timeline, streaming
  logs, retry + fallback simulation, elapsed time and ETA.
- **Result view** — rich markdown output (tables, code blocks, lists), copy /
  download / share, execution summary card, regenerate and new-run actions.
- **Executions** — searchable, filterable history with detail dialogs.
- **Analytics** — mock charts (execution trend, provider usage, success rate,
  steps by stage) via Recharts.
- **Settings** — theme, animations, default provider, notifications,
  accessibility, developer mode, keyboard shortcuts, reset.
- **About / Help / 404** — architecture overview, docs, and a polished
  not-found experience.
- **Design system** — Modern theme, light/dark modes with persistence,
  glassmorphism, motion presets, skeleton loaders, empty/error states, and a
  reusable component library.

## Getting started

```bash
bun install
bun run dev
```

Typecheck:

```bash
bun tsc -b --noEmit
```

## Project structure

```
src/
├── animations/     # Framer Motion variants & easings
├── components/
│   ├── automation/ # execution, timeline, logs, results, composer
│   ├── charts/     # Recharts wrappers
│   ├── common/     # stat cards, empty/error states, data table, palette
│   ├── feedback/   # modals, skeletons, success check
│   ├── forms/      # RHF field wrappers, multi-select
│   ├── landing/    # landing sections
│   ├── layout/     # sidebar, topbar, footer, mobile nav
│   └── ui/         # shadcn/ui primitives
├── constants/      # app metadata, nav, shortcuts, limits
├── contexts/       # settings provider (localStorage persistence)
├── data/           # mock templates, providers, executions, analytics
├── hooks/          # execution simulation, keyboard, theme, copy, pagination
├── icons/          # brand assets
├── layouts/        # app shell (AppLayout)
├── lib/            # utils, formatters, query client
├── pages/          # Landing, Workspace, Executions, Analytics, Settings, About, Help, NotFound
├── routes/         # route path constants
├── services/       # automationService, providerService, healthService (mock)
├── styles/         # scoped markdown styles
├── types/          # domain types
└── utils/          # automation engine, status maps, error helpers
```

## Service layer & gateway integration

Three placeholder services in `src/services/` expose typed, async APIs backed
by mock data:

| Service | Methods | Gateway endpoint (future) |
| --- | --- | --- |
| `automationService` | `getTemplates`, `getExecutions`, `getAnalytics` | `GET /templates`, `GET /runs`, `GET /analytics` |
| `providerService` | `getProviders`, `getProviderHealth` | `GET /providers`, `GET /providers/{id}/health` |
| `healthService` | `getGatewayHealth` | `GET /health` |

Set `VITE_API_BASE_URL` (see `.env.example`) to point at your gateway and swap
the mock bodies for `apiRequest(...)` calls — components already consume the
data through TanStack Query, so no UI changes are required. The execution view
is driven by `useExecutionSimulation`, which can be swapped for a WebSocket/SSE
subscription.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘K` | Command palette |
| `⌘N` | New automation |
| `⌘↵` | Start automation |
| `Esc` | Cancel running automation |
| `⌘⇧L` | Toggle theme |
| `/` | Jump to execution search |

## License

MIT
