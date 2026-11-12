# Яблуко · Ukrainian practice app

Spaced-repetition review and lesson games for students of the *Яблуко* textbook.
The teacher creates student logins, opens lessons after each class, and follows progress.

- `docs/`: the website (plain HTML/JS, hosted on GitHub Pages)
- `supabase/setup.sql`: database tables and access rules
- `supabase/functions/admin/`: server function that creates students and resets passwords

## One-time setup (Supabase)

1. **Database:** Supabase → SQL Editor → New query → paste `supabase/setup.sql` → Run.
2. **Stop public sign-ups:** Authentication → Sign In / Providers → turn **off** "Allow new users to sign up".
3. **Teacher login:** Authentication → Users → Add user → Create new user → your email + a password, tick **Auto Confirm User**.
4. **Make it the teacher:** SQL Editor →
   ```sql
   update public.profiles set role = 'teacher'
   where id = (select id from auth.users where email = 'YOUR_EMAIL');
   ```
5. **Admin function:** Edge Functions → Deploy a new function → Via Editor → name it `admin` → paste `supabase/functions/admin/index.ts` → Deploy. Leave "Verify JWT" on.

## Everyday use

- Log in with your email. You land on **Учні · Students**.
- **＋ New student** → name, login name, password → send them the text it shows.
- After a class, open the student and tick the lessons you covered.
- Students log in with their login name, can change nickname and password in ⚙️.

## Adding new units

Add lessons to `docs/data.js` (same format as the existing ones). They appear in the teacher's
lesson list automatically.
