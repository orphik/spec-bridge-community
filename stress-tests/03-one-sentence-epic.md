# Stress Test 03 — The 1-Sentence Executive Drop (Spend Anomaly Alerts)

## Raw Input (Copy-Paste Into Jira Epic)

```text
Summary: AI Smart Spend Anomaly Alerts for Workspace Admins
Description: Customers keep getting surprised by cloud usage spikes at month-end. Let's add AI smart anomaly alerts to the billing dashboard and notify admins fast before renewal season. Needs to work across all plans.
```

---

## What Literal Execution Ships (If Unchecked)
1. **Arbitrary Hardcoded Thresholds:** Invents a naive `today > yesterday * 1.5` SQL check (calling it "AI") that spams false-positive emails every Monday morning after a quiet weekend.
2. **Alert Storm Without Deduplication:** Sends an email on every cron tick (every 5 minutes) with no per-incident cooldown or opt-out preference.
3. **Free-Tier Cost Leak:** Runs expensive background aggregation across thousands of inactive `$0` sandbox workspaces because *"Needs to work across all plans"* wasn't bounded.

## Upstream Decisions Required Before Sprint Lock
- **Detection Rule vs. Probabilistic Model (`@PM` + `@TechLead`):** Define whether MVP uses deterministic rolling 7-day baseline + dollar floor (e.g. `> 2x trailing 7-day average AND > $50 delta`) vs. custom ML.
- **Notification Channels & Cooldown (`@PM`):** Lock exact recipients (`Billing Admin` vs all `Admins`), delivery channels (in-app banner + email), and 24-hour per-workspace alert deduplication.
