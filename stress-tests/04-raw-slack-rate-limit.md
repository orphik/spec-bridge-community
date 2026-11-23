# Stress Test 04 — The Unresolved `#eng-product` Slack Thread (API Rate Limiting)

## Raw Input (Copy-Paste Into Jira Story)

```text
Summary: Public REST API v2 Rate Limiting & Retry Headers
Description:
context from #eng-product slack:
@dan (pm): enterprise customers keep hitting 502s when one noisy CI runner hammers GET /v2/deployments. need rate limits asap
@priya (be): per API key or per workspace?? some enterprise orgs run 25 CI keys concurrently
@dan: prob per workspace? idk maybe 1000 req/min for Pro and 5000 req/min for Enterprise?? what about burst?
@alex (cs): pls dont hard-drop without headers!! customer SDKs need Retry-After and X-RateLimit-Remaining
@priya: also what if Redis blips for 2s—fail open or fail closed?? TBD lets lock before coding
```

---

## What Literal Execution Ships (If Unchecked)
1. **Guesses the Unresolved `"TBD"` Silently:** Picks fail-closed on Redis timeout (taking down 100% of API traffic whenever Redis restarts for 2 seconds) OR picks per-workspace without per-key sub-buckets so 1 runaway CI runner starves all 24 other production pipelines in an Enterprise org.
2. **Clobbers Human Context:** Naive ticket-rewriting tools overwrite the original Slack thread in Jira, destroying the engineering context behind *why* the ticket was opened.

## Upstream Decisions Required Before Sprint Lock
- **Bucket Scope (`@PM` + `@TechLead`):** Lock hierarchical quota (e.g. workspace ceiling + per-API-key burst limit so one key cannot starve siblings).
- **Redis Failure Posture (`@TechLead`):** Explicitly lock **fail-open with structured metric alert** (or local in-memory fallback) during transient Redis blips.
- **Standardized HTTP 429 Contract (`@TechLead`):** Lock exact `Retry-After` (seconds), `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` header semantics.
