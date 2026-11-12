# Яблуко · Ukrainian practice app: project brief

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
