# Security & Data Residency Overview — Spec Bridge

Spec Bridge is architected from the ground up as a **100% Runs on Atlassian** cloud application.

## Core Security Guarantees

1. **Zero External Network Egress:**
   Spec Bridge declares **zero** external `fetch` or backend egress permissions. Your Confluence PRDs, Jira work items, Acceptance Criteria, and Project Constitutions never leave Atlassian Cloud infrastructure.
2. **Atlassian-Hosted AI & Isolated Storage:**
   All specification analysis and compilation run inside Atlassian Forge's managed runtime and tenant-isolated storage. Customer content is never sent to external third-party servers or used to train public models.
3. **Zero Source Code Required:**
   When engineers attach brownfield repository context (`push-repo-surface`), only lightweight file paths and 1-line module summaries are stored—never proprietary source code.

## Reporting a Security Concern

Please **do not** disclose suspected security vulnerabilities in public GitHub issues. Submit a confidential report directly through our private [Enterprise Support Portal](./SUPPORT.md) marked **Severity 1 — Security** for a response within **4 business hours**.
