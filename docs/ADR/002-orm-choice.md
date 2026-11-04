# ADR 002: Drizzle ORM for TiDB Cloud Serverless

## Context
TiDB Cloud provides a distributed, serverless MySQL-compatible database. The platform requires a type-safe database layer that avoids binary engines, minimizes cold starts in serverless environments, and provides versioned migrations.

## Decision
Adopt **Drizzle ORM** with `mysql2` and `drizzle-kit` for schema management and migrations.

## Consequences
- **Positive**:
  - Zero heavy binary engines (unlike Prisma which requires generating and shipping query engines).
  - Near-instant cold start performance on Vercel Serverless Functions.
  - Direct SQL expression control with 100% end-to-end TypeScript type inference.
  - Clean migration workflow with `drizzle-kit generate` and `drizzle-kit migrate`.
- **Negative**:
  - Developers must understand relational queries explicitly rather than relying on deep auto-nested Prisma abstractions.
