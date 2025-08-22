# Bug and Fix Report
1. Can not register new user from back end to supabase database
`error: new row violates row-level security policy for table "students"`
fix: 
- Ensure that `SUPABASE_KEY` in `.env` file is a `service_role` key.
- Ensure the Row-Level Security policy (RLS) allowed the SQL methodology ex. `select()`, `insert()`

