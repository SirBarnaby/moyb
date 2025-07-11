# 0002 – Introduce Framework-Free Domain Core Layer

**Status:** Accepted 2025-07-05

## Context
Workout entities (`Exercise`, `Muscle` …) were originally authored as Vue-decorated classes inside the DAL. This introduced unwanted coupling between UI framework and pure business logic, hindering reuse and static analysis.

## Decision
Adopt a **DDD-inspired `core/` package**:
- Move raw data models to `core/exercise`, `core/muscle`, `core/workout`.
- Represent entities as `class`/`interface` pairs with readonly fields & factory helpers.
- Zero runtime dependencies on Vue, Pinia or browser APIs.

## Consequences
+ Full type-safety in tests and Node scripts.
+ Enables zod schema validation without Vue bundling.
+ AI models can process the domain in isolation.

## Trade-offs
− Slight duplication of DTO ↔ API mapping code (handled by `api/` adapters).

## Follow-up
Document public surface via Typedoc generated in `DOCS_MODE=true` build.
