---
name: OpenAPI codegen quirks
description: Pitfalls when editing lib/api-spec/openapi.yaml and consuming generated hooks in this workspace
---

- Rule: never use `type: integer` in the OpenAPI spec; use `type: number`.
  **Why:** Orval emits zod-v4 `z.int()` for integers, which fails against the workspace zod version at typecheck/runtime.
  **How to apply:** whenever adding numeric fields to `lib/api-spec/openapi.yaml` before running codegen.

- Rule: when passing custom query options (e.g. `refetchInterval`) to generated `useList*` hooks, you must also pass `queryKey: getList*QueryKey()` — the options type requires it.
  **Why:** typecheck fails with "Property 'queryKey' is missing" otherwise; hit on 6 components at once.
  **How to apply:** any frontend component using generated hooks with a `query: { ... }` options object.
