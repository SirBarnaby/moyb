# 0001 – Extract Anatomy Viewer into Modular Components

**Status:** Accepted 2025-07-05

## Context
The initial implementation of the body visualisation lived in a single `Human.vue` component (~750 LOC) mixing SVG markup, business rules, state management and direct DOM manipulation. This made iterative development, automated testing and LLM-assisted edits increasingly fragile.

## Decision
Split the monolith into focused pieces:

| New File | Responsibility |
|----------|---------------|
| `features/anatomy-viewer/AnatomySvg.vue` | Pure SVG path rendering with no side effects |
| `features/anatomy-viewer/MuscleClickOverlay.vue` | Captures click/touch events and emits `muscle-selected` |
| `features/anatomy-viewer/useMuscleHighlight.ts` | Composable that converts reactive muscle volumes → computed tint classes |

Guidelines enforced:
1. **<200 LOC per component** to keep GPT context small.
2. Framework-free business logic extracted to composables.
3. No direct `document.getElementById`; use Vue refs and class bindings.

## Consequences
+ Improved testability and tree-shaking
+ Easier AI reasoning on isolated concerns
− Small overhead in prop drilling between sub-components

## Follow-up
Record visual regression snapshots in Storybook once phase 04 docs land.
