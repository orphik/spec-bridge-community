# Privacy Policy — Spec Bridge for Jira Cloud

**Effective Date:** November 22, 2026  
**Publisher:** Orphik

Spec Bridge is a **100% Runs on Atlassian** application built exclusively on the Atlassian Forge platform with **zero external data egress**.

---

## 1. Zero Personal Data Collection or Storage

Spec Bridge **does not collect, copy, or store personal data** (such as user names, email addresses, IP addresses, or persistent Atlassian Account IDs) in its application database or in any external vendor system.

## 2. How Project & Issue Content Is Processed

- **In-Platform Processing Only:** Confluence pages and Jira work items analyzed by Spec Bridge are processed strictly within Atlassian Cloud's managed Forge runtime (`@forge/api`, `@forge/llm`, and tenant-isolated `@forge/sql`).
- **Zero External Network Egress:** Spec Bridge declares no external network remotes. Customer data never transits to Orphik-operated servers or third-party external APIs.
- **No AI Model Training:** Customer content processed through Atlassian's hosted Forge LLM service is never used by Orphik to train machine learning models.

## 3. Data Retention & Deletion

All Project Constitutions, Decision Cards, and Compiled Specifications reside exclusively inside your Atlassian Cloud tenant's isolated Forge SQL storage and are automatically deleted by Atlassian when the application is uninstalled in accordance with Atlassian Forge data retention lifecycles.

## 4. Contact

For privacy or security inquiries, contact us via our [Customer Support Portal](https://orphik.atlassian.net/helpcenter/SUP/contact-us).
