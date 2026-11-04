# 10. Data Migration Plan from Legacy mulembe18

## 1. Legacy Data Audit
The legacy `mulembe18` codebase stored records in a MySQL schema with legacy flat structures:
- `members` table: `id`, `name`, `email`, `phone`, `clan`, `residence`, `role`, `status`, `created_at`
- `events` table: `id`, `title`, `date`, `venue`, `description`, `chapter`
- `contributions` / `welfare`: `id`, `member_id`, `amount`, `date`, `receipt_code`

---

## 2. Extraction, Transformation & Loading (ETL) Pipeline

The migration will be executed via standalone Node.js TypeScript scripts in `scripts/migrate/`:

```mermaid
flowchart LR
    Source["Legacy TiDB Database\n(mulembe18)"] --> Extract["1. Extract to JSON Dump\n(scripts/migrate/export.ts)"]
    Extract --> Clean["2. Sanitize & Normalize\n- Validate phone numbers (+254)\n- Deduplicate by email & phone\n- Map raw clan names\n- Map residence to County/Ward"]
    Clean --> DryRun{"3. Dry Run Mode?\n(--dry-run)"}
    DryRun -- Yes --> Report["Output Discrepancy Report\n(skipped_records.log)"]
    DryRun -- No --> Load["4. Insert into New TiDB Schema\n- Create Users\n- Create Memberships\n- Create Events\n- Assign Default 'member' Role"]
```

---

## 3. Idempotency & Safety Guarantees
1. **Deduplication**: Records sharing the same phone or email are merged, preserving the latest profile timestamp.
2. **Deterministic Foreign Keys**: Chapter slugs from legacy are mapped to corresponding UUIDs in the new `chapters` table.
3. **Multi-Run Safety**: The migration script checks for record existence before inserting, allowing repeated executions without duplicate record creation.
4. **Verification Run**: At completion, a reconciliation query verifies total row counts between old and new tables.
