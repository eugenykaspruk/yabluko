-- migrate_5.sql · explanation language per student (English or Spanish)
-- Run once in Supabase → SQL Editor. Safe to run again.
alter table public.profiles add column if not exists lang text not null default 'en';
alter table public.profiles drop constraint if exists profiles_lang_check;
alter table public.profiles add constraint profiles_lang_check check (lang in ('en', 'es'));
-- students may change their own explanation language in ⚙️ → Мова; the teacher can change it for anyone
grant update (lang) on public.profiles to authenticated;
