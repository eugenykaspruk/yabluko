# Ucranización · Práctica: Ukrainian practice app, project brief

Brand: the school is «Ucranización» (Instagram @ucranizacion). The app has no name of its own, caption «Práctica / Practice». Don't mention the textbook name in the app or materials. The repo and URL keep the old name `yabluko` so links keep working.

Read this first if you're picking up this project.

## What it is
A web app for the private students of a Ukrainian teacher who teaches from the textbook
*Яблуко* (Ukrainian Catholic University, elementary, A1→A2). Lessons happen live on a Miro
board; this app is where students practise between classes.

- Live: https://eugenykaspruk.github.io/yabluko/
- Hosting: GitHub Pages from `main` → `/docs` (static files, no build step)
- Backend: Supabase project `pdusjphcxyugzzfdhcbb` (Postgres + Auth + one Edge Function)
- Book structure: Intro (lessons 0.1–0.10) + 12 units × 7 lessons = 94 lessons.
  Built so far: Intro and Unit 1 (17 lessons). Units 2–12 show as "coming soon".

## Who does what
- **Teacher** (role `teacher`, logs in with email): creates student logins, ticks lessons
  as done after each class (this unlocks them for that student), sees each student's
  progress, word-memory boxes and hardest words, resets passwords, deletes students.
- **Students** (log in with a username the teacher made; no email, no Claude account):
  practise only the lessons the teacher has unlocked, can change nickname and password.

## Student features
- **Home**: book bar, one big "Today" button (due reviews + up to 15 new words, then a
  5-question mixed check), opened lessons newest first, and "More practice" (drills + word list).
- **Daily review**: spaced repetition modelled on the teacher's German
  "Mein Wortschatz" app. Leitner boxes with intervals 0/1/3/7/14/30/60 days; self-rated
  flashcards (Forgot / Tricky / Knew it / Easy) plus drills: typing (Cyrillic keypad, typo
  tolerance, и/і hint), multiple choice, він·вона·воно gender, and a stress drill (tap the
  stressed vowel). Due and often-missed words first; mistakes repeat at the end of a round.
- **Уроки (lessons)**: per-lesson games: word cards, a matching game, and 1–2 grammar
  quizzes (e.g. рік/роки/років, мій/моя/моє, у мене/у нього є). A lesson counts as done at 80%.
  Progress is saved per item (every correct answer, matched pair or viewed card counts).
  Word cards weigh 15% of a lesson; the matching game and quizzes share 85%.
- Daily flashcards = due reviews + up to 15 new words a day (`NEW_PER_DAY`). Drills use words
  already met in flashcards. Grammar terms in `NO_REVIEW` stay out of the daily review.
- Deep links: `…/yabluko/#lesson-1-1` opens that lesson (used by the Miro board).
- **Словник**: all unlocked words grouped by lesson (most recently opened first), coloured by gender, with memory dots.
- **Book bar**: % of the whole book practised, lessons opened by the teacher, A1 marker at
  the end of Unit 6, A2 at the end.
- Installable on a phone home screen (web manifest). Light and dark mode.

## Files
- `docs/index.html`, `docs/style.css`: page and styles (fonts: Noto Sans / Noto Serif;
  other fonts misplace the Ukrainian combining stress mark U+0301)
- `docs/app.js`: all logic: login, review engine, drills, lesson games, teacher pages
- `docs/data.js`: content. `UNITS`, `LESSONS` (each: code, ua/en titles, `words`
  [[ua, en]], optional `pairs`, `quizzes`), `GENDER` map for the gender drill.
  Stress is written as a backtick after the stressed vowel (`ма`ма`) and converted to U+0301.
- `docs/config.js`: Supabase URL + publishable key (public by design; access is
  enforced by Row Level Security)
- `supabase/setup.sql`: tables `profiles`, `unlocks`, `progress`, `cards`; RLS policies
  (students read and write their own rows, teacher reads all, only teacher unlocks);
  grants for `authenticated` and `service_role`; trigger that creates a profile per login
- `supabase/functions/admin/index.ts`: Edge Function (deployed as `admin`) that creates
  students, resets passwords, deletes students; checks the caller is a teacher
- `.github/workflows/keep-alive.yml`: pings Supabase twice a week so the free plan
  doesn't pause the project

## Conventions and rules
- Student logins are stored as `<username>@students.yabluko.app` (never emailed).
  Public sign-ups are disabled in Supabase.
- Word IDs are `<lesson>:<word without stress marks>`. Changing a word's spelling resets
  that card's review history.
- **Stress marks must be checked against a dictionary**, not written from memory.
  Use the `ukrainian-word-stress` Python package (dictionary mode) and confirm disagreements
  in Wiktionary. Its dictionary wrongly flags pronouns (його́, мене́, мені́, її́) and the
  phrase Нічо́го! ("That's OK"); those are correct.
- English is the instruction language. Ukrainian headings come first, English second.
- Never put real-person photos in content.

## Adding a unit
1. Add the unit's lessons to `LESSONS` in `docs/data.js` in the same format; add new nouns
   to `GENDER`.
2. Check all stress marks with the dictionary.
3. Push to `main`; GitHub Pages redeploys in about a minute. New lessons appear in the
   teacher's unlock list automatically.

## Nov 2026 updates
- Progress bar ("Прогрес") shows one level: Intro + Units 1–6 → A1 (52 lessons). When the teacher unlocks any Unit 7 lesson it restarts for Units 7–12 → A2 (42). Nothing is deleted.
- Rating buttons: Ще раз / Важко / Знаю / Легко (English below). No intervals shown to students.
- Typing drills use a ЙЦУКЕН on-screen keyboard.
- Home shows the 3 newest lessons + "Усі уроки" page (view.tab "lessons").
- Theme: Auto / Light / Dark in Settings (localStorage "theme", html[data-theme]).
- Interface language (STAGE): 0 bilingual; 1 labels in Ukrainian (all Intro lessons at 100%); 2 all Ukrainian (all 52 A1 lessons at 100%). Helpers L/Ls (labels), I/I2 (instructions), TT (titles), HU (game hints via HINT_UA). Student can force bilingual (profiles.ui_choice='bi'); teacher override profiles.ui_override; congratulations shown once (profiles.ui_seen + localStorage). Settings → Мова page always stays bilingual.
- Class balance: table ledger (+package / −class / fix), teacher-only RLS; students read their number via rpc my_balance(). Prices in app_settings key 'prices' (see below). "Заняття відбулося" deducts 1, then offers to open the next lessons; at ≤3 offers a reminder via the share sheet. Needs supabase/migrate_2.sql (app degrades gracefully without it).

- Prices (Notion spec, 14 Nov 2026): USD, paid in UAH at the NBU rate. Single $25; 4 classes $92, valid 2 months; 8 classes $168, valid 3 months; 16 classes $320, valid 6 months; founding students −15% for 6 months. No pair lessons (removed; see the comment by DEFAULT_PRICES). 32-class package on hold (add it back to PACKS and DEFAULT_PRICES). app_settings 'prices' = {v:4, currency, packs, months, founding, foundingMonths}; saved prices older than v:4 are ignored.
- Package end dates: ledger.expires_on (supabase/migrate_3.sql). The package dialog fills it from months (calendar months from today); teacher sees "valid until" (orange ≤7 days, red when expired); students see a banner from 7 days before (rpc my_package(), falls back to my_balance()). Unused classes are not taken away automatically.
- Founding students: app_settings key 'founding' = {student_id: "YYYY-MM-DD" or "pending"} (no migration). The 6 months run from the first payment: "pending" until the first package, then first package date + 6 months. Package dialog applies the discount while it is active.
- "Class moved or cancelled" (teacher): reasons alert / teacher / ontime / late. Stored in ledger without a migration: kind 'fix' delta 0 (late = kind 'class' delta −1), note "moved:<reason> · …". "teacher" adds 7 days to the latest package's expires_on (deleting the record takes them off again).
- Student region (for the air-raid rule): app_settings key 'regions' = {student_id: {oblast, city, since}}; oblast names as alerts.in.ua writes them ("м. Київ", "Львівська область"), "abroad" = outside Ukraine. Planned: check alerts.in.ua history when a class is marked "moved: alert".
- Refund (teacher, student page): "Refund if they stop" = classes left × what one class cost in the latest package (amount ÷ classes; without an amount: price list, founding discount applied). "record refund" adds a ledger 'fix' row: delta −classes left, amount negative, note "refund".
- Access after a package ends (supabase/migrate_4.sql, pg_cron job "ucranizacion-access" at 03:15 UTC): 14 days after the end date of the last package the login is banned (auth.users.banned_until); a new package unbans at once (trigger ledger_unblock); 12 months after that end date with no new package the student is deleted (auth user → profile, progress, cards, unlocks, ledger by cascade; their keys removed from app_settings 'founding' and 'regions'). The app also signs a student out with a message when their package ended over 14 days ago, and the teacher sees "🔒 blocked since … · deletes on …".
- Review deck: a word that appears in several lessons (same base: no stress, no "(…)" note) gets one review card, from the earliest unlocked lesson. Synonyms share a meaning (English without a trailing "(…)" note): typing any of them counts, the feedback shows the typed word and "also: …"; multiple choice never shows two of them.
