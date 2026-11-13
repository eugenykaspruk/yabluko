-- Яблуко · migration 2: interface language steps, class balance, prices.
-- Paste into Supabase → SQL Editor → Run. Safe to run more than once.

-- interface language
alter table public.profiles
  add column if not exists ui_seen smallint not null default 0,  -- last congratulations shown
  add column if not exists ui_override smallint,                 -- teacher's manual setting (empty = automatic)
  add column if not exists ui_choice text;                       -- student's own choice ('bi' = bilingual)
grant update (ui_seen, ui_choice, ui_override) on public.profiles to authenticated;

-- class balance: every package (+) and every class held (−) is one row
create table if not exists public.ledger (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  delta int not null,
  kind text not null check (kind in ('package','class','fix')),
  amount numeric,
  note text,
  created_at timestamptz not null default now()
);
alter table public.ledger enable row level security;
drop policy if exists "ledger: teacher only" on public.ledger;
create policy "ledger: teacher only" on public.ledger for all
  using (public.is_teacher()) with check (public.is_teacher());
grant select, insert, update, delete on public.ledger to authenticated;

-- students can read their own number of classes, nothing else
create or replace function public.my_balance() returns int
  language sql stable security definer set search_path = public as
$$ select coalesce(sum(delta), 0)::int from public.ledger where student_id = auth.uid() $$;
revoke all on function public.my_balance() from public, anon;
grant execute on function public.my_balance() to authenticated;

-- teacher settings (prices)
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
drop policy if exists "settings: teacher only" on public.app_settings;
create policy "settings: teacher only" on public.app_settings for all
  using (public.is_teacher()) with check (public.is_teacher());
grant select, insert, update, delete on public.app_settings to authenticated;
