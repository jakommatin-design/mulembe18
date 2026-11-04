# 08. Deployment, Environments & Infrastructure

## 1. Environments Topology

| Environment | Branch | Hosting Platform | Database | Auth Instance | Domain |
|---|---|---|---|---|---|
| **Local** | `feature/*` | Localhost (Node.js 20+) | TiDB Cloud (Dev cluster) | Clerk Dev Instance | `http://localhost:3000` |
| **Preview** | `pull-request/*` | Vercel Preview Deployments | TiDB Cloud (Dev/Branch) | Clerk Dev Instance | `*.vercel.app` |
| **Production** | `main` | Vercel Production | TiDB Cloud (Production Serverless) | Clerk Production Instance | `mulembe.co.ke` |

---

## 2. Environment Variables Catalog (`.env.example`)

```bash
# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# TiDB Cloud Serverless Connection (MySQL Protocol with SSL)
DATABASE_URL="mysql://<user>:<password>@<gateway-host>:4000/<database>?ssl={\"rejectUnauthorized\":true}"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/profile"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# Notification Gateways
RESEND_API_KEY="re_..."
AFRICAS_TALKING_USERNAME="sandbox"
AFRICAS_TALKING_API_KEY="atsk_..."
AFRICAS_TALKING_SENDER_ID="MULEMBE"

# Rate Limiting & Security
RATE_LIMIT_MAX_REQUESTS="60"
RATE_LIMIT_WINDOW_SECONDS="60"
```

---

## 3. Pre-Deployment Release Checklist

- [ ] `npm run typecheck` passes with zero errors under strict mode.
- [ ] `npm run lint` passes without warnings.
- [ ] All database migrations applied successfully (`drizzle-kit migrate`).
- [ ] Automated integration and unit tests passing in CI (`npm run test`).
- [ ] Security headers confirmed in production response via `curl -I https://mulembe.co.ke`:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- [ ] Clerk production keys and webhooks verified.
