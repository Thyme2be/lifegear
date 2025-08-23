# Constraint:
1. If no api request is made within a certain amount of time, the backend server will automatically shut down and enter idle mode.  Although it takes less than a minute, the server will immediately restart in response to the api request.

# Bug and Fix Report
1. Can not register new user from back end to supabase database
`error: new row violates row-level security policy for table "students"`
fix: 
- Ensure that `SUPABASE_KEY` in `.env` file is a `service_role` key.
- Ensure the Row-Level Security policy (RLS) allowed the SQL methodology ex. `select()`, `insert()`

2. Fly.io can't deploy
error: when starting up the backend <br>
fix: 
- use `
- use `CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]` to run in DockerFile
- Also `EXPOSE 8000` port 