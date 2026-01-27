# Backend Implementation Plan - Neon.tech Integration

## Goal Description
Integrate the existing backend with a **Neon.tech**
## ✅ DECISION IMPLEMENTED: Neon.tech (Cloud Postgres)
The decision was made to use **Neon.tech**.

-   **Connection**: Configured in `.env`.
-   **Schema**: Successfully applied via `scripts/init-db.js`.
-   **SSL**: Enabled in `db.js`.

The backend is now fully functional on this branch.
tialization
-   [ ] Run the schema script `01_smg_schema.sql` against the new Neon database.
    -   We can use a tool or a temporary script (`init-db.js`) to execute the SQL file since `psql` might not be installed locally.

### 3. Verification
-   [ ] Run `npm run dev`.
-   [ ] Test `/api/health` and `/api/products` (should return empty list instead of error).

## Verification Plan
1.  Start server: `npm run dev`.
2.  Check logs for "Connected to database".
3.  Hit `GET /api/products`. Expect `200 OK` (Empty array).
