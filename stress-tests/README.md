# Six Messy Specs — Pre-Code Stress Tests for Humans & Coding Agents

Most AI coding demos start with a clean, self-contained prompt. Real sprint work rarely looks like that.

In real engineering orgs, tickets arrive as a Confluence doc edited by three departments over six weeks, an unresolved Slack thread ending in `"TBD"`, an urgent Friday escalation email, or a two-sentence happy-path request.

This folder contains **six synthetic specs** modeled on recurring enterprise handoff failures, paired with:
1. **The Raw Input** — Copy-paste directly into your coding agent (Cursor, Claude Code, Copilot) or pre-flight workflow to see what it catches vs. what it silently ships.
2. **What Literal Execution Ships** — The specific production bugs that happen when nobody forces the Product ↔ Engineering trade-off before code is written.
3. **The Upstream Pre-Flight Questions** — The exact business and technical decisions that have to be locked before sprint commitment.

---

## Stress-Test Index

| Spec File | Failure Pattern | Hidden Production Traps |
| :--- | :--- | :--- |
| [`01-contradictory-csv-invite.md`](./01-contradictory-csv-invite.md) | **Three-Author "Franken-PRD"** (Growth vs. SecOps vs. Finance) | Row-cap mismatch (`5,000` vs `100`), instant access vs. SAML verification, billing rejected rows on upload |
| [`02-webhook-scope-creep.md`](./02-webhook-scope-creep.md) | **Kitchen-Sink Scope Creep** ("If time permits" brainstorm bullets) | Gold-plating 6 Phase-2 features into an MVP sprint, unbounded webhook payload timeouts, missing replay protection |
| [`03-one-sentence-epic.md`](./03-one-sentence-epic.md) | **1-Sentence Executive Drop** (Zero thresholds or roles) | Invented anomaly math, alert storms across free/paid tiers, missing cooldown & notification channel rules |
| [`04-raw-slack-rate-limit.md`](./04-raw-slack-rate-limit.md) | **Unresolved `#eng-product` Slack Thread** | Per-key vs. per-workspace ambiguity, burst starvation, Redis outage fail-open vs. fail-closed |
| [`05-urgent-sso-bypass.md`](./05-urgent-sso-bypass.md) | **Friday Churn-Panic Escalation** (Compliance landmine) | Unauthenticated `?bypass_sso=true` query-string backdoor, unconsented support impersonation without audit trail |
| [`06-delete-organization.md`](./06-delete-organization.md) | **2-Sentence Destructive Happy Path** | Orphaned active Stripe subscriptions still billing monthly, hard SQL cascade wiping 7-year audit logs, accidental single-click nuke |

---

## How to Run These Against Your Setup

1. **Test your local repo referee:** Run [monkey-paw](https://github.com/orphik/monkey-paw) (MIT open-source CLI/skill) or our [`starter-kit` rules](../starter-kit) against any file above inside a test repository and check how many of the listed traps your agent stops and flags before writing code.
2. **Test upstream inside Jira Cloud & Confluence:** Paste any of the six inputs into a Jira Epic, Feature, or Story running [**Spec Bridge**](https://marketplace.atlassian.com/apps/562168567) (`100% Runs on Atlassian`) to inspect the `0–100` Readiness score, paired `@PM` / `@TechLead` Decision Cards, and Non-Goals Parking Lot.
