# Stress Test 02 — Kitchen-Sink Scope Creep (Webhook Subscriptions)

## Raw Input (Copy-Paste Into Ticket / Confluence)

```markdown
## Core Goal
Let Workspace Admins register up to 10 HTTPS webhook URLs per workspace for `deployment.succeeded`, `deployment.failed`, and `invoice.paid` events, signed with `X-Acme-Signature-256` HMAC-SHA256 and retried up to 5 times with exponential backoff, plus a 7-day delivery log table.

## Brainstorm Ideas (If Time Permits)
Maybe we could also ship an AI natural-language JSON payload transformer, native WhatsApp/Discord/Telegram bots, a visual drag-and-drop Zapier workflow builder, custom mutual-TLS client certificates, GraphQL live subscriptions, and a public community webhook marketplace this sprint.
```

---

## What Literal Execution Ships (If Unchecked)
1. **Massive Sprint Gold-Plating:** Coding agents treat `"If Time Permits"` sections as active requirements, scaffolding half-working Discord/Telegram bot stubs, fake LLM prompt transformers, and unused GraphQL schemas across 35 files.
2. **SSRF & Timeout Vulnerability:** Meanwhile, the core HTTPS webhook dispatcher lacks private-IP SSRF blocking (`169.254.169.254` / `10.0.0.0/8`), per-attempt request timeout bounds (e.g. 5s), and timestamp replay headers.

## Upstream Decisions Required Before Sprint Lock
- **Quarantine Brainstorm Tangents (`Non-Goals Parking Lot`):** Explicitly move all 6 Phase-2 brainstorm items into Out-of-Scope Non-Goals so neither human scope creep nor coding agents touch them.
- **SSRF, Timeout & Dead-Letter Policy (`@TechLead`):** Lock outbound private-subnet blocklist, strict delivery timeout, backoff schedule, and auto-disable threshold after repeated 5xx failures.
