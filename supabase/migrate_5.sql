-- migrate_5.sql · explanation language per student (English or Spanish) and the 🧪 test-student switch
-- Run after migrate_4.sql (it adds profiles.is_test).
-- Run once in Supabase → SQL Editor. Safe to run again.
alter table public.profiles add column if not exists lang text not null default 'en';
alter table public.profiles drop constraint if exists profiles_lang_check;
alter table public.profiles add constraint profiles_lang_check check (lang in ('en', 'es'));
-- students may change their own explanation language in ⚙️ → Мова; the teacher can change it for anyone
grant update (lang) on public.profiles to authenticated;
-- the teacher marks test students in the student card (profiles.is_test, added in migrate_4.sql)
grant update (is_test) on public.profiles to authenticated;
