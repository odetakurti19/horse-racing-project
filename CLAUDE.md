# Horse Racing Game — Claude Code Guide

This file tells Claude Code how this project is structured, what conventions to follow, and what pitfalls to avoid. Read this before making any changes.

---

## Stack

- **Vue 3** + `<script setup>` Composition API — never use Options API
- **TypeScript** — all files are `.ts` or `.vue` with `<script setup lang="ts">`
- **Vuex** for state management
- **Vite 8** as the build tool
- **PrimeVue 4** as the UI component library (`@primeuix/themes` for theming)
- **Tailwind CSS 4** for utility-first styling
- **Vitest** + `@vue/test-utils` for unit tests

---

## Project Structure

```
src/
├── components/       # Presentational Vue components (one responsibility each)
├── composables/      # Reusable reactive logic (useXxx naming convention)
├── stores/           # Vuex stores (one store per domain)
├── types/            # Shared TypeScript interfaces — index.ts is the entry point
├── utils/            # Pure functions, no Vue reactivity, fully testable
├── views/            # Page-level Vue components (routed or top-level)
├── test/             # All test files live here
├── App.vue           # Root layout + game orchestration (watchers live here)
├── main.ts           # App bootstrap only
└── style.css         # Tailwind import, @theme tokens, @keyframes
```

---

## Key Conventions

### Components

- Always `<script setup lang="ts">` — no Options API
- Props via `defineProps<Interface>()`, emits via `defineEmits<{ name: [type] }>()`
- All interactive/important DOM elements need `data-testid="..."` for tests
- Scoped styles only (`<style scoped>`)
- Use CSS custom properties — never hardcode colors

### Stores (`src/stores/`)

- Split into `horseStore.ts`, `raceStore.ts`, and `index.ts` (root store)
- Each module uses Vuex `Module<State, RootState>` with `namespaced: true`
- State = plain object factory, Mutations = synchronous state changes, Actions = commit mutations
- Dispatch actions as `store.dispatch('horse/generateHorses')` / `store.dispatch('race/startRace')`
- Status machine: `idle → scheduled → running ↔ paused → finished`
- No `setInterval`, animations, or async side effects inside store actions

### Composables (`src/composables/`)

- Named `useXxx.ts`
- Handles side effects (setInterval, animations) that don't belong in the store
- Must expose a `cleanup()` function for teardown

### Types (`src/types/index.ts`)

- All shared interfaces live here — `import type { Horse } from '@/types'`

### Utils (`src/utils/`)

- `horse.ts` — all horse and schedule logic: `generateHorses`, `buildSchedule` (Fisher-Yates shuffle), `computeFinishTime`, `createHorse`, `createRound`
- `constants.ts` — shared constants (`RACE_STATUS`, `TOTAL_ROUNDS`, `ROUND_DISTANCES`, etc.)
- Pure functions only — no Vue refs, no store access
- Fully unit-testable without Vue context

---

## Testing

### Run tests

```bash
yarn test                # run once
yarn test:watch      # watch mode
yarn test:coverage   # with coverage
```

### Critical: Vuex isolation in component tests

Every component test must create its own Vuex store instance. Do NOT rely on the global setup:

```ts
// CORRECT
const store = createStore({ ... })
const wrapper = mount(MyComponent, { global: { plugins: [store] } })

// WRONG — component uses a different store instance than the one you mutated
const store = useStore()
store.dispatch('generateProgram')
const wrapper = mount(MyComponent)  // gets a fresh store, ignores state above
```

### Fake timers for animation tests

```ts
beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

const promise = startAnimation(1200)
vi.runAllTimers()
const result = await promise
```

---

## Vite 8 / tsconfig Gotcha

This project uses a **single flat `tsconfig.json`** — intentionally, no project references. Vite 8's oxc transformer requires every file to be covered by a tsconfig found via directory walk. Splitting into `tsconfig.app.json` + `tsconfig.node.json` with `"references"` breaks test files with:

```
[TSCONFIG_ERROR] Failed to load tsconfig for 'src/test/setup.ts': Tsconfig not found
```

Do not add project references.

---

## Tailwind CSS

This project uses **Tailwind CSS 4** (Vite plugin via `@tailwindcss/vite`). Use utility classes directly in templates:

```html
<div class="flex items-center gap-2 rounded-lg px-4 py-2"></div>
```

- Prefer Tailwind utilities over writing custom CSS wherever possible
- For one-off values not covered by utilities, use CSS custom properties (see below)
- Do **not** use `@apply` — compose utilities in the template, not in CSS
- Tailwind is configured via `style.css` using `@import "tailwindcss"` (v4 syntax) — there is no `tailwind.config.js`

---

## CSS Tokens

Use CSS custom properties from `style.css`, never hardcode values:

```css
color: var(--text-primary);
background: var(--panel-bg);
border: 1px solid var(--border-color);
```

Key tokens: `--accent-gold`, `--panel-bg`, `--track-bg`, `--text-primary`, `--text-muted`, `--border-color`, `--border-subtle`

---

## Game Flow

```
idle ──[horse/generateHorses + race/generateSchedule]──→ scheduled
                                                           └──[race/startRace]──→ running
                                                                                   ├──[race/pauseRace]──→ paused ──[race/startRace]──┐
                                                                                   │                                                  │
                                                                                   └──[race/completeRound × 6]──→ finished            │
                                                                                   ←─────────────────────────────────────────────────┘
```

- `RaceView.vue` watches `store.state.race.status`, calls `runRound()` when it becomes `'running'`
- `runRound()` calls `computeFinishTime(horse, distance)` per horse, drives animation via `useRaceAnimation.start()`
- When the animation Promise resolves, results are sorted and dispatched via `race/completeRound`
- `completeRound` auto-advances: `runRound()` is called recursively until status is no longer `'running'`

---

## Path Alias

Always use `@/` for internal imports (maps to `src/`):

```ts
import { useStore } from "@/stores"
import type { Horse } from "@/types"
```

Never use relative paths like `../../stores/index`.
