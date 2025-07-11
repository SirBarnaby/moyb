# 0003 – Normalise State with Pinia Feature Stores

**Status:** Accepted 2025-07-05

## Context
State mutations used to happen directly inside UI components scattering logic and hampering debugging. Additionally, unrelated data lived via global stores increasing coupling.

## Decision
1. Create **feature-scoped Pinia stores** (`useExerciseStore`, `useMuscleStore` …).
2. Encapsulate all mutations within **actions**; UI dispatches verbs, never commits.
3. Export typed selectors instead of exposing raw refs.

## Consequences
+ Predictable state flow, easy time-travel debugging.
+ LLMs operate on narrowly scoped stores.
− Boilerplate for action definitions.

## Follow-up
Create ESLint rule to forbid `$store` access inside components outside of stores.
