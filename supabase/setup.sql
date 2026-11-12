-- ============================================================
--  Яблуко · practice app — database setup
--  Paste this whole file into Supabase → SQL Editor → Run.
--  Safe to run again: it only creates what is missing.
-- ============================================================

-- 1. PROFILES: one row per person (student or teacher)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  nickname    text not null,
  role        text not null default 'student' check (role in ('student','teacher')),
  created_at  timestamptz not null default now(),
  last_seen   timestamptz
);

-- 2. UNLOCKS: which lessons the teacher has opened for each student
create table if not exists public.unlocks (
  student_id  uuid not null references public.profiles(id) on delete cascade,
  lesson      text not null,
  unlocked_at timestamptz not null default now(),
  primary key (student_id, lesson)
);

-- 3. PROGRESS: best score per lesson game (0–100)
create table if not exists public.progress (
  student_id  uuid not null references public.profiles(id) on delete cascade,
  lesson      text not null,
  game        text not null,
  best        int  not null check (best between 0 and 100),
  updated_at  timestamptz not null default now(),
  primary key (student_id, lesson, game)
);

-- 4. CARDS: spaced-repetition state per word
create table if not exists public.cards (
  student_id  uuid not null references public.profiles(id) on delete cascade,
  word_id     text not null,
  box         int  not null default 0,
  due         date,
  lapses      int  not null default 0,
  reps        int  not null default 0,
  last        date,
  primary key (student_id, word_id)
);

-- 5. Helper: is the current user the teacher?
create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher');
$$;

-- 6. New login → profile row automatically
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, nickname)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'nickname', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. Row Level Security
alter table public.profiles enable row level security;
alter table public.unlocks  enable row level security;
alter table public.progress enable row level security;
alter table public.cards    enable row level security;

drop policy if exists "profiles: read own or teacher" on public.profiles;
create policy "profiles: read own or teacher" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_teacher());
drop policy if exists "profiles: update own or teacher" on public.profiles;
create policy "profiles: update own or teacher" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_teacher())
  with check (id = auth.uid() or public.is_teacher());

drop policy if exists "unlocks: read own or teacher" on public.unlocks;
create policy "unlocks: read own or teacher" on public.unlocks
  for select to authenticated using (student_id = auth.uid() or public.is_teacher());
drop policy if exists "unlocks: teacher adds" on public.unlocks;
create policy "unlocks: teacher adds" on public.unlocks
  for insert to authenticated with check (public.is_teacher());
drop policy if exists "unlocks: teacher removes" on public.unlocks;
create policy "unlocks: teacher removes" on public.unlocks
  for delete to authenticated using (public.is_teacher());

drop policy if exists "progress: read own or teacher" on public.progress;
create policy "progress: read own or teacher" on public.progress
  for select to authenticated using (student_id = auth.uid() or public.is_teacher());
drop policy if exists "progress: write own" on public.progress;
create policy "progress: write own" on public.progress
  for insert to authenticated with check (student_id = auth.uid());
drop policy if exists "progress: update own" on public.progress;
create policy "progress: update own" on public.progress
  for update to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
drop policy if exists "progress: delete own or teacher" on public.progress;
create policy "progress: delete own or teacher" on public.progress
  for delete to authenticated using (student_id = auth.uid() or public.is_teacher());

drop policy if exists "cards: read own or teacher" on public.cards;
create policy "cards: read own or teacher" on public.cards
  for select to authenticated using (student_id = auth.uid() or public.is_teacher());
drop policy if exists "cards: write own" on public.cards;
create policy "cards: write own" on public.cards
  for insert to authenticated with check (student_id = auth.uid());
drop policy if exists "cards: update own" on public.cards;
create policy "cards: update own" on public.cards
  for update to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
drop policy if exists "cards: delete own or teacher" on public.cards;
create policy "cards: delete own or teacher" on public.cards
  for delete to authenticated using (student_id = auth.uid() or public.is_teacher());

-- 8. Table access for logged-in users only (RLS above decides which rows).
--    Nobody who is logged out can read anything.
revoke all on public.profiles, public.unlocks, public.progress, public.cards from anon;
grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant update (nickname, last_seen) on public.profiles to authenticated;   -- students can't change their role or username
grant select, insert, delete on public.unlocks to authenticated;
grant select, insert, update, delete on public.progress to authenticated;
grant select, insert, update, delete on public.cards to authenticated;
grant execute on function public.is_teacher() to authenticated;
-- the server-side "admin" function runs as service_role and needs to read profiles
grant select, insert, update, delete on public.profiles, public.unlocks, public.progress, public.cards to service_role;

-- 9. Profiles for logins that already exist (e.g. your own teacher login, if you made it first)
insert into public.profiles (id, username, nickname)
select u.id, split_part(u.email, '@', 1), split_part(u.email, '@', 1)
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
