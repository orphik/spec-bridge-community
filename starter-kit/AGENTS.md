# Spec-Driven Development (SDD) Protocol — Spec Bridge + Jira MCP

Before writing or modifying application code for any Jira work item (e.g., `PROJ-123`):

1. **Pull the Canonical Locked Spec First:**
   Retrieve the locked Spec Bridge contract via `get-locked-spec` (`format: "speckit"` or `"markdown"`), or read the canonical Spec Bridge block from the Jira work item.
   - If the spec status is `DRIFTED` or `DRAFT`, **STOP** and ask the user to resolve open Decision Cards in Jira before writing implementation code.
2. **Enforce All Parent & Constitution Guardrails:**
   - Implement every `EARS` behavioral requirement (`WHEN / IF / WHILE ... THE SYSTEM SHALL ...`) and `Inherited Guardrail` without omission.
   - **NEVER** implement or scaffold any feature listed under `Explicit Non-Goals (Out of Scope)` or `[Parked]`.
3. **Fail Closed on Undocumented Codebase Constraints:**
   - If you discover a database schema limit, third-party API constraint, or architectural conflict not covered by the spec, **DO NOT GUESS** product behavior.
   - Invoke `flag-implementation-gap` on the Jira issue with `gapTitle`, `technicalFinding`, and `pmQuestion` so Product and Engineering can lock the decision in Jira.
4. **Verify Every Gherkin Scenario Before Completion:**
   - Ensure automated tests cover every Gherkin `GIVEN / WHEN / THEN` scenario and `Verification Checklist` item in the locked contract.
