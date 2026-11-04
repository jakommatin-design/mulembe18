# ADR 003: Clerk for Authentication & Role Mirroring

## Context
Community members access the platform through diverse entry points (smartphones with SMS verification, Google accounts, email/password). Identity verification, multi-factor authentication (MFA), and session management must be robust, reliable, and compliant with security best practices.

## Decision
Adopt **Clerk** for customer identity and access management (CIAM), mirroring user roles into TiDB via webhooks and runtime session extractors.

## Consequences
- **Positive**:
  - Out-of-the-box support for Kenyan phone numbers, SMS OTP, and Google OAuth.
  - Native React components (`<SignInButton />`, `<UserButton />`) and Clerk Next.js middleware.
  - Secure public metadata payload allowing fast, cryptographically signed client-side role inspection.
- **Negative**:
  - Dependent on external Clerk service uptime (mitigated by caching synced user profile records in TiDB).
