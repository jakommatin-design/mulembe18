# ADR 004: Vercel Serverless Hosting Strategy

## Context
The platform needs zero-downtime deployments, global CDN edge caching, and cost-effective hosting on a free/hobby tier during the initial rollout phase.

## Decision
Deploy the Mulembe National Platform on **Vercel Serverless** using the Vercel Hobby plan for the MVP phase, transitioning to a paid tier upon national-scale rollout.

## Consequences
- **Positive**:
  - First-class support for Next.js App Router, dynamic routes, and image optimization.
  - Automatic preview deployments for pull requests.
  - Free global CDN caching for static public pages and assets.
- **Negative**:
  - Serverless execution timeouts (10s on hobby plan) require long-running tasks (e.g. bulk SMS broadcasts) to use asynchronous queue or cron processing.
