# FinScope AI Supabase Setup

Run `schema.sql` first, then `seed.sql`.

The schema creates the requested profiles, companies, assessments, benchmark, trial balance, mapping, statement, KPI, score, intelligence rule, recommendation, AI commentary, report, expert lead, and pricing tables. Row-level security is enabled for all application tables, with owner policies for assessment data and admin policies for configuration tables.

The `assessment-files` private storage bucket is created for uploaded source files and generated report artifacts.
