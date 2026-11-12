// Яблуко · "admin" Edge Function
// Creates student logins, resets passwords, deletes students.
// Only a logged-in TEACHER can use it. The secret key never leaves Supabase.
import { createClient } from "npm:@supabase/supabase-js@2";

const STUDENT_DOMAIN = "students.yabluko.app"; // internal login address, never emailed

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function secretKey(): string {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    if (keys.default) return keys.default;
    const first = Object.values(keys)[0];
    if (typeof first === "string") return first;
  } catch (_) { /* fall through */ }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

const USERNAME = /^[a-z0-9][a-z0-9._-]{1,30}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, secretKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Who is calling? Must be a logged-in teacher.
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Not logged in" }, 401);
  const { data: who, error: whoErr } = await admin.auth.getUser(token);
  if (whoErr || !who?.user) return json({ error: "Not logged in" }, 401);
  const { data: me } = await admin.from("profiles").select("role").eq("id", who.user.id).single();
  if (me?.role !== "teacher") return json({ error: "Teachers only" }, 403);

  let body: Record<string, string>;
  try { body = await req.json(); } catch (_) { return json({ error: "Bad request" }, 400); }

  // Never let these actions touch a teacher account.
  async function studentOnly(id: string) {
    const { data } = await admin.from("profiles").select("role").eq("id", id).single();
    return data?.role === "student";
  }

  switch (body.action) {
    case "create_student": {
      const username = String(body.username ?? "").trim().toLowerCase();
      const nickname = String(body.nickname ?? "").trim() || username;
      const password = String(body.password ?? "");
      if (!USERNAME.test(username)) return json({ error: "Username: 2–31 characters, letters a–z, numbers, dot, dash or underscore." }, 400);
      if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);
      const { data, error } = await admin.auth.admin.createUser({
        email: `${username}@${STUDENT_DOMAIN}`,
        password,
        email_confirm: true,
        user_metadata: { username, nickname },
      });
      if (error) return json({ error: /registered|exists/i.test(error.message) ? "That username is taken." : error.message }, 400);
      return json({ id: data.user.id, username, nickname });
    }
    case "reset_password": {
      const id = String(body.user_id ?? ""); const password = String(body.password ?? "");
      if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);
      if (!(await studentOnly(id))) return json({ error: "Students only" }, 400);
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    case "delete_student": {
      const id = String(body.user_id ?? "");
      if (!(await studentOnly(id))) return json({ error: "Students only" }, 400);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    default:
      return json({ error: "Unknown action" }, 400);
  }
});
