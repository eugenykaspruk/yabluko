-- Ucranización · migration 3: package end dates.
-- Paste into Supabase → SQL Editor → Run. Safe to run more than once.
-- Needs migrate_2.sql (the ledger table) to have been run first.

-- every package can have an end date ("valid until")
alter table public.ledger add column if not exists expires_on date;

-- students can read their own number of classes and the end date of their latest package, nothing else
create or replace function public.my_package() returns json
  language sql stable security definer set search_path = public as
$$
  select json_build_object(
    'balance', coalesce((select sum(delta) from public.ledger where student_id = auth.uid()), 0)::int,
    'expires_on', (select expires_on from public.ledger
                   where student_id = auth.uid() and kind = 'package' and expires_on is not null
                   order by created_at desc limit 1)
  )
$$;
revoke all on function public.my_package() from public, anon;
grant execute on function public.my_package() to authenticated;
