# ADR 001: Next.js App Router as Unified Full-Stack Platform

## Context
The Mulembe National Platform requires high search engine visibility (SEO) on public pages (chapters, cultural heritage, leadership, public notices), fast mobile performance on slow Kenyan mobile networks, and secure, authenticated API route handlers for administrative operations.

## Decision
Adopt **Next.js 15+ (App Router)** as the single full-stack framework across the repository.

## Consequences
- **Positive**:
  - React Server Components (RSC) drastically reduce client-side JavaScript bundle payloads.
  - Colocation of backend route handlers under `app/api/*` eliminates cross-origin complexity and enables single-deployment hosting on Vercel.
  - Deep integration with Clerk and modern React 19 paradigms.
- **Negative**:
  - Strict boundary between Server and Client Components (`"use client"` declarations required for interactive Bootstrap components).
