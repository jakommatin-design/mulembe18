# 07. Security, Privacy & KDPA Compliance

## 1. Regulatory Context (Kenya Data Protection Act, 2019)
The Mulembe National Platform operates as a registered Data Controller and Processor under the Kenyan Office of the Data Protection Commissioner (ODPC). 

### Mandatory Principles:
1. **Lawfulness, Fairness, and Transparency**: Explicit informed consent gathered prior to processing personal identity data.
2. **Purpose Limitation**: Member data is collected exclusively for community welfare, chapter administration, and verified communication.
3. **Data Minimization**: Only essential identity attributes (Name, Phone, National ID, County, Clan) are collected.
4. **Accuracy & Storage Limitation**: Members maintain self-service profile updating and deletion rights.
5. **Integrity & Confidentiality**: Sensitive identifiers (e.g. National ID) are encrypted at rest using AES-256-GCM.

---

## 2. Threat Modeling & Mitigation

| Threat Vector | Risk Level | Mitigation Strategy |
|---|:---:|---|
| **SQL Injection** | Critical | Drizzle ORM parameterized queries exclusively. Raw string concatenation in queries is strictly prohibited by linting. |
| **Privilege Escalation** | High | Scope-aware checks verified inside the Service Layer. Client role claims are never trusted; database roles are mirrored from Clerk claims on every request. |
| **CSRF & XSS** | High | Next.js built-in CSRF defenses for Route Handlers, automatic React DOM string escaping, strict Content Security Policy (CSP) headers in `next.config.ts`. |
| **DDoS / Credential Stuffing** | Medium | Clerk handles auth rate-limiting. Upstash / in-memory sliding window rate limits applied to `/api/v1/*` write and search endpoints. |
| **Unauthorized Data Scraping** | High | Member directory phone numbers and email addresses are masked unless explicitly opted into public chapter visibility by the member. |

---

## 3. Cryptographic Audit Logging
Every state-altering event (role modifications, chapter creations, membership status transitions, data exports) triggers an immutable audit log entry:

- `actor_id`: Clerk User ID of initiator.
- `action`: Specific domain action (e.g., `member.status_verified`).
- `target_id`: ID of affected entity.
- `payload_diff`: JSON snapshot of `{ before, after }` values.
- `metadata`: Client IP, User-Agent, and cryptographic timestamp.
