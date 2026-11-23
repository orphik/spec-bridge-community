# Stress Test 01 — The Three-Author "Franken-PRD" (Bulk CSV Team Invites)

## Raw Input (Copy-Paste Into Ticket / Confluence)

```markdown
## Growth PM Overview
Workspace Members and Admins can bulk-upload a CSV of up to 5,000 email addresses to invite teammates in one click. Invited users get immediate read/write workspace access as soon as the CSV upload finishes for zero-friction viral onboarding.

## Security Addendum (Added by SecOps)
Only Organization Owners may invite external email domains. No invited user may view any workspace resource until they click a 15-minute verification link AND pass SAML SSO enforcement. CSV uploads must be capped at 100 rows per request to prevent spam abuse.

## Finance & Billing Note
Every email row in an uploaded CSV immediately increments billed monthly seats on upload—except External Guests, who are free forever unless they open more than 3 boards in a month, which retroactively converts them into a paid annual seat.
```

---

## What Literal Execution Ships (If Unchecked)
1. **Billing Rejected or Unverified Seats:** Parses a 5,000-row upload, increments Stripe seat count by 5,000 on line 40, and then rejects rows `101..5000` in the Security middleware—charging the customer for 4,900 failed invites.
2. **Broken Onboarding State:** Grants immediate read/write DB membership per Paragraph 1 while blocking every API read in SAML middleware per Paragraph 2, locking invited users into an infinite 403 redirect loop.
3. **Silent Partial Failure:** No specification for duplicate emails, malformed CSV rows, or idempotent retries if the user re-uploads a fixed CSV.

## Upstream Decisions Required Before Sprint Lock
- **Row Cap & Batching (`@PM` + `@TechLead`):** Does SecOps's `100-row` hard HTTP 422 cap override Growth's `5,000-row` target, or do we accept async chunked background batches?
- **Access & Seat Billing Trigger (`@PM` + `@Finance`):** Confirm seats bill *only* upon verified invite redemption (never on raw CSV parse) and define exact External Guest conversion confirmation.
- **Role Matrix (`@TechLead`):** Lock exact RBAC matrix (`Member` vs `Admin` vs `Org Owner`) for same-domain vs external-domain rows in mixed CSVs.
