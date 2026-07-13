create extension if not exists "pgcrypto";

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  family text not null,
  region text not null default 'UAE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_activities (
  id uuid primary key default gen_random_uuid(),
  industry_id uuid not null references public.industries(id) on delete cascade,
  name text not null,
  activity_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (industry_id, name)
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  industry_id uuid references public.industries(id),
  business_activity_id uuid references public.business_activities(id),
  company_name text not null,
  country text not null,
  emirate text,
  company_age text,
  revenue_band text,
  employee_band text,
  license_type text check (license_type in ('Mainland', 'Free zone', 'Offshore')),
  license_authority text,
  vat_registered boolean not null default false,
  corporate_tax_registered boolean not null default false,
  audit_required boolean not null default false,
  financial_records_available text,
  primary_objective text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'uploaded', 'mapped', 'processing', 'complete', 'archived')),
  assessment_period text,
  source_type text check (source_type in ('upload', 'manual', 'api')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.benchmarks (
  id uuid primary key default gen_random_uuid(),
  industry_id uuid not null references public.industries(id) on delete cascade,
  business_activity_id uuid references public.business_activities(id) on delete cascade,
  revenue_band text,
  employee_band text,
  metric_key text not null,
  metric_label text not null,
  p25 numeric,
  median numeric not null,
  p75 numeric,
  unit text not null default 'percent',
  effective_from date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  bucket text not null default 'assessment-files',
  storage_path text not null,
  original_name text not null,
  mime_type text,
  size_bytes bigint,
  parse_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.trial_balance_accounts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  source_file_id uuid references public.uploaded_files(id) on delete set null,
  account_code text,
  account_name text not null,
  debit numeric not null default 0,
  credit numeric not null default 0,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.account_mappings (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  trial_balance_account_id uuid not null references public.trial_balance_accounts(id) on delete cascade,
  standard_category text not null,
  confidence text not null check (confidence in ('High', 'Medium', 'Low')),
  rationale text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_statements (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  statement_type text not null check (statement_type in ('profit_loss', 'balance_sheet', 'cash_flow', 'equity', 'notes')),
  period_label text not null,
  line_items jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kpis (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  metric_key text not null,
  metric_label text not null,
  value numeric not null,
  unit text not null,
  benchmark_value numeric,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  score_key text not null,
  score_label text not null,
  score numeric not null check (score >= 0 and score <= 100),
  status text not null,
  risk_level text not null check (risk_level in ('Low', 'Medium', 'High')),
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists public.intelligence_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  rule_type text not null check (rule_type in ('scoring', 'regulatory', 'tax', 'vat', 'audit', 'benchmark', 'valuation', 'recommendation')),
  name text not null,
  description text not null,
  config jsonb not null default '{}'::jsonb,
  weight numeric not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.triggered_rules (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  rule_id uuid not null references public.intelligence_rules(id) on delete cascade,
  severity text not null check (severity in ('info', 'low', 'medium', 'high')),
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  title text not null,
  detail text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  owner text,
  due_in_days integer,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_commentary (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  commentary_type text not null,
  model text,
  source_payload jsonb not null,
  commentary text not null,
  safety_notes text not null default 'Indicative; requires professional review; not professional advice.',
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  report_type text not null default 'final_pdf',
  status text not null default 'generated',
  storage_path text,
  generated_by uuid references public.profiles(id),
  generated_at timestamptz not null default now()
);

create table if not exists public.expert_review_leads (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references public.assessments(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  company text,
  service text not null,
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price_aed numeric,
  billing_interval text not null default 'assessment',
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'industries',
    'business_activities',
    'companies',
    'assessments',
    'benchmarks',
    'uploaded_files',
    'trial_balance_accounts',
    'account_mappings',
    'financial_statements',
    'kpis',
    'scores',
    'intelligence_rules',
    'triggered_rules',
    'recommendations',
    'ai_commentary',
    'reports',
    'expert_review_leads',
    'pricing_plans'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "config_read_all_industries" on public.industries
  for select using (true);
create policy "config_admin_write_industries" on public.industries
  for all using (public.is_admin()) with check (public.is_admin());

create policy "config_read_all_activities" on public.business_activities
  for select using (true);
create policy "config_admin_write_activities" on public.business_activities
  for all using (public.is_admin()) with check (public.is_admin());

create policy "config_read_all_benchmarks" on public.benchmarks
  for select using (true);
create policy "config_admin_write_benchmarks" on public.benchmarks
  for all using (public.is_admin()) with check (public.is_admin());

create policy "config_read_active_pricing" on public.pricing_plans
  for select using (active or public.is_admin());
create policy "config_admin_write_pricing" on public.pricing_plans
  for all using (public.is_admin()) with check (public.is_admin());

create policy "rules_admin_read_write" on public.intelligence_rules
  for all using (public.is_admin()) with check (public.is_admin());

create policy "companies_owner_access" on public.companies
  for all using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());

create policy "assessment_owner_access" on public.assessments
  for all using (
    public.is_admin() or exists (
      select 1 from public.companies c
      where c.id = assessments.company_id
        and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.companies c
      where c.id = assessments.company_id
        and c.owner_id = auth.uid()
    )
  );

create policy "files_owner_access" on public.uploaded_files
  for all using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());

create policy "leads_owner_or_admin_access" on public.expert_review_leads
  for all using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());

create policy "assessment_child_rows_access" on public.trial_balance_accounts
  for all using (
    public.is_admin() or exists (
      select 1
      from public.assessments a
      join public.companies c on c.id = a.company_id
      where a.id = trial_balance_accounts.assessment_id
        and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1
      from public.assessments a
      join public.companies c on c.id = a.company_id
      where a.id = trial_balance_accounts.assessment_id
        and c.owner_id = auth.uid()
    )
  );

create policy "mapping_child_rows_access" on public.account_mappings
  for all using (
    public.is_admin() or exists (
      select 1
      from public.assessments a
      join public.companies c on c.id = a.company_id
      where a.id = account_mappings.assessment_id
        and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1
      from public.assessments a
      join public.companies c on c.id = a.company_id
      where a.id = account_mappings.assessment_id
        and c.owner_id = auth.uid()
    )
  );

create policy "statement_child_rows_access" on public.financial_statements
  for all using (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = financial_statements.assessment_id and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = financial_statements.assessment_id and c.owner_id = auth.uid()
    )
  );

create policy "kpi_child_rows_access" on public.kpis
  for all using (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = kpis.assessment_id and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = kpis.assessment_id and c.owner_id = auth.uid()
    )
  );

create policy "scores_child_rows_access" on public.scores
  for all using (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = scores.assessment_id and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = scores.assessment_id and c.owner_id = auth.uid()
    )
  );

create policy "triggered_rules_child_rows_access" on public.triggered_rules
  for all using (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = triggered_rules.assessment_id and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = triggered_rules.assessment_id and c.owner_id = auth.uid()
    )
  );

create policy "recommendations_child_rows_access" on public.recommendations
  for all using (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = recommendations.assessment_id and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = recommendations.assessment_id and c.owner_id = auth.uid()
    )
  );

create policy "ai_commentary_child_rows_access" on public.ai_commentary
  for all using (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = ai_commentary.assessment_id and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = ai_commentary.assessment_id and c.owner_id = auth.uid()
    )
  );

create policy "reports_child_rows_access" on public.reports
  for all using (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = reports.assessment_id and c.owner_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.assessments a join public.companies c on c.id = a.company_id
      where a.id = reports.assessment_id and c.owner_id = auth.uid()
    )
  );

insert into storage.buckets (id, name, public)
values ('assessment-files', 'assessment-files', false)
on conflict (id) do nothing;

create policy "storage_owner_read" on storage.objects
  for select using (bucket_id = 'assessment-files' and (owner = auth.uid() or public.is_admin()));
create policy "storage_owner_insert" on storage.objects
  for insert with check (bucket_id = 'assessment-files' and owner = auth.uid());
create policy "storage_owner_update" on storage.objects
  for update using (bucket_id = 'assessment-files' and (owner = auth.uid() or public.is_admin()));

create trigger profiles_touch_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger industries_touch_updated_at before update on public.industries
  for each row execute function public.touch_updated_at();
create trigger business_activities_touch_updated_at before update on public.business_activities
  for each row execute function public.touch_updated_at();
create trigger companies_touch_updated_at before update on public.companies
  for each row execute function public.touch_updated_at();
create trigger assessments_touch_updated_at before update on public.assessments
  for each row execute function public.touch_updated_at();
create trigger benchmarks_touch_updated_at before update on public.benchmarks
  for each row execute function public.touch_updated_at();
create trigger account_mappings_touch_updated_at before update on public.account_mappings
  for each row execute function public.touch_updated_at();
create trigger financial_statements_touch_updated_at before update on public.financial_statements
  for each row execute function public.touch_updated_at();
create trigger intelligence_rules_touch_updated_at before update on public.intelligence_rules
  for each row execute function public.touch_updated_at();
create trigger expert_review_leads_touch_updated_at before update on public.expert_review_leads
  for each row execute function public.touch_updated_at();
create trigger pricing_plans_touch_updated_at before update on public.pricing_plans
  for each row execute function public.touch_updated_at();
