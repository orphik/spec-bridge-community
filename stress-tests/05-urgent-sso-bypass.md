# Stress Test 05 — The Friday Churn-Panic Escalation (`?bypass_sso=true`)

## Raw Input (Copy-Paste Into Ticket / Confluence)

```markdown
Forwarded from VP Sales — Top renewal account is threatening to churn!!
1. Support reps waste too much time asking customers for screenshots. Add a "Login as User" button in our internal Admin tool so any Support rep can click into any enterprise customer's dashboard immediately without bothering the customer.
2. Also last week their Okta cert expired and locked their CEO out for 2 hours. Add a hidden `?bypass_sso=true` URL query parameter so users can still log in with a regular password whenever their SSO provider is having issues. Need this live by Friday!!
```

---

## What Literal Execution Ships (If Unchecked)
1. **Authentication Bypass Vulnerability (SOC2 / CISO Nightmare):** Implements `if (req.query.bypass_sso === 'true')` literally—allowing any phished password or credential-stuffing attack to bypass mandatory Enterprise SAML/OIDC enforcement via a public URL parameter.
2. **Unconsented, Unaudited PII Access:** Gives every Tier-1 support account unrestricted silent session impersonation across regulated Healthcare/Financial tenants with zero customer approval or immutable audit trail.

## Upstream Decisions Required Before Sprint Lock
- **Reject Query-String Auth Bypass (`@SecOps` + `@PM`):** Replace `?bypass_sso=true` with an IdP-independent **Emergency Break-Glass Admin Recovery flow** (pre-designated org owner + hardware MFA + out-of-band verification).
- **Tenant-Consented Support Access (`@SecOps` + `@TechLead`):** Require explicit customer opt-in ("Grant Support Access for 1 Hour"), time-boxed read-only token, visible banner, and append-only audit log entry on every action.
