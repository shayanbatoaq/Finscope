insert into public.industries (name, family, region)
values
  ('Wholesale Trading', 'Trading', 'UAE'),
  ('Software and Digital Services', 'Technology', 'UAE'),
  ('Professional Services', 'Services', 'UAE'),
  ('Food and Beverage Operations', 'Hospitality', 'UAE')
on conflict (name) do update set family = excluded.family, region = excluded.region;

insert into public.business_activities (industry_id, name, activity_code)
select id, 'Wholesale trading', 'TRD-001'
from public.industries
where name = 'Wholesale Trading'
on conflict (industry_id, name) do update set activity_code = excluded.activity_code;

insert into public.business_activities (industry_id, name, activity_code)
select id, 'Software subscriptions', 'TEC-001'
from public.industries
where name = 'Software and Digital Services'
on conflict (industry_id, name) do update set activity_code = excluded.activity_code;

insert into public.benchmarks (
  industry_id,
  business_activity_id,
  revenue_band,
  employee_band,
  metric_key,
  metric_label,
  p25,
  median,
  p75,
  unit
)
select
  i.id,
  ba.id,
  'AED 5M - 20M',
  '26 - 100',
  metric_key,
  metric_label,
  p25,
  median,
  p75,
  unit
from public.industries i
join public.business_activities ba on ba.industry_id = i.id
cross join (
  values
    ('gross_margin', 'Gross margin', 31, 38, 45, 'percent'),
    ('net_margin', 'Net margin', 8, 14, 21, 'percent'),
    ('current_ratio', 'Current ratio', 1.1, 1.48, 2.1, 'ratio'),
    ('receivable_days', 'Receivable days', 34, 46, 62, 'days')
) as metrics(metric_key, metric_label, p25, median, p75, unit)
where i.name = 'Wholesale Trading'
  and ba.name = 'Wholesale trading';

insert into public.intelligence_rules (rule_key, rule_type, name, description, config, weight)
values
  (
    'score_liquidity_current_ratio',
    'scoring',
    'Current ratio scoring',
    'Scores liquidity based on current assets compared with current liabilities.',
    '{"metric":"current_ratio","strong":1.5,"watch":1.0}'::jsonb,
    1.25
  ),
  (
    'tax_related_party_management_fees',
    'tax',
    'Related party management fees',
    'Triggers Corporate Tax and transfer pricing review when related-party fee accounts are detected.',
    '{"keywords":["related party","management fee"],"safe_wording":true}'::jsonb,
    1.5
  ),
  (
    'vat_payable_review',
    'vat',
    'VAT payable review',
    'Triggers VAT position review from mapped VAT liability accounts.',
    '{"category":"Tax Accounts","account_keywords":["VAT"]}'::jsonb,
    1
  ),
  (
    'audit_receivables_days',
    'audit',
    'Receivables aging review',
    'Triggers audit readiness review when receivable days exceed benchmark median.',
    '{"metric":"receivable_days","threshold":"median"}'::jsonb,
    1.2
  ),
  (
    'valuation_revenue_multiple',
    'valuation',
    'Revenue multiple valuation',
    'Configures indicative revenue multiple valuation by industry and company size.',
    '{"multiple":1.2,"requires_professional_review":true}'::jsonb,
    1
  )
on conflict (rule_key) do update
set
  rule_type = excluded.rule_type,
  name = excluded.name,
  description = excluded.description,
  config = excluded.config,
  weight = excluded.weight,
  active = true;

insert into public.pricing_plans (name, price_aed, billing_interval, features, active)
values
  ('Starter', 299, 'assessment', '["Single assessment","PDF export","Basic intelligence"]'::jsonb, true),
  ('Growth', 799, 'month', '["Five assessments","Industry benchmarking","Expert review workflow"]'::jsonb, true),
  ('Enterprise', null, 'custom', '["Custom benchmarks","Admin rules","Tenant controls"]'::jsonb, true)
on conflict (name) do update
set
  price_aed = excluded.price_aed,
  billing_interval = excluded.billing_interval,
  features = excluded.features,
  active = excluded.active;
