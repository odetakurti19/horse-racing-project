# Horse Racing Game

An interactive horse racing simulation game built with Vue 3, Vuex, and Vite — developed as a frontend case study.

---

## Features

- **20 horses** with unique names, colors, and condition scores (1–100)
- **6-round race schedule** with distances 1200m → 2200m
- **10 randomly selected horses** per round
- **Live animated horse movement** on a multi-lane track
- **Real-time results** panel populated as each race ends
- **Program panel** showing upcoming lineups per round
- **Pause/Resume** functionality
- **Responsive layout** (mobile-friendly)
- **Dark, elegant UI** with gold racing aesthetic

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Vue 3** | UI framework |
| **Composition API (`<script setup>`)** | Modern component authoring |
| **TypeScript** | Type safety throughout |
| **Vuex 4** | State management |
| **Vite 8** | Dev server + build tooling |
| **PrimeVue 4** | UI component library |
| **Tailwind CSS 4** | Utility-first styling |
| **Vitest** | Unit test runner |
| **@vue/test-utils** | Vue component testing |
| **Playwright** | End-to-end testing |

---

## Project Structure

```
src/
├── components/
│   ├── horse/
│   │   ├── HorseCard.vue
│   │   └── HorseList.vue
│   ├── race/
│   │   ├── ControlPanel.vue
│   │   ├── HorseIcon.vue
│   │   └── RaceTrack.vue
│   └── results/
│       ├── ResultsPanel.vue
│       └── RoundResult.vue
├── composables/
│   └── useRaceAnimation.ts
├── stores/
│   ├── horseStore.ts
│   ├── raceStore.ts
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   ├── constants.ts
│   ├── horse.ts
│   ├── horseGenerator.ts
│   ├── raceUtils.ts
│   └── scheduleGenerator.ts
├── views/
│   └── RaceView.vue
├── test/
│   ├── setup.ts
│   ├── components/
│   ├── composables/
│   ├── stores/
│   └── utils/
├── App.vue
├── main.ts
└── style.css
```

---

## Getting Started

```bash
yarn install
yarn dev        # Development server
yarn build      # Production build
yarn preview    # Preview production build
```

---

## Testing

```bash
yarn test                # Run all unit tests
yarn test:watch          # Watch mode
yarn test:coverage       # Coverage report
yarn test:e2e            # End-to-end tests (Playwright)
```

---

## How to Play

1. **Generate Program** — Creates 20 horses and a 6-round schedule
2. **Start** — Begins the first race with animated horse movement
3. **Watch** — Horses animate across 10 lanes; results appear after each race
4. **Pause / Resume** — Pause at any time
5. **Rounds auto-advance** — After each race the next begins automatically
6. **Reset** — After 6 rounds, reset to start over

---

## Architecture

### Vuex Store (`stores/`)
Split into `horseStore` and `raceStore` modules, combined in `index.ts`. Single source of truth for all game state.

### Animation Composable (`composables/useRaceAnimation.ts`)
Deliberately decoupled from the store. Manages per-frame progress, finish order tracking, and timer cleanup.

### Deterministic Simulation
Finish order is **precomputed** before animation. Animation speeds are derived from that order so the visual result always matches the stored result. Condition score + randomness determines outcome.

### Component Architecture
```
App.vue (orchestrator + watcher)
├── ControlPanel   → emits: generate | start | pause | reset
├── HorseList      → reads: store.horses
├── RaceTrack      → props: racingHorses, finishedCount
└── ResultsPanel   → reads: store.results
```

### Status Machine
```
idle → scheduled → running ↔ paused → finished
```
