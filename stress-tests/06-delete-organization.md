# Stress Test 06 — The 2-Sentence Destructive Happy Path ("Delete Organization")

## Raw Input (Copy-Paste Into Jira Feature / Story)

```text
Summary: Self-Serve "Delete Organization" Button in Admin Console
Description: Add a red "Delete Organization" button at the bottom of Organization Settings. When an Admin clicks it and confirms in a modal, delete the organization and redirect them to the homepage.
```

---

## What Literal Execution Ships (If Unchecked)
1. **Zombie Billing After Deletion:** Executes `DELETE FROM organizations WHERE id = $1` without canceling active Stripe subscriptions or issuing prorated final usage—charging a deleted customer's corporate card on the 1st of next month while they can no longer log in to cancel.
2. **Compliance Audit Destruction:** Hard-cascades foreign keys across `audit_logs` and `invoices`, violating tax and SOC2 7-year retention rules.
3. **No Recovery Window or Role Separation:** Allows any standard Workspace Admin (rather than Billing/Org Owner with step-up re-authentication and org-slug typing confirmation) to permanently destroy production data in two clicks with zero 14-to-30-day soft-delete recovery grace period.

## Upstream Decisions Required Before Sprint Lock
- **Soft-Delete Grace Period vs. Hard Purge (`@PM` + `@TechLead`):** Lock 30-day `PENDING_DELETION` soft-delete window before irreversible background purge, while preserving anonymized billing/compliance ledger rows.
- **Billing & Active Session Teardown (`@TechLead`):** Cancel Stripe subscriptions atomically before marking deleted, revoke all active API keys/webhooks/sessions within 10 seconds, and notify all Org Owners via email.
- **Step-Up Confirmation (`@PM`):** Restrict action strictly to `Organization Owner` with recent re-auth + exact organization slug confirmation.
