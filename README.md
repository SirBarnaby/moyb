# MOYB – Map Of Your Body 🏋️‍♂️

Visualise the impact of every workout on an interactive human silhouette.

---

## 🚀 Quick Start
```
npm install
npm run dev
```

## 🗂️ Project Structure (AI-friendly)
```text
app/
  src/
    ├── api/                  # typed API clients & adapters
    ├── common/               # reusable pure utils (rgb, math, …)
    ├── core/                 # framework-free domain layer
    ├── features/             # vertical slices = UI + state + logic
    ├── router/               # vue-router setup
    ├── stores/               # pinia modules
    ├── ui/                   # presentational components
    └── main.ts               # app bootstrap
```
Each directory is deliberately small to keep LLM context windows happy.

## 📚 Domain Glossary
| Term | Description |
|------|-------------|
| **Muscle** | Contractile tissue unit. Represented by `core/muscle/Muscle.ts`. |
| **Exercise** | A mechanical stimulus applied to muscles. Represented by `core/exercise/Exercise.ts`. |
| **Volume** | Sets × Reps × Load accumulated for a Muscle within a timeframe. |
| **WorkoutPlan** | Aggregates Exercises into scheduled sessions. |

## 🧠 Vibecoding Primer
1. `core/` modules are **pure TS** with no Vue imports.
2. Components are ≤ 200 LOC and scoped to `features/` or `ui/`.
3. Complex files begin with a 3-line **AI-Primer** comment summarising intent & invariants.

Stick to these rules and ChatGPT will write maintainable code ✨.

## 📜 Useful Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run test` | Unit tests |
| `npm run typecheck` | `vue-tsc --noEmit` template type safety |
| `npm run lint` | ESLint + Prettier |
| `npm run storybook` | Interactive component docs |

## 📝 License
MIT

---
# moyb.
> Map-of-Your-Body.
>> Marten Saluste 230655IADB
---
#### I.
### Visualize the effects of your workout on a muscle silhouette of the human body. Create an even workout split, now with ease.
#### II.
To install this project, run `npm dev`.
#### III.
Features include:
- In-depth customization of the workout plan, with more than `XXXX` total exercises for every individual muscle of the human body.
- Very in-depth breakdown of the characteristics of each exercise, including:
    - Equipment required,
    - Movement type, (eccentric, concentric, isometric)
    - Rated injury risk of an exercise
    - Range of motion in degrees,
    - Joint stress factor,
    - CNS fatigue potential,
    - *Whether:* the exercise is unilateral,
    - *Whether:* the exercise has a high spinal load
- Very in-depth breakdown of each muscle of the body, including:
    - Dominant fiber type,
    - Endurance rating,
    - Recovery time rating,
    - Neural drive sensitivity,
    - Motor unit recruitment speed,
    - Eccentric strength,
- Also an actionale breakdown of the function of each muscle in the exercise, including:
    - *Whether:* the muscle is a primary or secondary mover.
    - Contraction type,
    - Fatigue accumulation,

#### IIII.
This app allows configuration.
Dark mode, etc.
---
#### V.
SW used during the project: N8N, PhpStorm, Notepad++, Google Apps, Microsoft Apps.

#### VI.
License: MINE