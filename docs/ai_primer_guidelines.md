# AI-Primer Guidelines

> How to annotate source files so GPT models instantly grasp intent, invariants and contracts.

## What is an AI-Primer?
A 2-3 line HTML/JS/TS comment placed at the very top of a source file, summarising:
1. **Purpose** – the single responsibility of the module/component.
2. **Invariants / Assumptions** – critical facts that always hold true.
3. **Side-effects & Boundaries** – e.g. "no network calls", "pure function".

Example (Vue SFC):
```vue
<!-- AI-PRIMER: ExerciseSelector.vue
  Purpose: Presents UI controls for choosing an Exercise by muscle or search.
  Invariants: Relies on Pinia `useAllExercisesStore`; no direct DOM queries. -->
```

## Authoring Rules
* Keep it **≤ 300 characters** – fits in token limits.
* Use simple vocabulary, avoid project-specific slang.
* Prefer bullet-like style; do not wrap at 80 chars.
* Update the primer whenever behaviour or invariants change.

## When to add?
* Any file > 100 LOC **or** complex algorithm.
* Public entry points (`index.ts` barrels).
* Components shared across features.

Following these rules keeps the codebase self-describing for both humans and LLMs.
