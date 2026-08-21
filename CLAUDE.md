# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## What this is

Citrus is the Vue 3 / Vite web UI for the [Lemonade](https://github.com/eubr-bigsea/lemonade) data platform. It's a pure frontend: all data lives behind a set of backend microservices it talks to over HTTP/WebSocket (URLs supplied via env vars, see below). It is not meant to run standalone — point it at a running Lemonade backend.

## Commands

- `npm run dev` — Vite dev server on port 8081
- `npm run build` — production build
- `npm run serve` — preview a production build
- `npm run lint` — ESLint over `.js`/`.vue`, auto-fixes
- `npm test` — runs `vitest`, but the script's `--root src/tests` points at a directory that doesn't exist and the only test-like files in the repo are Cypress specs (`*.cy.js`), not `*.spec.js`; treat this script as currently non-functional rather than the real test entry point
- `npm run coverage` — `vitest run --coverage` (same caveat as above)
- `npx cypress run` / `npx cypress open` — e2e specs in `cypress/e2e/*.cy.js` (needs `npm run dev` running at `localhost:8081`, plus a reachable Tahiti/Stand backend — see `cypress.config.js`)
- `npx cypress run --component` / `npx cypress open --component` — component specs in `tests/unit/views/pipeline/*.cy.js`
- `npm run storybook` / `npm run build-storybook` — component storybook (port 6006)
- `jest.config.js` at the repo root is a leftover from an older Vue CLI setup; Jest isn't a dependency and nothing runs it.

### Local env config

Dev server needs an `env.development` file (not committed) pointing at a Lemonade backend's microservices — `VITE_LIMONERO_URL`, `VITE_STAND_URL`, `VITE_TAHITI_URL`, `VITE_THORN_URL`, `VITE_CAIPIRINHA_URL`, `VITE_SEED_URL`, plus `VITE_STAND_NAMESPACE`/`VITE_STAND_SOCKET_IO_PATH`/`VITE_STAND_SOCKET_IO_SERVER` for the Socket.IO connection to Stand. Template is in README.md.

## Architecture

- **`src/main.js`** — single bootstrap: creates the Vue app, globally registers all `src/components/widgets/*` form components, wires up vue-i18n (`src/i18n/messages.js`), the router, the Vuex store, notifications, and FontAwesome icons. Most app-wide wiring lives here rather than in separate plugin files.
- **`src/router.js`** — one flat ~1000-line route table mapping every route directly to a view under `src/views/`; there's no per-feature route module.
- **`src/store.js`** — a single flat (non-namespaced) Vuex store: auth/login/register/password-change, profile, and the Socket.IO event bridge to Stand.
- **`src/services/`** (`limonero.js`, `stand.js`, `workflow.js`) — thin axios clients per backend microservice, base URLs from the `VITE_*_URL` env vars. `src/tahiti.js` is a different pattern: it dynamically loads an external Tahiti script rather than calling it through axios — treat it as a separate legacy integration point.
- **`src/openid-auth.js`** — OIDC (`oidc-client`) login flow, separate from and in addition to the store's own username/password login.
- **`src/views/`** — one component per route, grouped by feature: `Administration/` (users, roles, clusters, platforms, storage), `data-explorer/` (the largest subtree — `model-builder/` is the ML pipeline wizard, `sql-workflow/` is the SQL/Python code-step editor, `peel-platform/` is explanation/XAI screens), `modal/` for modal-only views. Workflow/pipeline editing (`WorkflowEdit.vue` + `src/components/Diagram.vue`, `Toolbox.vue`, `PropertyWindow.vue`) renders the node/wire canvas with jsPlumb (`src/jsplumb-const.js`) and auto-layouts with dagre.
- **`src/components/widgets/`** — dynamic form-field components (Cast, Join, Filter, Range, Color, Date, Select2, ...) driven by a task/operation's metadata; registered globally in `main.js`, shared behavior lives in `src/mixins/Widget.js`.
- **`src/components/visualization/`** + **`src/components/caipirinha-visualization/`** — chart rendering for dashboards. `CaipirinhaVisualization.vue` dispatches to a specific chart component (`BarChart`, `LineChart`, `PieChart`, `Plotly`, `Heatmap`, `Treemap`, etc.) by visualization type; used by `DashboardBuilder.vue`/`DashboardDetail.vue`.
- **`src/mixins/`** (Options API) vs **`src/composables/`** (Composition API, e.g. `useNotifier.js`) — the codebase is mid-migration between the two patterns; prefer composables in new code.

## Git commits

- Never include Claude or any AI attribution in git commits. Remain anonymous at all times in regards to git. Do not use co-authored-by tags or any other form of attribution.
- Keep commit messages concise — tokens cost money. One-line subject only; add a body only if truly necessary, and keep it to 1-2 short lines, not a full explanation of the change.
