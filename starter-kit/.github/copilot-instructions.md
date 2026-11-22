## Jira Spec Bridge Gatekeeper Rules

- Always retrieve the locked Spec Bridge specification (`get-locked-spec`) for the active Jira work item before generating implementation code.
- Implement every EARS behavioral requirement and Gherkin acceptance scenario verbatim, honoring all Parent Alignment Guardrails and Project Constitution invariants.
- Never implement any item listed in `Explicit Non-Goals` or `[Parked]`.
- If an undocumented API, permission, or database constraint blocks implementation, invoke `flag-implementation-gap` rather than guessing product behavior.
