# Update Logs:
## Major Backend Update V.1: 
Updated at: 12/09/2025
1. Adjust backend to query and compatible with new database layout.
2. Fix cookie and token bug.
- Instead using server-side Next.js or middleware, use client side to authenticate.
3. Authenticated user can now bypass login page and redirect to Home page.
4. Change the api endpoints.
- Add `/check` endpoint to authenticate user.
- Add `/user/home` to get user data for Home page.
- Add api prefix `/v1/api/auth` to make it scalable and categorized.

Backend is not now connect with all front end page. We're still working on.

# Constraint:
1. If no api request is made within a certain amount of time, the backend server will automatically shut down and enter idle mode.  Although it takes less than a minute, the server will immediately restart in response to the api request.

2. Auth cookie only last for 30 minutes.

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