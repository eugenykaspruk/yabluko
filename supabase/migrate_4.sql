-- Ucranización · migration 4: access after a package ends.
-- Paste into Supabase → SQL Editor → Run. Safe to run more than once.
-- Needs migrate_2.sql and migrate_3.sql first.
--
-- Rules (Notion spec, 14 Nov 2026):
--   • 14 days after the end date of a student's last package, their login is blocked.
--     A new package unblocks it straight away.
--   • 12 months after that end date, with no new package, the student and all their data are deleted
--     (login, profile, progress, cards, unlocks, class history). This cannot be undone.
-- Students who never had a package with an end date are never blocked or deleted by this.

create extension if not exists pg_cron;

-- last package end date per student
create or replace function public.last_package_end(uid uuid) returns date
  language sql stable security definer set search_path = public as
$$ select max(expires_on) from public.ledger where student_id = uid and kind = 'package' $$;

-- the daily job
create or replace function public.enforce_access() returns void
  language plpgsql security definer set search_path = public, auth as
$$
declare r record;
begin
  -- delete: 12 months after the last package ended
  for r in
    select p.id from public.profiles p
    where p.role = 'student'
      and public.last_package_end(p.id) is not null
      and public.last_package_end(p.id) + interval '12 months' < current_date
  loop
    update public.app_settings set value = value - r.id::text where key in ('founding', 'regions');
    delete from auth.users where id = r.id;   -- profile, progress, cards, unlocks, ledger follow (on delete cascade)
  end loop;

  -- block: 14 days after the last package ended
  update auth.users u set banned_until = 'infinity'
  from public.profiles p
  where p.id = u.id and p.role = 'student'
    and public.last_package_end(p.id) is not null
    and public.last_package_end(p.id) + 14 < current_date
    and u.banned_until is null;

  -- unblock: a newer package is valid again
  update auth.users u set banned_until = null
  from public.profiles p
  where p.id = u.id and p.role = 'student' and u.banned_until is not null
    and public.last_package_end(p.id) + 14 >= current_date;
end
$$;
revoke all on function public.enforce_access() from public, anon, authenticated;

-- a new or changed package unblocks at once (no waiting for the night job)
create or replace function public.ledger_unblock() returns trigger
  language plpgsql security definer set search_path = public, auth as
$$
begin
  if new.kind = 'package' and new.expires_on is not null and new.expires_on + 14 >= current_date then
    update auth.users set banned_until = null where id = new.student_id and banned_until is not null;
  end if;
  return new;
end
$$;
drop trigger if exists ledger_unblock on public.ledger;
create trigger ledger_unblock after insert or update of expires_on on public.ledger
  for each row execute function public.ledger_unblock();

-- run every night at 03:15 UTC
select cron.unschedule('ucranizacion-access') where exists (select 1 from cron.job where jobname = 'ucranizacion-access');
select cron.schedule('ucranizacion-access', '15 3 * * *', 'select public.enforce_access()');
