/* =====================================================================
   Яблуко · practice app
   Students: daily spaced repetition (like "Mein Wortschatz") + lesson games
   for the lessons the teacher has unlocked. Teacher: students, unlocks, progress.
   ===================================================================== */
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------- small helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ST = s => String(s).replace(/`/g, "́");            // backtick → stress mark
const plain = s => String(s).replace(/[`́]/g, "");
/* ---------- interface language: 0 bilingual · 1 labels in Ukrainian · 2 everything in Ukrainian ---------- */
let STAGE = 0;
const L  = (ua, en) => STAGE >= 1 ? ua : `${ua} · ${en}`;              // short labels, inline
const Ls = (ua, en) => STAGE >= 1 ? ua : `${ua}<small>${en}</small>`;  // short labels, stacked
const I  = (ua, en) => STAGE >= 2 ? ua : en;                           // instructions (English until stage 2)
const I2 = (ua, en) => STAGE >= 2 ? ua : `${ua} · ${en}`;              // messages already shown in both
const TT = t => STAGE >= 1 ? String(t).split(" · ")[0] : t;            // "Ukrainian · English" titles
const pl = (n, one, few, many) => { const a = Math.abs(n) % 100, b = a % 10;
  return a > 10 && a < 15 ? many : b === 1 ? one : b >= 2 && b <= 4 ? few : many; };
const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const fmt = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today = () => fmt(new Date());
const addDays = n => { const d=new Date(); d.setDate(d.getDate()+n); return fmt(d); };
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.hidden=false; clearTimeout(toast.t); toast.t=setTimeout(()=>t.hidden=true,2600); }
function openModal(html){ $("#sheet").innerHTML=html; $("#modal").hidden=false; }
function closeModal(){ $("#modal").hidden=true; }
$("#modal").addEventListener("click", e => { if (e.target.id==="modal") closeModal(); });
const BYCODE = Object.fromEntries(LESSONS.map(l => [l.code, l]));
const unitOf = code => +code.split(".")[0];

/* ---------- words ---------- */
// One word bank item per entry in each lesson's word list.
const WORDS = [];
for (const l of LESSONS) for (const [ua, en] of l.words) {
  WORDS.push({ id: l.code + ":" + plain(ua), ua, en, lesson: l.code, review: !NO_REVIEW.has(plain(ua).toLowerCase()) });
}
const WBYID = Object.fromEntries(WORDS.map(w => [w.id, w]));
// nouns with a known gender (an entry like "лікар / лікарка" gives two)
function nounForms(w){
  const out=[];
  for (const part of String(w.ua).split(/\s+\/\s+/)) {
    const bare = plain(part).replace(/\s*\(.*\)/,"").trim();
    if (GENDER[bare]) out.push({ form: part.replace(/\s*\(.*\)/,"").trim(), g: GENDER[bare] });
  }
  return out;
}
const VOWELS = "аеєиіїоуюяАЕЄИІЇОУЮЯ";
function stressable(w){
  const first = String(w.ua).split(/\s+\/\s+/)[0].replace(/\s*\(.*\)/,"").trim();
  if (/[?!…]/.test(first) || first.split(" ").length > 2 || !first.includes("`")) return null;
  const vowelCount = [...plain(first)].filter(c => VOWELS.includes(c)).length;
  return vowelCount >= 2 ? first : null;
}

/* Game hints in Ukrainian, used once the student reaches stage 2 */
const HINT_UA = {
  "Match the number to the word.": "Знайди пару: число і слово.",
  "Choose the right word.": "Обери правильне слово.",
  "Who does this sport?": "Хто займається цим спортом?",
  "Which of these has no singular form?": "Яке з цих слів не має однини?",
  "Which language do they speak?": "Якою мовою вони розмовляють?",
  "Which field of the form does the question ask about?": "Про яке поле анкети це питання?",
  "Watch out for синій: синя, синє, сині.": "Увага: синій — синя, синє, сині.",
  "The question word agrees with the noun.": "Питальне слово узгоджується з іменником.",
  "The adjective agrees with the noun: -ий (він), -а (вона), -е (воно), -і (вони).": "Прикметник узгоджується з іменником: -ий (він), -а (вона), -е (воно), -і (вони).",
  "Read the words carefully: teen or ten?": "Читай уважно: -надцять чи -десят?",
  "Read the word aloud before you choose.": "Прочитай слово вголос, а потім обери.",
  "Read the number words.": "Прочитай числівники.",
  "Read the description and pick the family word.": "Прочитай опис і обери, хто це в родині.",
  "Pick the letter that matches the sound.": "Обери букву, яка відповідає звуку.",
  "Match: я → мене звати, він → …": "Знайди пару: я → мене звати, він → …",
  "Match the situation to the greeting.": "Знайди пару: ситуація і привітання.",
  "Match the masculine form to the feminine.": "Знайди пару: чоловічий і жіночий рід.",
  "Match each vowel to its sound.": "Знайди пару: голосна і її звук.",
  "Match each phrase to the natural reply.": "Знайди пару: фраза і відповідь.",
  "Match each noun with the right form of 'my'.": "Знайди пару: іменник і правильна форма слова «мій».",
  "Match each noun to its plural.": "Знайди пару: однина і множина.",
  "Match each letter to the sound it makes.": "Знайди пару: буква і звук.",
  "Match each job to its female form.": "Знайди пару: професія і жіноча форма.",
  "Match each adjective to its opposite.": "Знайди пару: прикметник і протилежне слово.",
  "Masculine (він), feminine (вона) or neuter (воно)?": "Чоловічий (він), жіночий (вона) чи середній (воно) рід?",
  "Look at the noun: він, вона, воно or plural?": "Подивись на іменник: він, вона, воно чи множина?",
  "Click a male word, then its female partner. Example: тато → мама.": "Натисни на слово чоловічого роду, потім — на його пару. Наприклад: тато → мама.",
  "Choose the right job.": "Обери правильну професію.",
  "Choose the right form.": "Обери правильну форму.",
  "Choose the right form before звати.": "Обери правильну форму перед «звати».",
  "Choose the right form after <b>у</b>. Remember: нього, неї, них start with <b>н-</b>.": "Обери правильну форму після <b>у</b>. Пам'ятай: нього, неї, них починаються з <b>н-</b>.",
  "Choose the plural form.": "Обери форму множини.",
  "Choose the best phrase.": "Обери найкращу фразу.",
  "Choose the best phrase for the situation.": "Обери найкращу фразу для ситуації.",
  "After з the country changes its ending.": "Після «з» назва країни змінює закінчення.",
};
const HU = h => STAGE >= 2 ? (HINT_UA[h] || h) : h;

/* ---------- state ---------- */
let me = null;            // {id, username, nickname, role}
let unlocked = new Set(); // lesson codes
let unlockedAt = {};      // lesson code -> ISO time it was opened
let cards = new Map();    // word_id -> card row
let prog = {};            // lesson -> {game: best}
let saveChain = Promise.resolve();
let view = { tab: "home" };

const isTeacher = () => me && me.role === "teacher";
// Opened lessons, most recently opened first (then later lessons first)
const LIDX = Object.fromEntries(LESSONS.map((l, i) => [l.code, i]));
const openLessonsNewest = () => [...unlocked].sort((a, b) =>
  String(unlockedAt[b] || "").localeCompare(String(unlockedAt[a] || "")) || LIDX[b] - LIDX[a]);
const deck = () => WORDS.filter(w => unlocked.has(w.lesson) && w.review);
const cardOf = id => cards.get(id) || { box: 0, due: null, lapses: 0, reps: 0 };
const isDue = id => { const c = cardOf(id); return !c.due || c.due <= today(); };   // new words count as due
const NEW_PER_DAY = 15;   // new words introduced per day, so a freshly unlocked unit doesn't flood the review
// Today's flashcards: words already in review that are due, then a limited number of new words (book order).
function todayQueueFrom(words, cs){
  const t = today(), card = id => cs.get(id);
  const due = words.filter(w => { const c = card(w.id); return c && (!c.due || c.due <= t); });
  const fresh = words.filter(w => !card(w.id));
  // words first seen today: remembered on this device, plus a fallback for other devices
  const intro = cs === cards ? introToday() : new Set();
  for (const [id, c] of cs) if (c.reps === 1 && c.last === t) intro.add(id);
  const startedToday = intro.size;
  return { due, fresh: fresh.slice(0, Math.max(0, NEW_PER_DAY - startedToday)), freshTotal: fresh.length };
}
const todayQueue = () => todayQueueFrom(deck(), cards);

/* ---------- spaced repetition (same rules as Mein Wortschatz) ---------- */
const INTERVALS = [0, 1, 3, 7, 14, 30, 60];
const MAXBOX = INTERVALS.length - 1;
const DRILL_LEN = 10;
function schedule(c, r){
  let box = c.box||0, due, lapses = c.lapses||0;
  if (r === "again"){ box = 0; due = today(); lapses++; }
  else if (r === "hard"){ box = Math.max(1, box); due = addDays(1); }
  else if (r === "good"){ box = Math.min(box+1, MAXBOX); due = addDays(INTERVALS[box]); }
  else { box = Math.min(box+2, MAXBOX); due = addDays(INTERVALS[box]); }
  return { box, due, lapses, reps:(c.reps||0)+1, last: today() };
}
const INTRO_KEY = () => "yabluko-intro-" + today();
function introToday(){ try { return new Set(JSON.parse(localStorage.getItem(INTRO_KEY()) || "[]")); } catch(e){ return new Set(); } }
function markIntro(id){ try { const s = introToday(); s.add(id); localStorage.setItem(INTRO_KEY(), JSON.stringify([...s])); } catch(e){} }
function recordWord(id, r, fromCards){
  const c = cardOf(id); let patch;
  if (!cards.has(id)) markIntro(id);
  if (!fromCards && !isDue(id)) {
    // Extra practice on a word that isn't due: never pull it back into today's list.
    // A mistake brings it back tomorrow instead.
    if (r === "good" || r === "easy") patch = { ...c, last: today() };
    else patch = { ...c, box: Math.max(1, Math.min(c.box || 0, 1)), due: addDays(1), last: today() };
  } else patch = schedule(c, r);
  cards.set(id, patch);
  saveCard(id, patch);
}
function saveCard(id, c){
  if (isTeacher()) return; // the teacher's practice isn't stored
  const row = { student_id: me.id, word_id: id, box: c.box, due: c.due, lapses: c.lapses, reps: c.reps, last: c.last };
  saveChain = saveChain.then(() => sb.from("cards").upsert(row)).then(r => { if (r && r.error) throw r.error; })
    .catch(() => toast(I2("Не вдалося зберегти. Перевір інтернет", "Couldn't save, check your connection")));
}
function saveProgress(lesson, game, pct){
  pct = Math.max(0, Math.min(100, Math.round(pct)));
  const cur = (prog[lesson]||{})[game] || 0;
  if (pct <= cur) return;
  (prog[lesson] ||= {})[game] = pct;
  if (isTeacher()) return;
  saveChain = saveChain.then(() => sb.from("progress").upsert({ student_id: me.id, lesson, game, best: pct, updated_at: new Date().toISOString() }))
    .then(r => { if (r && r.error) throw r.error; }).catch(() => toast(I2("Не вдалося зберегти", "Couldn't save")));
}

/* ---------- lesson / book progress ---------- */
function games(l){
  const g = [{ k:"words", t:"Слова · Words" }];
  if (l.pairs) g.push({ k:"pairs", t:"Пари · Pairs" });
  (l.quizzes||[]).forEach((q,i) => g.push({ k:"q"+i, t:q.title }));
  return g;
}
// Every answered question counts: progress is stored per item ("q0#3", "p#2", "w#5"),
// so leaving a game halfway keeps what was done. Word cards count for 15% of a lesson,
// the matching game and quizzes share the other 85%.
function gamePctFrom(rec, l, k){
  const count = pre => Object.keys(rec).filter(x => x.startsWith(pre)).length;
  if (k === "words") return Math.min(100, Math.max(rec.words || 0, count("w#") / l.words.length * 100));
  if (k === "pairs") return Math.min(100, Math.max(rec.pairs || 0, count("p#") / l.pairs.items.length * 100));
  const qi = +k.slice(1);
  return Math.min(100, Math.max(rec[k] || 0, count(k + "#") / l.quizzes[qi].items.length * 100));
}
function lessonPctFrom(p, code){
  const l = BYCODE[code]; if (!l) return 0;
  const g = games(l), rec = p[code] || {}, others = g.filter(x => x.k !== "words");
  if (!others.length) return Math.round(gamePctFrom(rec, l, "words"));
  const w = gamePctFrom(rec, l, "words") * 0.15;
  const o = others.reduce((s, x) => s + gamePctFrom(rec, l, x.k), 0) / others.length * 0.85;
  return Math.round(w + o);
}
function markItem(lesson, key){
  const rec = (prog[lesson] ||= {});
  if (rec[key]) return;
  rec[key] = 100;
  const el = document.getElementById("lpct"); if (el) el.textContent = lessonPct(lesson) + "%";
  if (isTeacher()) return;
  saveChain = saveChain.then(() => sb.from("progress").upsert({ student_id: me.id, lesson, game: key, best: 100, updated_at: new Date().toISOString() }, { ignoreDuplicates: true }))
    .then(r => { if (r && r.error) throw r.error; }).catch(() => toast(I2("Не вдалося зберегти", "Couldn't save")));
}
const lessonPct = code => lessonPctFrom(prog, code);
function bookPctFrom(p){ return LESSONS.reduce((s,l) => s + lessonPctFrom(p, l.code), 0) / BOOK_TOTAL; }

/* ---------- speech (browser voice, only if a Ukrainian one exists) ---------- */
let ukVoice = null;
function findVoice(){ try { ukVoice = (speechSynthesis.getVoices()||[]).find(v => /^uk/i.test(v.lang)) || null; } catch(e){} }
try { findVoice(); speechSynthesis.onvoiceschanged = findVoice; } catch(e){}
function speak(t){
  if (!ukVoice) return;
  try { const u = new SpeechSynthesisUtterance(plain(t).replace(/\s*\/\s*/g,", ").replace(/[…]/g,"")); u.voice=ukVoice; u.lang=ukVoice.lang; u.rate=.85; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch(e){}
}
const speakBtn = t => ukVoice ? `<button class="speak" data-say="${esc(t)}" aria-label="Слухати">🔊</button>` : "";
function wireSpeak(root){ root.querySelectorAll("[data-say]").forEach(b => b.onclick = e => { e.stopPropagation(); speak(b.dataset.say); }); }

/* =====================================================================
   LOGIN
   ===================================================================== */
function renderLogin(msg){
  $("#app").className = "wrap";
  $("#app").innerHTML = `<div class="login">
    <div class="logo">🍏</div>
    <h1 style="text-align:center">Яблуко</h1>
    <p class="sub" style="text-align:center">Українська · практика</p>
    <form id="lf">
      <label class="f" for="lu">Логін · Username</label>
      <input class="field" id="lu" autocomplete="username" autocapitalize="off" spellcheck="false" required>
      <label class="f" for="lp">Пароль · Password</label>
      <input class="field" id="lp" type="password" autocomplete="current-password" required>
      <div class="err" id="lerr">${esc(msg||"")}</div>
      <button class="btn blue" id="lbtn">Увійти · Log in</button>
    </form>
    <p class="hint2" style="text-align:center;margin-top:16px">Forgot your password? Ask your teacher to reset it.</p>
  </div>`;
  $("#lf").onsubmit = async e => {
    e.preventDefault();
    const u = $("#lu").value.trim(), p = $("#lp").value;
    const email = u.includes("@") ? u : `${u.toLowerCase()}@${STUDENT_DOMAIN}`;
    $("#lbtn").disabled = true; $("#lerr").textContent = "";
    const { error } = await sb.auth.signInWithPassword({ email, password: p });
    $("#lbtn").disabled = false;
    if (error) $("#lerr").textContent = /invalid/i.test(error.message) ? "Неправильний логін або пароль · Wrong username or password" : error.message;
  };
}

/* =====================================================================
   LOAD
   ===================================================================== */
async function loadMe(user){
  const { data: p, error } = await sb.from("profiles").select("*").eq("id", user.id).single();
  if (error || !p) { await sb.auth.signOut(); renderLogin("Профіль не знайдено · Profile not found. Ask your teacher."); return false; }
  me = p;
  sb.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", me.id).then(()=>{});
  if (isTeacher()) {
    unlocked = new Set(LESSONS.map(l => l.code)); cards = new Map(); prog = {};
    return true;
  }
  const [u, c, g] = await Promise.all([
    sb.from("unlocks").select("lesson,unlocked_at").eq("student_id", me.id),
    sb.from("cards").select("*").eq("student_id", me.id),
    sb.from("progress").select("lesson,game,best").eq("student_id", me.id),
  ]);
  if (u.error || c.error || g.error) { $("#app").innerHTML = `<p class="status">Не вдалося завантажити · Couldn't load your data. Refresh to try again.</p>`; return false; }
  unlocked = new Set(u.data.map(r => r.lesson).filter(c => BYCODE[c]));
  unlockedAt = Object.fromEntries(u.data.map(r => [r.lesson, r.unlocked_at]));
  cards = new Map(c.data.map(r => [r.word_id, r]));
  prog = {}; for (const r of g.data) (prog[r.lesson] ||= {})[r.game] = r.best;
  await loadBalance();
  return true;
}

/* ---------- interface stage + congratulations ---------- */
// Stage 1: every Intro lesson at 100%. Stage 2: every lesson up to the end of Unit 6 (A1) at 100%.
function autoStage(){
  const full = ls => ls.length && ls.every(l => lessonPct(l.code) >= 100);
  const a1 = LESSONS.filter(l => unitOf(l.code) <= 6);
  if (a1.length === A1_MARK && full(a1)) return 2;
  return full(LESSONS.filter(l => unitOf(l.code) === 0)) ? 1 : 0;
}
function computeStage(){
  if (!me || isTeacher()) return 0;
  if (me.ui_choice === "bi") return 0;                              // the student asked for both languages
  if (me.ui_override !== null && me.ui_override !== undefined) return me.ui_override;
  return autoStage();
}
const SEEN_KEY = () => "yabluko-seen-" + (me && me.id);
function seenStage(){ let l = 0; try { l = +localStorage.getItem(SEEN_KEY()) || 0; } catch(e){} return Math.max(l, me.ui_seen || 0); }
function updateStage(){
  STAGE = computeStage();
  if (!me || isTeacher() || STAGE <= seenStage()) return;
  try { localStorage.setItem(SEEN_KEY(), STAGE); } catch(e){}
  me.ui_seen = STAGE;
  sb.from("profiles").update({ ui_seen: STAGE }).eq("id", me.id).then(() => {});
  setTimeout(() => congratulate(STAGE), 400);
}
function congratulate(stage){
  const t = stage === 1
    ? { h: "🎉 Вітаємо!", ua: "Вступ пройдено на 100%! Відтепер кнопки й меню — лише українською.",
        en: "You finished the Introduction at 100%! From now on, buttons and menus are in Ukrainian only. Instructions stay in both languages for now." }
    : { h: "🏆 Вітаємо з рівнем A1!", ua: "Тепер увесь додаток — українською. Ти впораєшся!",
        en: "You reached A1! From now on the whole app is in Ukrainian." };
  openModal(`<div class="congrats"><div class="cbig">${t.h}</div><p>${t.ua}</p><p class="note">${t.en}</p>
    <p class="note">Якщо щось незрозуміло: ⚙️ → Мова · If you get stuck: ⚙️ → App language</p>
    <div class="row"><button class="btn blue" id="cok">Чудово! · Great!</button></div></div>`);
  $("#cok").onclick = closeModal;
}
let BAL = null;   // classes left, null until the database has the class balance
async function loadBalance(){
  if (!me || isTeacher()) return;
  const { data, error } = await sb.rpc("my_balance");
  BAL = error ? null : data;
}
function balanceBanner(){
  if (BAL === null || BAL > 3) return "";
  const n = Math.max(0, BAL);
  return n === 0
    ? `<div class="balbar zero">${I2("Оплачені заняття закінчилися. Напиши вчителю, щоб поновити пакет", "No paid classes left. Message your teacher to renew")}</div>`
    : `<div class="balbar">${I2(`Залишилось ${n} ${pl(n, "заняття", "заняття", "занять")}. Час поновити пакет`, `${n} ${n === 1 ? "class" : "classes"} left. Time to renew your package`)}</div>`;
}

let booted = false;
sb.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) { me = null; booted = false; renderLogin(); return; }
  if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && !booted) {
    booted = true;
    setTimeout(async () => { if (await loadMe(session.user)) { view = { tab: isTeacher() ? "students" : "home" }; openFromHash() || render(); } }, 0);
  }
});

// Links from the Miro board open a lesson directly: …/yabluko/#lesson-1-1
function openFromHash(){
  const m = location.hash.match(/^#lesson-(\d+)-(\d+)$/); if (!m || !me) return false;
  const code = m[1] + "." + m[2]; history.replaceState(null, "", location.pathname);
  if (!BYCODE[code]) return false;
  if (unlocked.has(code)) view = { tab: "lesson", code, game: "words" };
  else { view = { tab: "home" }; setTimeout(() => toast(I2(`Урок ${code} відкриється після заняття`, `Lesson ${code} opens after your class`)), 300); }
  render(); return true;
}
window.addEventListener("hashchange", () => { if (me) openFromHash(); });

/* =====================================================================
   SHELL
   ===================================================================== */
// The bar shows one level at a time: Intro + Units 1–6 lead to A1. Once the teacher opens
// any Unit 7 lesson it restarts for Units 7–12 (A2). All earlier progress stays saved.
function levelInfo(un = unlocked){
  const a2 = [...un].some(c => unitOf(c) >= 7);
  const ls = LESSONS.filter(l => a2 ? unitOf(l.code) >= 7 : unitOf(l.code) <= 6);
  return { goal: a2 ? "A2" : "A1", ls, N: a2 ? BOOK_TOTAL - A1_MARK : A1_MARK };
}
function levelPctFrom(p, un){
  const { goal, ls, N } = levelInfo(un);
  return { goal, pct: ls.reduce((s, l) => s + lessonPctFrom(p, l.code), 0) / N };
}
function bookBar(){
  const { goal, ls, N } = levelInfo(); // N = all lessons of the level, built or not
  const pct = ls.reduce((s, l) => s + lessonPct(l.code), 0) / N;
  const opened = ls.filter(l => unlocked.has(l.code)).length;
  const done = ls.filter(l => lessonPct(l.code) >= 80).length;
  return `<div class="book">
      <div class="lbl"><span>${L("Прогрес", "Progress")}</span><span><b>${pct < 1 && pct > 0 ? pct.toFixed(1) : Math.round(pct)}%</b> · ${done} / ${N} ${STAGE >= 1 ? "уроків" : "lessons done"}</span></div>
      <div class="bbar"><div class="open" style="width:${opened / N * 100}%"></div><i style="width:${pct}%"></i>
        <div class="mark" style="left:100%"><span>${goal}</span></div></div>
      <div class="legend2"><span><i style="background:var(--blue)"></i>${STAGE >= 1 ? "опрацьовано" : "practised"}</span><span><i class="op"></i>${STAGE >= 1 ? "відкрито" : "opened in class"} (${opened})</span>${BAL !== null ? `<span class="balchip ${BAL <= 3 ? "low" : ""}">🎟 ${Math.max(0, BAL)} ${STAGE >= 1 ? pl(Math.max(0, BAL), "заняття", "заняття", "занять") : (BAL === 1 ? "class left" : "classes left")}</span>` : ""}</div>
    </div>`;
}
function render(){
  if (!me) return renderLogin();
  updateStage();
  if (view.tab === "students" || view.tab === "student") { $("#app").className = "wrap wide"; return renderTeacher(); }
  $("#app").className = "wrap";
  const inSession = rs.view !== "menu";
  $("#app").innerHTML = `
    <div class="head">
      <div><h1>Привіт, ${esc(me.nickname)}!</h1>${isTeacher() ? `<p class="sub" style="margin:0">Teacher preview · nothing here is saved</p>` : ""}</div>
      <div class="who">${isTeacher() ? `<button class="chip" id="toT">👩‍🏫 Учні</button>` : ""}<button class="chip" id="settings" aria-label="Settings">⚙️</button></div>
    </div>
    ${inSession || view.tab === "lesson" || view.tab === "list" || view.tab === "lessons" ? "" : bookBar()}
    <section id="main"></section>`;
  $("#settings").onclick = () => openSettings();
  if ($("#toT")) $("#toT").onclick = () => { view = { tab: "students" }; render(); };
  if (inSession) renderReview();
  else if (view.tab === "lesson") renderLesson();
  else if (view.tab === "list") renderList();
  else if (view.tab === "lessons") renderAllLessons();
  else renderHome();
}
function refreshStats(){}
function goHome(){ rs = { view: "menu", dir: rs.dir }; view = { tab: "home" }; render(); window.scrollTo(0, 0); }

/* ---------- home ---------- */
function renderHome(){
  const el = $("#main"), d = deck();
  const tq = todayQueue(), n = tq.due.length + tq.fresh.length;
  const open = openLessonsNewest(), lockedCount = LESSONS.length - open.length;
  const nouns = d.filter(w => nounForms(w).length && cards.has(w.id)).length;
  const str = d.filter(w => stressable(w) && cards.has(w.id)).length;
  const met = d.filter(w => cards.has(w.id)).length;
  let today;
  if (!d.length) today = `<div class="today empty-t"><div><b>Ще немає слів</b><span>${I("Слова з'являться після першого заняття.", "Words appear after your first class.")}</span></div></div>`;
  else if (n) today = `<button class="today" id="start"><span class="tnum">${n}</span><span class="tlbl">${Ls("на сьогодні", "words today")}</span><span class="tgo">Почати ▶</span></button>`;
  else today = `<div class="today done-t"><span class="tnum">✓</span><span class="tlbl">${Ls("Усе на сьогодні", "All done today")}</span>${met >= 4 ? `<button class="more-btn" id="extra">${Ls("Ще трохи", "A bit more")}</button>` : ""}</div>`;
  el.innerHTML = balanceBanner() + today + `
    <h3 class="sec">${STAGE >= 1 ? "Уроки" : "Уроки <small>Lessons</small>"}</h3>
    <div class="lessons">${open.slice(0, 3).map(lessonRow).join("")}
      ${open.length > 3 ? `<button class="more-l" id="allL">${L("Усі уроки", "All lessons")} (${open.length}) →</button>`
        : lockedCount ? lockedRow(lockedCount) : ""}</div>
    <h3 class="sec">${STAGE >= 1 ? "Ще практика" : "Ще практика <small>More practice</small>"}</h3>
    <div class="modes">
      <button class="mode" data-m="type" ${met < 4 ? "disabled" : ""}><span class="ic">⌨️</span><b>Пиши</b><span>${I("Напиши українською", "Type it in Ukrainian")}</span></button>
      <button class="mode" data-m="mc" ${met < 4 ? "disabled" : ""}><span class="ic">✅</span><b>Тест</b><span>${I("Обери значення", "Pick the meaning")}</span></button>
      <button class="mode" data-m="gender" ${nouns < 3 ? "disabled" : ""}><span class="ic">🎨</span><b>він · вона · воно</b><span>${I("Рід іменників", "Noun genders")}</span></button>
      <button class="mode" data-m="stress" ${str < 3 ? "disabled" : ""}><span class="ic">🎯</span><b>Наголос</b><span>${I("Знайди наголос", "Find the stress")}</span></button>
      <button class="mode wide" id="toList"><span class="ic">📖</span><b>${L("Словник", "Word list")}</b><span>${STAGE >= 2 ? `слів: ${d.length} · вивчено: ${d.filter(w => (cardOf(w.id).box || 0) >= 3).length}` : `${d.length} words · ${d.filter(w => (cardOf(w.id).box || 0) >= 3).length} learned · newest first`}</span></button>
    </div>
    ${met < 4 && d.length ? `<p class="status">${I("Ігри відкриються після перших карток.", "The practice games open after your first flashcards.")}</p>` : ""}`;
  if ($("#start")) $("#start").onclick = () => startReview("cards");
  if ($("#extra")) $("#extra").onclick = () => startReview("mix");
  el.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { view = { tab: "lesson", code: b.dataset.l, game: "words" }; render(); window.scrollTo(0, 0); });
  el.querySelectorAll("[data-m]").forEach(b => b.onclick = () => startReview(b.dataset.m));
  $("#toList").onclick = () => { view = { tab: "list" }; render(); window.scrollTo(0, 0); };
  if ($("#allL")) $("#allL").onclick = () => { view = { tab: "lessons" }; render(); window.scrollTo(0, 0); };
}
function lessonRow(code){
  const l = BYCODE[code], p = lessonPct(code);
  return `<button class="lesson" data-l="${code}"><span class="code">${code}</span>
    <span class="t"><b>${esc(ST(l.ua))}</b>${STAGE >= 2 ? "" : `<span>${esc(l.en)}</span>`}<div class="mini"><i class="${p >= 80 ? "full" : ""}" style="width:${p}%"></i></div></span>
    <span class="pct ${p >= 80 ? "done" : ""}">${p >= 80 ? "✓" : p + "%"}</span></button>`;
}
const lockedRow = n => `<div class="lesson locked"><span class="code">🔒</span><span class="t"><span>${I(`Ще ${n} ${pl(n, "урок відкриється", "уроки відкриються", "уроків відкриються")} після занять`, `${n} more lessons open after your classes`)}</span></span></div>`;
function renderAllLessons(){
  const el = $("#main"), open = openLessonsNewest(), locked = LESSONS.length - open.length;
  el.innerHTML = `<div class="top"><button id="backL">← Назад</button><span>${L("Уроки", "Lessons")}</span><span></span></div>
    <div class="lessons">${open.map(lessonRow).join("")}${locked ? lockedRow(locked) : ""}</div>`;
  $("#backL").onclick = goHome;
  el.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { view = { tab: "lesson", code: b.dataset.l, game: "words", from: "lessons" }; render(); window.scrollTo(0, 0); });
}

/* ---------- settings ---------- */
function getTheme(){ try { return localStorage.getItem("theme") || "auto"; } catch(e){ return "auto"; } }
function setTheme(t){
  try { t === "auto" ? localStorage.removeItem("theme") : localStorage.setItem("theme", t); } catch(e){}
  if (t === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.dataset.theme = t;
}
function openSettings(page){
  const back = `<button class="setback" id="sback">← ${L("Налаштування", "Settings")}</button>`;
  if (!page) {
    const th = { auto: L("Авто", "Auto"), light: L("Світла", "Light"), dark: L("Темна", "Dark") }[getTheme()];
    const lang = me.ui_choice === "bi" ? "Двомовна · Bilingual" : "Авто · Auto";
    openModal(`<h2>${L("Налаштування", "Settings")}</h2>
      <p class="sub">${L("Логін", "Login name")}: <b>${esc(me.username)}</b></p>
      <div class="setlist">
        <button class="setrow" data-p="theme"><span class="si">🎨</span><span class="st">${Ls("Тема", "Theme")}</span><span class="sv">${th}</span><span class="sa">›</span></button>
        <button class="setrow" data-p="nick"><span class="si">🙂</span><span class="st">${Ls("Нікнейм", "Nickname")}</span><span class="sv">${esc(me.nickname)}</span><span class="sa">›</span></button>
        <button class="setrow" data-p="pw"><span class="si">🔑</span><span class="st">${Ls("Пароль", "Password")}</span><span class="sv">••••••••</span><span class="sa">›</span></button>
        ${isTeacher() ? "" : `<button class="setrow" data-p="lang"><span class="si">🌐</span><span class="st">Мова<small>App language</small></span><span class="sv">${lang}</span><span class="sa">›</span></button>`}
      </div>
      <div class="row two" style="margin-top:22px"><button class="btn danger" id="logout">${L("Вийти", "Log out")}</button><button class="btn" id="closeS">${L("Готово", "Done")}</button></div>`);
    $("#sheet").querySelectorAll("[data-p]").forEach(b => b.onclick = () => openSettings(b.dataset.p));
    $("#closeS").onclick = closeModal;
    $("#logout").onclick = async () => { closeModal(); await sb.auth.signOut(); };
    return;
  }
  if (page === "lang") {
    // always shown in both languages: this is the way back if a student gets stuck
    const ch = me.ui_choice === "bi" ? "bi" : "auto";
    openModal(`<button class="setback" id="sback">← Налаштування · Settings</button><h2>Мова · App language</h2>
      <p class="sub">Коли ти завершуєш етапи на 100%, додаток поступово переходить на українську. · As you finish stages at 100%, the app gradually switches to Ukrainian.</p>
      <div class="setlist" id="lang">
        <button class="setrow ${ch === "auto" ? "on" : ""}" data-c="auto"><span class="si">🚀</span><span class="st">Авто<small>Ukrainian grows with your progress</small></span><span class="sa">${ch === "auto" ? "✓" : ""}</span></button>
        <button class="setrow ${ch === "bi" ? "on" : ""}" data-c="bi"><span class="si">🤝</span><span class="st">Двомовна<small>Bilingual: Ukrainian and English</small></span><span class="sa">${ch === "bi" ? "✓" : ""}</span></button>
      </div>`);
    $("#lang").querySelectorAll("[data-c]").forEach(b => b.onclick = async () => {
      me.ui_choice = b.dataset.c === "bi" ? "bi" : null;
      sb.from("profiles").update({ ui_choice: me.ui_choice }).eq("id", me.id).then(() => {});
      STAGE = computeStage(); render(); openSettings("lang");
    });
    $("#sback").onclick = () => openSettings();
    return;
  }
  if (page === "theme") {
    const th = getTheme();
    openModal(back + `<h2>${L("Тема", "Theme")}</h2>
      <div class="setlist" id="theme">${[["auto","🌗","Авто",I("Як на телефоні", "Follows your phone")],["light","☀️","Світла",STAGE >= 1 ? "" : "Light"],["dark","🌙","Темна",STAGE >= 1 ? "" : "Dark"]].map(([k,i,t,e]) =>
        `<button class="setrow ${th === k ? "on" : ""}" data-t="${k}"><span class="si">${i}</span><span class="st">${t}<small>${e}</small></span><span class="sa">${th === k ? "✓" : ""}</span></button>`).join("")}</div>`);
    $("#theme").querySelectorAll("[data-t]").forEach(b => b.onclick = () => { setTheme(b.dataset.t); openSettings("theme"); });
  } else if (page === "nick") {
    openModal(back + `<h2>${L("Нікнейм", "Nickname")}</h2>
      <p class="sub">${I("З цим ім'ям додаток вітається з тобою.", "This is the name the app greets you with.")}</p>
      <input class="field" id="nn" value="${esc(me.nickname)}" maxlength="40">
      <div class="err" id="serr"></div>
      <div class="row"><button class="btn blue" id="saveNick">${L("Зберегти", "Save")}</button></div>`);
    $("#saveNick").onclick = async () => {
      const n = $("#nn").value.trim(); if (!n) return;
      const { error } = await sb.from("profiles").update({ nickname: n }).eq("id", me.id);
      if (error) { $("#serr").textContent = error.message; return; }
      me.nickname = n; toast(L("Збережено", "Saved")); render(); openSettings();
    };
  } else if (page === "pw") {
    openModal(back + `<h2>${L("Пароль", "Password")}</h2>
      <label class="f" for="np1">${L("Новий пароль", "New password")}</label>
      <input class="field" id="np1" type="password" autocomplete="new-password" placeholder="${I("щонайменше 8 символів", "at least 8 characters")}">
      <label class="f" for="np2">${L("Ще раз", "Repeat")}</label>
      <input class="field" id="np2" type="password" autocomplete="new-password">
      <div class="err" id="serr"></div>
      <div class="row"><button class="btn blue" id="savePw">${L("Змінити пароль", "Change password")}</button></div>`);
    $("#savePw").onclick = async () => {
      const a = $("#np1").value, b = $("#np2").value;
      if (a.length < 8) { $("#serr").textContent = I("Щонайменше 8 символів.", "At least 8 characters, please."); return; }
      if (a !== b) { $("#serr").textContent = I("Паролі не збігаються.", "The two passwords don't match."); return; }
      const { error } = await sb.auth.updateUser({ password: a });
      if (error) { $("#serr").textContent = error.message; return; }
      toast(L("Пароль змінено", "Password changed")); openSettings();
    };
  }
  $("#sback").onclick = () => openSettings();
}

/* =====================================================================
   REVIEW (spaced repetition)
   ===================================================================== */
let rs = { view: "menu" };
function pick(filter, n){
  let all = deck().filter(filter);
  const seen = all.filter(w => cards.has(w.id));
  if (seen.length >= 4) all = seen;   // drills test words you've already met in flashcards
  const due = shuffle(all.filter(w => isDue(w.id))).sort((a,b) => (cardOf(b.id).lapses||0) - (cardOf(a.id).lapses||0));
  const rest = shuffle(all.filter(w => !isDue(w.id))).sort((a,b) => (cardOf(a.id).box||0) - (cardOf(b.id).box||0));
  return [...due, ...rest].slice(0, n).map(w => w.id);
}
function renderReview(){
  if (rs.view === "cards") return renderCards();
  if (rs.view === "drill") return renderDrill();
  if (rs.view === "done") return renderDone();
  if (rs.view === "bridge") return renderBridge();
  goHome();
}
function startReview(mode){
  if (mode === "cards") {
    const tq = todayQueue();
    const ids = [...shuffle(tq.due).sort((a,b) => (cardOf(b.id).lapses||0) - (cardOf(a.id).lapses||0)), ...tq.fresh].map(w => w.id);
    if (!ids.length) return goHome();
    rs = { view:"cards", mode, queue: ids.slice(1), cur: ids[0], total: ids.length, done: 0, revealed: false, dir: rs.dir || "ua" };
  } else {
    const mix = mode === "mix";
    const len = mix ? 5 : DRILL_LEN;
    const filter = mode === "gender" ? (w => nounForms(w).length) : mode === "stress" ? (w => !!stressable(w)) : (() => true);
    // the quick check after flashcards prefers words practised today
    const ids = mix ? [...new Set([...shuffle(deck().filter(w => cardOf(w.id).last === today())).map(w => w.id), ...pick(() => true, len)])].slice(0, len)
                    : pick(filter, len);
    if (!ids.length) return goHome();
    rs = { view:"drill", mode, mix, queue: ids.slice(1), cur: ids[0], total: ids.length, done: 0, right: 0, missed: [], retried: new Set(), answered: null, dir: rs.dir };
    prepQuestion();
  }
  render(); window.scrollTo(0, 0);
}
function toMenu(){ goHome(); }
function rheader(){
  const pct = Math.round(rs.done / Math.max(1, rs.total) * 100);
  return `<div class="top"><button id="quit">← Назад</button><span>${rs.done+1} / ${rs.total}</span>${rs.view==="cards" ? `<button id="flip">${rs.dir==="ua" ? "UA → EN" : "EN → UA"}</button>` : "<span></span>"}</div>
    <div class="progress"><div style="width:${pct}%"></div></div>`;
}

/* flashcards */
const days = n => n === 1 ? "1 day" : n + " days";
function renderCards(){
  const el = $("#main");
  if (!rs.cur) { rs.view = "done"; return renderDone(); }
  const w = WBYID[rs.cur], c = cardOf(w.id);
  const front = rs.dir === "ua" ? ST(w.ua) : w.en, back = rs.dir === "ua" ? w.en : ST(w.ua);
  el.innerHTML = rheader() + `<div class="card">${speakBtn(w.ua)}<div class="meta">Урок ${esc(w.lesson)}</div>
      <div class="front ${rs.dir==="en" ? "small" : ""}">${esc(front)}</div>
      ${rs.revealed ? `<hr class="div"><div class="backtxt">${esc(back)}</div>` : ""}</div>
    ${rs.revealed ? `<div class="row rate">
        <button class="r0" data-r="again">${Ls("Ще раз", "Again")}</button>
        <button class="r1" data-r="hard">${Ls("Важко", "Tricky")}</button>
        <button class="r2" data-r="good">${Ls("Знаю", "Knew it")}</button>
        <button class="r3" data-r="easy">${Ls("Легко", "Easy")}</button></div>`
      : `<div class="row"><button class="btn" id="show">${STAGE >= 1 ? "Показати відповідь" : "Показати · Show answer"}</button></div>`}`;
  $("#quit").onclick = toMenu; wireSpeak(el);
  $("#flip").onclick = () => { rs.dir = rs.dir === "ua" ? "en" : "ua"; renderCards(); };
  if (rs.revealed) el.querySelectorAll("[data-r]").forEach(b => b.onclick = () => {
    const r = b.dataset.r; recordWord(rs.cur, r, true); refreshStats();
    if (r === "again") { rs.queue.push(rs.cur); rs.total++; }
    rs.done++; rs.cur = rs.queue.shift() || null; rs.revealed = false; renderCards();
  });
  else $("#show").onclick = () => { rs.revealed = true; if (rs.dir === "en") speak(w.ua); renderCards(); };
}

/* drills */
// Standard Ukrainian (ЙЦУКЕН) layout, as on a phone or computer
const KB_ROWS = ["й ц у к е н г ш щ з х ї", "ф і в а п р о л д ж є", "ґ я ч с м и т ь б ю '"].map(r => r.split(" "));
const clean = s => plain(s).toLowerCase().replace(/[’ʼ´`]/g,"'").replace(/\(.*?\)/g,"").replace(/[…?!.,]/g,"").replace(/\s+/g," ").trim();
function variants(ua){
  const out = new Set();
  const noPar = String(ua).replace(/\(([^)]*)\)/g, (m, x) => { out.add(x); return ""; });
  out.add(noPar); noPar.split(/\s*\/\s*/).forEach(x => out.add(x));
  return [...out].map(clean).filter(Boolean);
}
function lev(a,b){
  const d = Array.from({length:a.length+1}, (_,i) => [i]);
  for (let j=1;j<=b.length;j++) d[0][j]=j;
  for (let i=1;i<=a.length;i++) for (let j=1;j<=b.length;j++) d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + (a[i-1]===b[j-1]?0:1));
  return d[a.length][b.length];
}
function checkTyped(given, w){
  const g = clean(given); if (!g) return { kind:"bad" };
  // accept any word in the deck that shares this English meaning
  const pool = deck().filter(x => x.en === w.en).flatMap(x => variants(x.ua));
  if (pool.includes(g)) return { kind:"ok" };
  if (pool.some(t => t.length > 4 && lev(g, t) === 1)) return { kind:"near" };
  const swapped = g.replace(/и/g,"і"), swapped2 = g.replace(/і/g,"и");
  if (pool.some(t => t === swapped || t === swapped2)) return { kind:"near", why:"iy" };
  return { kind:"bad" };
}
function prepQuestion(){
  if (!rs.cur) return;
  const w = WBYID[rs.cur]; rs.answered = null;
  if (rs.mix) rs.mode = shuffle(["type", "mc", ...(nounForms(w).length ? ["gender"] : []), ...(stressable(w) ? ["stress"] : [])])[0];
  if (rs.mode === "mc") {
    const dir = Math.random() < .5 ? "ua" : "en";
    let pool = deck().filter(x => x.id !== w.id && x.en !== w.en);
    if (pool.length < 3) pool = WORDS.filter(x => x.id !== w.id && x.en !== w.en);
    const others = shuffle(pool).slice(0, 3);
    rs.q = { dir, options: shuffle([w, ...others]).map(x => ({ id: x.id, text: dir === "ua" ? x.en : ST(x.ua) })) };
  } else if (rs.mode === "gender") {
    const f = shuffle(nounForms(w))[0]; rs.q = { form: f.form, g: f.g };
  } else if (rs.mode === "stress") {
    rs.q = { word: stressable(w) };
  }
}
function renderDrill(){
  const el = $("#main");
  if (!rs.cur) { rs.view = "done"; return renderDone(); }
  const w = WBYID[rs.cur], a = rs.answered; let body = "";
  if (rs.mode === "type") {
    body = `<div class="card"><div class="meta">Урок ${esc(w.lesson)} · Українською?</div><div class="front small">${esc(w.en)}</div></div>
      <input class="answer ${a ? a.kind : ""}" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="українською…" value="${a ? esc(a.given) : ""}" ${a ? "readonly" : ""}>
      ${a ? "" : `<div class="kb">${KB_ROWS.map(r => `<div class="kr">${r.map(x => `<button data-c="${x}">${x}</button>`).join("")}</div>`).join("")}<div class="kr"><button class="sp" data-c=" ">${L("пробіл", "space")}</button><button class="bs" data-c="BS">⌫</button></div></div>`}
      ${a ? feedback(a, w) : `<div class="row two"><button class="btn ghost" id="skip">Не знаю</button><button class="btn" id="check">Перевірити</button></div>`}`;
  } else if (rs.mode === "mc") {
    const q = rs.q;
    body = `<div class="card">${q.dir === "ua" ? speakBtn(w.ua) : ""}<div class="meta">Урок ${esc(w.lesson)} · ${q.dir === "ua" ? "Що це означає?" : "Як це українською?"}</div>
        <div class="front ${q.dir === "en" ? "small" : ""}">${esc(q.dir === "ua" ? ST(w.ua) : w.en)}</div></div>
      <div class="opts">${q.options.map(o => { let cls = ""; if (a) { if (o.id === w.id) cls = "ok"; else if (o.id === a.pickedId) cls = "bad"; }
        return `<button class="opt ${cls}" data-o="${esc(o.id)}" ${a ? "disabled" : ""}>${esc(o.text)}</button>`; }).join("")}</div>
      ${a ? feedback(a, w) : ""}`;
  } else if (rs.mode === "gender") {
    const q = rs.q;
    body = `<div class="card">${a ? speakBtn(q.form) : ""}<div class="meta">Урок ${esc(w.lesson)} · він, вона, воно чи вони?</div>
        <div class="front ${a ? "g-" + q.g : ""}">${esc(ST(q.form))}</div><div class="note">${esc(w.en)}</div></div>
      <div class="gbtns">${[["m","він"],["f","вона"],["n","воно"],["pl","вони"]].map(([g,t]) => `<button class="${g} ${a && g !== q.g && g !== a.picked ? "dim" : ""}" data-g="${g}" ${a ? "disabled" : ""}>${t}</button>`).join("")}</div>
      ${a ? feedback(a, w) : ""}`;
  } else if (rs.mode === "stress") {
    // Each word of a phrase is answered on its own: one tap per word that has a stress mark.
    const words = ST(rs.q.word).split(" "), picks = rs.q.picks ||= {};
    const targets = {}; let html = "";
    words.forEach((wd, wi) => {
      const chars = [...wd], nv = chars.filter(ch => VOWELS.includes(ch)).length;
      const live = wd.includes("́") && nv >= 2;
      let vi = 0, part = "";
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i]; if (ch === "́") continue;
        const stressed = chars[i+1] === "́";
        if (live && VOWELS.includes(ch)) {
          const idx = vi++; if (stressed) targets[wi] = idx;
          const done = picks[wi] !== undefined; let cls = "";
          if (done) { if (stressed) cls = "ok"; else if (idx === picks[wi]) cls = "bad"; }
          part += `<button data-w="${wi}" data-v="${idx}" class="${cls}" ${done || a ? "disabled" : ""}>${esc(ch)}</button>`;
        } else part += `<span>${esc(ch)}</span>`;
      }
      html += `<span class="sw">${part}</span>`;
    });
    rs.q.targets = targets;
    body = `<div class="card">${a ? speakBtn(rs.q.word) : ""}<div class="meta">Урок ${esc(w.lesson)} · ${L("Де наголос?", "Where is the stress?")}${Object.keys(rs.q.targets).length > 1 ? "<br>" + I("Обери одну голосну в кожному слові", "Tap one vowel in each word") : ""}</div>
        <div class="stress">${html}</div><div class="note">${esc(w.en)}</div></div>${a ? feedback(a, w) : ""}`;
  }
  el.innerHTML = rheader() + body;
  $("#quit").onclick = toMenu; wireSpeak(el);
  if (rs.mode === "type" && !a) {
    const inp = $("#ans"); setTimeout(() => { try { inp.focus(); } catch(e){} }, 30);
    inp.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); submitTyped(inp.value); } };
    el.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
      if (b.dataset.c === "BS") inp.value = inp.value.slice(0, -1); else inp.value += b.dataset.c; inp.focus(); });
    $("#check").onclick = () => submitTyped(inp.value); $("#skip").onclick = () => submitTyped("");
  } else if (rs.mode === "mc" && !a) {
    el.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { const ok = b.dataset.o === w.id; answer({ kind: ok ? "ok" : "bad", pickedId: b.dataset.o }); if (rs.q.dir === "en" || ok) speak(w.ua); });
  } else if (rs.mode === "gender" && !a) {
    el.querySelectorAll("[data-g]").forEach(b => b.onclick = () => { answer({ kind: b.dataset.g === rs.q.g ? "ok" : "bad", picked: b.dataset.g }); speak(rs.q.form); });
  } else if (rs.mode === "stress" && !a) {
    el.querySelectorAll("[data-v]").forEach(b => b.onclick = () => {
      const q = rs.q; q.picks[b.dataset.w] = +b.dataset.v;
      const keys = Object.keys(q.targets);
      if (keys.every(k => q.picks[k] !== undefined)) {
        answer({ kind: keys.every(k => q.picks[k] === q.targets[k]) ? "ok" : "bad" }); speak(q.word);
      } else renderDrill();
    });
  }
  const nx = $("#next"); if (nx) { nx.onclick = advance; setTimeout(() => { try { nx.focus(); } catch(e){} }, 30); }
}
function submitTyped(given){ const w = WBYID[rs.cur]; answer({ ...checkTyped(given, w), given }); speak(w.ua); }
function answer(a){
  rs.answered = a; const id = rs.cur, first = !rs.retried.has(id);
  if (a.kind === "ok") { if (first) rs.right++; recordWord(id, first ? "good" : "hard"); }
  else if (a.kind === "near") { if (first) rs.right++; recordWord(id, "hard"); }
  else { recordWord(id, "again"); if (first) { rs.missed.push(id); rs.retried.add(id); rs.queue.push(id); rs.total++; } }
  refreshStats(); renderDrill();
}
const GNAME_EN = { m:"він (masculine)", f:"вона (feminine)", n:"воно (neuter)", pl:"вони (plural only)" };
const GNAME_UA = { m:"він (чоловічий рід)", f:"вона (жіночий рід)", n:"воно (середній рід)", pl:"вони (лише множина)" };
const GNAME = new Proxy({}, { get: (_, k) => (STAGE >= 2 ? GNAME_UA : GNAME_EN)[k] });
function feedback(a, w){
  const sol = `<b>${esc(ST(w.ua))}</b>`; let html;
  if (rs.mode === "gender") {
    html = a.kind === "ok" ? `<div class="fb ok">✅ Правильно! <b>${esc(ST(rs.q.form))}</b> — ${GNAME[rs.q.g]}</div>`
      : `<div class="fb bad">❌ <b>${esc(ST(rs.q.form))}</b> — ${GNAME[rs.q.g]}<br><span class="note">${I("Повториться в кінці.", "Comes back at the end.")}</span></div>`;
  } else if (rs.mode === "stress") {
    html = a.kind === "ok" ? `<div class="fb ok">✅ Правильно! ${esc(ST(rs.q.word))}</div>` : `<div class="fb bad">❌ ${I("Правильно:", "It's")} <b>${esc(ST(rs.q.word))}</b><br><span class="note">${I("Повториться в кінці.", "Comes back at the end.")}</span></div>`;
  } else if (a.kind === "ok") html = `<div class="fb ok">✅ Правильно! ${rs.mode === "type" ? sol : sol + " = " + esc(w.en)}</div>`;
  else if (a.kind === "near") html = `<div class="fb near">🟠 Майже! ${a.why === "iy" ? I("Зверни увагу на <b>и</b> та <b>і</b>.", "Watch <b>и</b> and <b>і</b>.") : I("Маленька помилка.", "Small typo.")} ${I("Правильно:", "Correct:")} ${sol}</div>`;
  else html = `<div class="fb bad">❌ ${I("Правильна відповідь:", "Correct:")} ${sol} = ${esc(w.en)}<br><span class="note">${I("Повториться в кінці.", "Comes back at the end.")}</span></div>`;
  return html + `<div class="row"><button class="btn" id="next">Далі →</button></div>`;
}
function advance(){ rs.done++; rs.cur = rs.queue.shift() || null; prepQuestion(); renderDrill(); }
function renderDone(){
  const el = $("#main");
  if (rs.mode === "cards") {
    const met = deck().filter(w => cards.has(w.id)).length;
    el.innerHTML = `<div class="empty"><div class="big">Молодець! 💪</div>${I(`Пройдено ${rs.done} ${pl(rs.done, "картку", "картки", "карток")}.`, `${rs.done} cards done.`)}${met >= 4 ? "<br>" + I("Тепер швидка перевірка: 5 запитань.", "Now a quick check: 5 questions.") : ""}</div>
      <div class="row ${met >= 4 ? "two" : ""}"><button class="btn ghost" id="back">${met >= 4 ? L("Пропустити", "Skip") : L("Готово", "Done")}</button>${met >= 4 ? `<button class="btn" id="mixgo">Почати ▶</button>` : ""}</div>`;
    if ($("#mixgo")) $("#mixgo").onclick = () => startReview("mix");
  } else {
    const n = rs.total - rs.missed.length, pct = Math.round(rs.right / Math.max(1, n) * 100);
    const msg = pct === 100 ? "Чудово! 🏆" : pct >= 80 ? "Дуже добре! 💪" : pct >= 50 ? "Добре! 👍" : "Практикуйся далі! 📚";
    el.innerHTML = `<div class="card"><div class="big" style="font-family:'Noto Serif',serif;font-size:26px">${msg}</div>
      <div class="summary"><div><b>${rs.right}</b><span class="note">${I("правильно", "correct")}</span></div><div><b>${rs.missed.length}</b><span class="note">${I("помилки", "mistakes")}</span></div></div>
      ${rs.missed.length ? `<div class="misslist"><div class="meta">${L("Повтори ці слова", "Review these")}</div>${rs.missed.map(id => { const w = WBYID[id]; return `<div>${esc(ST(w.ua))} · <span class="note">${esc(w.en)}</span></div>`; }).join("")}</div>` : ""}</div>
      <div class="row two"><button class="btn ghost" id="back">${L("Готово", "Done")}</button><button class="btn" id="again">${L("Ще раз", "Again")}</button></div>`;
    $("#again").onclick = () => startReview(rs.mix ? "mix" : rs.mode);
  }
  $("#back").onclick = goHome;
}
function renderBridge(){ goHome(); }

/* =====================================================================
   LESSONS (games per lesson)
   ===================================================================== */
function renderLessons_unused(){
  const el = $("#main");
  el.innerHTML = UNITS.map(u => {
    const ls = LESSONS.filter(l => unitOf(l.code) === u.n);
    const head = `<h3>${u.n === 0 ? "Вступ" : "Розділ " + u.n + " · " + esc(u.ua)} <small>${esc(u.en)}</small></h3>`;
    if (!ls.length) return `<div class="unit">${head}<div class="lesson locked"><span class="code">🔒</span><span class="t"><span>${u.lessons} lessons · coming soon</span></span></div></div>`;
    return `<div class="unit">${head}<div class="lessons">${ls.map(l => {
      const open = unlocked.has(l.code), p = lessonPct(l.code);
      return `<button class="lesson ${open ? "" : "locked"}" data-l="${l.code}" ${open ? "" : "disabled"}>
        <span class="code">${open ? l.code : "🔒"}</span>
        <span class="t"><b>${esc(ST(l.ua))}</b><span>${esc(l.en)}</span>${open ? `<div class="mini"><i class="${p >= 80 ? "full" : ""}" style="width:${p}%"></i></div>` : ""}</span>
        <span class="pct ${p >= 80 ? "done" : ""}">${open ? (p >= 80 ? "✓" : p + "%") : ""}</span></button>`; }).join("")}</div></div>`;
  }).join("") + `<p class="status">Lessons open after your class. A lesson counts as done at 80%.</p>`;
  el.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { view = { tab: "lesson", code: b.dataset.l, game: "words" }; render(); });
}
function renderLesson(){
  const l = BYCODE[view.code], g = games(l), rec = prog[l.code] || {};
  $("#main").innerHTML = `<div class="top"><button id="backL">← Назад</button><span id="lpct">${lessonPct(l.code)}%</span><span></span></div>
    <h2 style="margin-bottom:2px">${l.code} · ${esc(ST(l.ua))}</h2><p class="sub">${esc(l.en)}</p>
    <div class="gtabs">${g.map((x,i) => `<button data-k="${x.k}" class="${view.game === x.k ? "on" : ""}"><span class="num n${i % 7}">${i+1}</span>${esc(TT(x.t))}${gamePctFrom(rec, l, x.k) >= 80 ? '<span class="ck">✓</span>' : ""}</button>`).join("")}</div>
    <div id="game"></div>`;
  $("#backL").onclick = () => { if (view.from === "lessons") { view = { tab: "lessons" }; render(); window.scrollTo(0, 0); } else goHome(); };
  document.querySelectorAll(".gtabs button").forEach(b => b.onclick = () => { view.game = b.dataset.k; renderLesson(); });
  const box = $("#game");
  if (view.game === "words") gWords(box, l);
  else if (view.game === "pairs") gPairs(box, l);
  else gQuiz(box, l, +view.game.slice(1));
}
function gWords(box, l){
  let deckL = l.words.map((w, idx) => [ST(w[0]), w[1], w[0], idx]), i = 0;
  box.innerHTML = `<p class="note" style="margin:0 0 10px">${I("Прочитай кожне слово вголос і натисни на картку. Нові слова також додаються до щоденного повторення.", "Read each word aloud, then tap the card. New words also go into your daily review.")}</p>
    <div class="card" id="wc" style="cursor:pointer"><div class="meta" id="wpos"></div><div class="front" id="wf"></div><div class="backtxt hidden" id="wb"></div></div>
    <div class="row two"><button class="btn ghost" id="wprev">←</button><button class="btn" id="wnext">→</button></div>`;
  function show(){ const [ua, en] = deckL[i]; $("#wf").textContent = ua; $("#wb").textContent = en; $("#wb").classList.add("hidden");
    $("#wpos").textContent = `${i+1} / ${deckL.length}`; markItem(l.code, "w#" + deckL[i][3]); }
  $("#wc").onclick = () => { $("#wb").classList.toggle("hidden"); speak(deckL[i][2]); };
  $("#wnext").onclick = () => { i = (i+1) % deckL.length; show(); };
  $("#wprev").onclick = () => { i = (i-1+deckL.length) % deckL.length; show(); };
  show();
}
function gPairs(box, l){
  const P = l.pairs.items.map(x => [ST(x[0]), ST(x[1])]);
  box.innerHTML = `<p class="note" style="margin:0 0 10px">${HU(l.pairs.hint)}</p><div class="match"><div class="col" id="mL"></div><div class="col" id="mR"></div></div><div class="status" id="mFb"></div>`;
  let sel = null, done = 0, tries = 0;
  function tile(t, i, s){ const b = document.createElement("button"); b.className = "tile"; b.textContent = t; b.dataset.i = i; b.dataset.s = s;
    b.onclick = () => { if (b.classList.contains("done")) return;
      if (!sel || sel.dataset.s === s) { if (sel) sel.classList.remove("sel"); sel = b; b.classList.add("sel"); return; }
      tries++;
      if (sel.dataset.i === b.dataset.i) { [sel, b].forEach(x => { x.classList.remove("sel"); x.classList.add("done"); }); done++; markItem(l.code, "p#" + b.dataset.i); sel = null;
        if (done === P.length) { $("#mFb").textContent = STAGE >= 2 ? `Чудово! Усі пари. Спроб: ${tries}.` : `Чудово! All pairs in ${tries} tries.`; }
      } else { const a = sel; [a, b].forEach(x => x.classList.add("wrong")); setTimeout(() => [a, b].forEach(x => x.classList.remove("wrong", "sel")), 350); sel = null; } };
    return b; }
  shuffle(P.map((x,i) => [x[0], i])).forEach(([t,i]) => $("#mL").append(tile(t, i, "L")));
  shuffle(P.map((x,i) => [x[1], i])).forEach(([t,i]) => $("#mR").append(tile(t, i, "R")));
}
function gQuiz(box, l, qi){
  const Q = l.quizzes[qi]; let order, i, score;
  function start(){ order = shuffle(Q.items.map((it, idx) => [...it.slice(0, 2), it[2], idx])); i = 0; score = 0; step(); }
  function step(){
    if (i >= order.length) {
      const pct = score / order.length * 100;
      box.innerHTML = `<div class="card"><div class="big" style="font-family:'Noto Serif',serif;font-size:26px">${score} / ${order.length}</div>
        <div class="note">${pct === 100 ? "Відмінно!" : pct >= 80 ? I("Добре! Зараховано.", "Добре! Counts as done.") : I("Спробуй ще раз: потрібно 80%.", "Try again: 80% counts as done.")} · ${I(`гру пройдено на ${Math.round(gamePctFrom(prog[l.code] || {}, l, "q" + qi))}%`, `${Math.round(gamePctFrom(prog[l.code] || {}, l, "q" + qi))}% of this game done`)}</div></div>
        <div class="row two"><button class="btn ghost" id="qb">Інша гра</button><button class="btn" id="qa">Ще раз</button></div>`;
      $("#qa").onclick = start; $("#qb").onclick = () => { renderLesson(); }; return;
    }
    const [q, ans, own, idx] = order[i]; let opts = (own || Q.opts).map(ST); if (!Q.fixed) opts = shuffle(opts);
    box.innerHTML = `<div class="progress"><div style="width:${i / order.length * 100}%"></div></div>
      <p class="note" style="margin:0 0 6px">${HU(Q.hint || "")}</p>
      <div class="q">${ST(q).replace("___", '<span class="gap">&nbsp;</span>').replace(/class=sub/g, 'class="sub2"')}</div>
      <div class="chips">${opts.map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div><div id="qfb"></div>`;
    let done = false;
    box.querySelectorAll("[data-o]").forEach(b => b.onclick = () => {
      if (done) return; done = true; const ok = plain(b.dataset.o) === plain(ans); if (ok) { score++; markItem(l.code, "q" + qi + "#" + idx); }
      b.classList.add(ok ? "ok" : "bad");
      if (!ok) box.querySelectorAll("[data-o]").forEach(x => { if (plain(x.dataset.o) === plain(ans)) x.classList.add("ok"); });
      const full = ST(q).replace(/<span[^>]*>[^<]*<\/span>/g, "").replace("___", ST(ans)).trim();
      $("#qfb").innerHTML = `<div class="fb ${ok ? "ok" : "bad"}">${ok ? "✅ Правильно!" : "❌"} ${q.includes("___") ? esc(full) : I("Відповідь: ", "Answer: ") + "<b>" + esc(ST(ans)) + "</b>"}</div>
        <div class="row"><button class="btn" id="qn">Далі →</button></div>`;
      $("#qn").onclick = () => { i++; step(); }; $("#qn").focus();
    });
  }
  start();
}

/* =====================================================================
   WORD LIST
   ===================================================================== */
function renderList(){
  const el = $("#main");
  el.innerHTML = `<div class="top"><button id="backW">← Назад</button><span>${L("Словник", "Word list")}</span><span></span></div>
    <input class="search" id="q" placeholder="Шукати… (українською або англійською)">
    <p class="note" style="margin:-6px 0 14px"><span class="g-m">він</span> · <span class="g-f">вона</span> · <span class="g-n">воно</span> · <span class="g-pl">вони</span> — ${I("колір показує рід", "colour shows the gender")}</p><div id="lb"></div>`;
  const draw = () => {
    const q = $("#q").value.trim().toLowerCase(), groups = {};
    for (const w of deck()) { if (q && !(plain(w.ua).toLowerCase().includes(q) || w.en.toLowerCase().includes(q))) continue; (groups[w.lesson] ||= []).push(w); }
    const keys = openLessonsNewest().filter(k => groups[k]);
    $("#lb").innerHTML = keys.length ? keys.map(k => `<div class="unit"><h3>${k} · ${esc(ST(BYCODE[k].ua))}</h3>${groups[k].map(w => {
      const f = nounForms(w); const cls = f.length === 1 ? "g-" + f[0].g : "";
      return `<div class="w"><div><div class="ua ${cls}">${esc(ST(w.ua))}</div><div class="en">${esc(w.en)}</div></div><div class="lvl">${Array.from({length: MAXBOX}, (_,i) => `<i class="${i < (cardOf(w.id).box||0) ? "f" : ""}"></i>`).join("")}</div></div>`; }).join("")}</div>`).join("")
      : `<div class="empty">${deck().length ? I2("Нічого не знайдено", "No matches") : I("Слова з'являться тут після занять.", "Words appear here after your teacher opens a lesson.")}</div>`;
  };
  $("#q").oninput = draw; draw(); $("#backW").onclick = goHome;
}

/* =====================================================================
   TEACHER
   ===================================================================== */
let T = null; // {students:[], unlocks:{}, progress:{}, cards:{}}
async function loadTeacher(){
  const [p, u, g, c] = await Promise.all([
    sb.from("profiles").select("*").eq("role", "student").order("created_at"),
    sb.from("unlocks").select("student_id,lesson"),
    sb.from("progress").select("student_id,lesson,game,best,updated_at"),
    sb.from("cards").select("student_id,word_id,box,due,lapses"),
  ]);
  if (p.error || u.error || g.error || c.error) throw (p.error || u.error || g.error || c.error);
  T = { students: p.data, unlocks: {}, progress: {}, cards: {} };
  for (const r of u.data) (T.unlocks[r.student_id] ||= new Set()).add(r.lesson);
  for (const r of g.data) ((T.progress[r.student_id] ||= {})[r.lesson] ||= {})[r.game] = r.best;
  for (const r of c.data) (T.cards[r.student_id] ||= new Map()).set(r.word_id, r);
  // class balance + prices (need supabase/migrate_2.sql; the rest of the app works without them)
  const [lg, pr] = await Promise.all([
    sb.from("ledger").select("*").order("created_at", { ascending: false }),
    sb.from("app_settings").select("value").eq("key", "prices").maybeSingle(),
  ]);
  T.ledgerOK = !lg.error; T.ledger = {};
  if (!lg.error) for (const r of lg.data) (T.ledger[r.student_id] ||= []).push(r);
  T.prices = (!pr.error && pr.data && pr.data.value) || { currency: "€", packs: {} };
}
const PACKS = [1, 4, 8, 16, 32];
const balanceOf = id => (T.ledger[id] || []).reduce((s, r) => s + r.delta, 0);
const money = v => v === null || v === undefined || v === "" ? "" : `${T.prices.currency || ""}${Number(v).toLocaleString()}`;
function monthSummary(){
  const m = new Date().toISOString().slice(0, 7); let held = 0, paid = 0;
  for (const rows of Object.values(T.ledger)) for (const r of rows) if (String(r.created_at).slice(0, 7) === m) {
    if (r.kind === "class") held -= r.delta; if (r.kind === "package" && r.amount) paid += Number(r.amount); }
  return { held, paid };
}
function studentStats(s){
  const un = T.unlocks[s.id] || new Set(), pr = T.progress[s.id] || {}, cs = T.cards[s.id] || new Map();
  const words = WORDS.filter(w => un.has(w.lesson) && w.review);
  const tq = todayQueueFrom(words, cs), due = tq.due.length + tq.fresh.length;
  const learned = words.filter(w => (cs.get(w.id)?.box || 0) >= 3).length;
  const lv = levelPctFrom(pr, un);
  return { un, pr, cs, words, due, learned, book: bookPctFrom(pr), level: lv.pct, goal: lv.goal };
}
function ago(ts){
  if (!ts) return "never";
  const d = (Date.now() - new Date(ts)) / 864e5;
  return d < 1 ? "today" : d < 2 ? "yesterday" : Math.floor(d) + " days ago";
}
async function renderTeacher(){
  $("#app").innerHTML = `<div class="head"><div><h1>Учні · Students</h1><p class="sub" style="margin:0">Hi ${esc(me.nickname)} · teacher</p></div>
    <div class="who"><button class="chip" id="prices">💶 Ціни · Prices</button><button class="chip" id="toP">🍏 Practice</button><button class="chip" id="settings">⚙️</button></div></div><div id="tmain"><p class="status">Завантаження…</p></div>`;
  $("#toP").onclick = () => { view = { tab: "home" }; rs = { view: "menu" }; render(); };
  $("#prices").onclick = () => T ? openPrices() : null;
  $("#settings").onclick = () => openSettings();
  try { await loadTeacher(); } catch (e) { $("#tmain").innerHTML = `<p class="status">Couldn't load students: ${esc(e.message || e)}</p>`; return; }
  if (view.tab === "student" && T.students.find(s => s.id === view.id)) return renderStudent();
  renderStudentList();
}
function renderStudentList(){
  view = { tab: "students" };
  const ms = T.ledgerOK ? monthSummary() : null;
  $("#tmain").innerHTML = `<div class="row" style="margin:16px 0"><button class="btn blue" id="add">＋ Новий учень · New student</button></div>
    ${ms ? `<p class="note" style="margin:-4px 0 12px">This month: <b>${ms.held}</b> ${ms.held === 1 ? "class" : "classes"} held · <b>${money(ms.paid) || 0}</b> received</p>`
         : `<p class="note" style="margin:-4px 0 12px">Class balances are off until you run <b>supabase/migrate_2.sql</b> in Supabase.</p>`}
    <div class="tlist">${T.students.length ? T.students.map(s => { const st = studentStats(s);
      return `<button class="trow" data-s="${s.id}"><div><b>${esc(s.nickname)}</b> <span class="note">@${esc(s.username)}</span>
        <div class="m2">Last active: ${ago(s.last_seen)} · ${st.un.size} lessons open</div></div>
        <div class="nums">${T.ledgerOK ? `<div class="${balanceOf(s.id) <= 3 ? "lowbal" : ""}"><b>${balanceOf(s.id)}</b>classes</div>` : ""}<div><b>${st.level.toFixed(1)}%</b>to ${st.goal}</div><div><b>${st.due}</b>today</div><div><b>${st.learned}</b>learned</div></div></button>`; }).join("")
      : `<div class="empty"><div class="big">No students yet</div>Create your first student above.</div>`}</div>`;
  $("#add").onclick = openAddStudent;
  document.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { view = { tab: "student", id: b.dataset.s }; renderStudent(); });
}
function genPassword(){
  const latin = ["yabluko","kit","sontse","more","dim","lito","zyma","sad","myr","kava","chai","dub","les","vovk"];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  return `${pick(latin)}-${pick(latin)}-${Math.floor(1000 + Math.random() * 9000)}`;
}
async function callAdmin(body){
  const { data, error } = await sb.functions.invoke("admin", { body });
  if (error) { let msg = error.message; try { const j = await error.context.json(); msg = j.error || msg; } catch(e){} throw new Error(msg); }
  return data;
}
function credText(username, password){
  return `Яблуко · Ukrainian practice\n${location.origin + location.pathname}\n\nLogin: ${username}\nPassword: ${password}\n\nYou can change your nickname and password in ⚙️ after logging in.`;
}
function showCredentials(username, password, title){
  const txt = credText(username, password);
  openModal(`<h2>${title}</h2><p class="sub">Send this to your student. You won't see the password again.</p>
    <div class="cred" id="credt">${esc(txt)}</div>
    <div class="row two"><button class="btn ghost" id="cp">Copy</button><button class="btn" id="cd">Done</button></div>`);
  $("#cp").onclick = async () => { try { await navigator.clipboard.writeText(txt); toast("Copied"); } catch(e) { toast("Select the text and copy it"); } };
  $("#cd").onclick = () => { closeModal(); renderTeacher(); };
}
function openAddStudent(){
  openModal(`<h2>Новий учень · New student</h2>
    <label class="f" for="an">Name or nickname (shown in the app)</label><input class="field" id="an" placeholder="Maria">
    <label class="f" for="au">Login name (for logging in, can't be changed)</label><input class="field" id="au" placeholder="maria" autocapitalize="off" spellcheck="false">
    <div class="hint2">Small letters a–z, numbers, dot, dash or underscore.</div>
    <label class="f" for="ap">Starting password</label>
    <div style="display:flex;gap:8px"><input class="field" id="ap" value="${genPassword()}"><button class="btn ghost small" id="regen">↻</button></div>
    <div class="hint2">They can change it in the app.</div>
    <label class="f">Open lessons now</label>
    <select class="field" id="aun"><option value="">None yet</option>${UNITS.filter(u => LESSONS.some(l => unitOf(l.code) === u.n)).map(u => `<option value="${u.n}">Whole ${u.n === 0 ? "Introduction" : "Unit " + u.n}</option>`).join("")}<option value="0.1">Only lesson 0.1</option></select>
    <div class="err" id="aerr"></div>
    <div class="row two"><button class="btn ghost" id="acancel">Cancel</button><button class="btn blue" id="acreate">Create</button></div>`);
  const TR = {а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ie",ж:"zh",з:"z",и:"y",і:"i",ї:"i",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"iu",я:"ia","'":"",ё:"e",ы:"y",э:"e",ъ:""};
  const translit = s => [...s.toLowerCase()].map(c => TR[c] ?? c).join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ".").replace(/[^a-z0-9._-]/g, "").replace(/^[._-]+/, "");
  $("#an").oninput = () => { if (!$("#au").dataset.touched) $("#au").value = translit($("#an").value.trim()); };
  $("#au").oninput = () => $("#au").dataset.touched = "1";
  $("#regen").onclick = () => $("#ap").value = genPassword();
  $("#acancel").onclick = closeModal;
  $("#acreate").onclick = async () => {
    const nickname = $("#an").value.trim(), username = $("#au").value.trim().toLowerCase(), password = $("#ap").value;
    if (!username) { $("#aerr").textContent = "Login name is needed."; return; }
    $("#acreate").disabled = true; $("#aerr").textContent = "";
    try {
      const r = await callAdmin({ action: "create_student", username, nickname: nickname || username, password });
      const sel = $("#aun").value;
      const codes = sel === "" ? [] : sel.includes(".") ? [sel] : LESSONS.filter(l => String(unitOf(l.code)) === sel).map(l => l.code);
      if (codes.length) await sb.from("unlocks").insert(codes.map(lesson => ({ student_id: r.id, lesson })));
      showCredentials(username, password, "Учня створено · Student created ✓");
    } catch (e) { $("#aerr").textContent = e.message; $("#acreate").disabled = false; }
  };
}
function stageOf(s, st){
  if (s.ui_choice === "bi") return 0;
  if (s.ui_override !== null && s.ui_override !== undefined) return s.ui_override;
  const full = ls => ls.length && ls.every(l => lessonPctFrom(st.pr, l.code) >= 100);
  const a1 = LESSONS.filter(l => unitOf(l.code) <= 6);
  if (a1.length === A1_MARK && full(a1)) return 2;
  return full(LESSONS.filter(l => unitOf(l.code) === 0)) ? 1 : 0;
}
function drawClasses(s){
  const box = $("#classes"); if (!box) return;
  if (!T.ledgerOK) { box.innerHTML = `<h3>Заняття · Classes</h3><p class="note">Run <b>supabase/migrate_2.sql</b> in Supabase to turn on class balances.</p>`; return; }
  const bal = balanceOf(s.id), rows = (T.ledger[s.id] || []).slice(0, 20);
  box.innerHTML = `<h3>Заняття · Classes</h3>
    <div class="balbig ${bal <= 3 ? "low" : ""}"><b>${bal}</b><span>${bal < 0 ? "classes owed" : "classes left"}</span></div>
    <div class="row two"><button class="btn blue" id="held">✓ Заняття відбулося<br><small>Class held · −1</small></button><button class="btn ghost" id="pack">＋ Пакет<br><small>Package</small></button></div>
    ${bal <= 3 ? `<div class="row"><button class="btn ghost small" id="remind">✉️ Send a reminder</button></div>` : ""}
    <div class="ledger">${rows.length ? rows.map(r => `<div class="lrow"><span class="ld">${String(r.created_at).slice(0, 10)}</span>
      <span class="lt">${r.kind === "class" ? "Class held" : r.kind === "package" ? `Package +${r.delta}` : `Correction ${r.delta > 0 ? "+" : ""}${r.delta}`}${r.amount ? " · " + money(r.amount) : ""}${r.note ? ` · <span class="note">${esc(r.note)}</span>` : ""}</span>
      <span class="lv ${r.delta < 0 ? "neg" : "pos"}">${r.delta > 0 ? "+" : ""}${r.delta}</span><button class="lx" data-del="${r.id}" title="Delete">✕</button></div>`).join("")
      : `<p class="note">No packages or classes yet.</p>`}</div>`;
  $("#held").onclick = () => classHeld(s);
  $("#pack").onclick = () => openPackage(s);
  if ($("#remind")) $("#remind").onclick = () => openReminder(s);
  box.querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
    if (!b.classList.contains("sure")) { b.classList.add("sure"); b.textContent = "Delete?"; return; }
    const { error } = await sb.from("ledger").delete().eq("id", b.dataset.del);
    if (error) { toast("Couldn't delete: " + error.message); return; }
    T.ledger[s.id] = (T.ledger[s.id] || []).filter(r => String(r.id) !== b.dataset.del); drawClasses(s); toast("Deleted");
  });
}
async function addLedger(s, row){
  const { data, error } = await sb.from("ledger").insert({ student_id: s.id, ...row }).select().single();
  if (error) { toast("Couldn't save: " + error.message); return null; }
  (T.ledger[s.id] ||= []).unshift(data); return data;
}
async function classHeld(s){
  $("#held").disabled = true;
  if (!await addLedger(s, { delta: -1, kind: "class" })) { $("#held").disabled = false; return; }
  const bal = balanceOf(s.id), un = T.unlocks[s.id] || new Set();
  const next = LESSONS.filter(l => !un.has(l.code)).slice(0, 3);
  const after = () => { closeModal(); renderStudent(); if (bal <= 3) openReminder(s); };
  if (!next.length) { toast(`Class recorded · ${bal} left`); return after(); }
  openModal(`<h2>Заняття записано ✓</h2><p class="sub">Class recorded for ${esc(s.nickname)} · <b>${bal}</b> ${bal === 1 ? "class" : "classes"} left.</p>
    <label class="f">Open the lessons you did today:</label>
    ${next.map((l, i) => `<label class="toggle"><input type="checkbox" data-nl="${l.code}" ${i === 0 ? "checked" : ""}><span class="tt">${l.code} · ${esc(ST(l.ua))}<span>${esc(l.en)}</span></span></label>`).join("")}
    <div class="row two"><button class="btn ghost" id="nskip">Skip</button><button class="btn blue" id="nopen">Open</button></div>`);
  $("#nskip").onclick = after;
  $("#nopen").onclick = async () => {
    const codes = [...document.querySelectorAll("[data-nl]:checked")].map(x => x.dataset.nl);
    if (codes.length) {
      const r = await sb.from("unlocks").upsert(codes.map(lesson => ({ student_id: s.id, lesson })), { ignoreDuplicates: true });
      if (r.error) { toast("Couldn't open: " + r.error.message); return; }
      const set = (T.unlocks[s.id] ||= new Set()); codes.forEach(c => set.add(c)); toast(`Opened ${codes.join(", ")}`);
    }
    after();
  };
}
function openPackage(s){
  const P = T.prices.packs || {};
  openModal(`<h2>Новий пакет · New package</h2><p class="sub">for ${esc(s.nickname)}</p>
    <div class="seg">${PACKS.map(n => `<button data-n="${n}">${n === 1 ? "1 · single" : n}</button>`).join("")}</div>
    <label class="f" for="pn">Classes (a negative number corrects the balance)</label><input class="field" id="pn" type="number" inputmode="numeric" value="8">
    <label class="f" for="pa">Paid ${esc(T.prices.currency || "")}</label><input class="field" id="pa" type="number" inputmode="decimal" placeholder="optional">
    <label class="f" for="pnote">Note</label><input class="field" id="pnote" placeholder="optional, e.g. bank transfer">
    <div class="err" id="perr"></div>
    <div class="row two"><button class="btn ghost" id="pc">Cancel</button><button class="btn blue" id="pok">Add</button></div>`);
  const pick = n => { $("#pn").value = n; $("#pa").value = P[n] ?? "";
    document.querySelectorAll("[data-n]").forEach(b => b.classList.toggle("on", +b.dataset.n === n)); };
  document.querySelectorAll("[data-n]").forEach(b => b.onclick = () => pick(+b.dataset.n)); pick(8);
  $("#pc").onclick = closeModal;
  $("#pok").onclick = async () => {
    const n = parseInt($("#pn").value, 10), a = $("#pa").value === "" ? null : Number($("#pa").value);
    if (!n) { $("#perr").textContent = "Enter the number of classes."; return; }
    $("#pok").disabled = true;
    const ok = await addLedger(s, { delta: n, kind: n > 0 ? "package" : "fix", amount: a, note: $("#pnote").value.trim() || null });
    if (ok) { closeModal(); toast(`Balance: ${balanceOf(s.id)} classes`); renderStudent(); } else $("#pok").disabled = false;
  };
}
function openReminder(s){
  const n = Math.max(0, balanceOf(s.id));
  const msg = n === 0
    ? `Привіт, ${s.nickname}! 🙂 Оплачені заняття в пакеті закінчилися. Щоб продовжити, можна поновити пакет.\nHi ${s.nickname}! Your package has no classes left. Let me know when you'd like to renew.`
    : `Привіт, ${s.nickname}! 🙂 У твоєму пакеті залишилось ${n} ${pl(n, "заняття", "заняття", "занять")}. Щоб продовжити без перерви, можна поновити пакет.\nHi ${s.nickname}! You have ${n} ${n === 1 ? "class" : "classes"} left in your package. Let me know when you'd like to renew.`;
  openModal(`<h2>Нагадування · Reminder</h2><p class="sub">${esc(s.nickname)} has <b>${n}</b> ${n === 1 ? "class" : "classes"} left. Edit the message if you like, then send it in your messenger.</p>
    <textarea class="field" id="rmsg" rows="6">${esc(msg)}</textarea>
    <div class="row two"><button class="btn ghost" id="rcl">Close</button><button class="btn blue" id="rsend">Send…</button></div>`);
  $("#rcl").onclick = closeModal;
  $("#rsend").onclick = async () => {
    const text = $("#rmsg").value;
    try { if (navigator.share) { await navigator.share({ text }); closeModal(); return; } } catch(e) { if (e && e.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(text); toast("Copied: paste it in your messenger"); closeModal(); }
    catch(e) { $("#rmsg").select(); toast("Select and copy the text"); }
  };
}
function openPrices(){
  const P = T.prices.packs || {}, cur = T.prices.currency || "€";
  openModal(`<h2>Ціни · Prices</h2><p class="sub">Used to fill in the amount when you add a package. You can still change it for each student.</p>
    <label class="f" for="pcur">Currency</label><input class="field" id="pcur" value="${esc(cur)}" maxlength="4" style="max-width:120px">
    <div class="ptable">${PACKS.map(n => `<div class="prow"><span class="pn">${n === 1 ? "Single class" : n + " classes"}</span>
      <input class="field" data-p="${n}" type="number" inputmode="decimal" value="${P[n] ?? ""}" placeholder="—"><span class="pper" id="pp${n}"></span></div>`).join("")}</div>
    ${T.ledgerOK ? "" : `<p class="note">Run <b>supabase/migrate_2.sql</b> first, then prices can be saved.</p>`}
    <div class="err" id="prerr"></div>
    <div class="row two"><button class="btn ghost" id="prc">Cancel</button><button class="btn blue" id="prs">Save</button></div>`);
  const upd = () => { const single = Number(document.querySelector('[data-p="1"]').value) || 0;
    PACKS.forEach(n => { const v = Number(document.querySelector(`[data-p="${n}"]`).value);
      $("#pp" + n).textContent = v ? `${$("#pcur").value}${(v / n).toFixed(2)} / class${single && n > 1 ? ` · ${Math.round((1 - v / n / single) * 100)}% off` : ""}` : ""; }); };
  document.querySelectorAll("[data-p], #pcur").forEach(i => i.oninput = upd); upd();
  $("#prc").onclick = closeModal;
  $("#prs").onclick = async () => {
    const packs = {}; PACKS.forEach(n => { const v = document.querySelector(`[data-p="${n}"]`).value; if (v !== "") packs[n] = Number(v); });
    const value = { currency: $("#pcur").value.trim() || "€", packs };
    const { error } = await sb.from("app_settings").upsert({ key: "prices", value, updated_at: new Date().toISOString() });
    if (error) { $("#prerr").textContent = error.message; return; }
    T.prices = value; closeModal(); toast("Prices saved");
  };
}
function renderStudent(){
  const s = T.students.find(x => x.id === view.id), st = studentStats(s);
  const weak = st.words.map(w => ({ w, c: st.cs.get(w.id) })).filter(x => x.c && x.c.lapses > 0).sort((a,b) => b.c.lapses - a.c.lapses).slice(0, 12);
  const boxes = Array.from({ length: MAXBOX + 1 }, (_, b) => st.words.filter(w => (st.cs.get(w.id)?.box || 0) === b).length);
  const maxB = Math.max(1, ...boxes);
  $("#tmain").innerHTML = `<div class="top" style="margin-top:14px"><button id="tb">← All students</button><span></span><span></span></div>
    <h2 style="margin-bottom:2px">${esc(s.nickname)} <span class="note">@${esc(s.username)}</span></h2>
    <p class="sub">Last active ${ago(s.last_seen)} · ${st.level.toFixed(1)}% to ${st.goal} (whole book ${st.book.toFixed(1)}%) · ${st.due} words for today · ${st.learned} learned</p>
    <div class="grid2">
      <div class="panel"><h3>Уроки · Lessons</h3><p class="note" style="margin-top:0">Tick a lesson after you've done it in class. Its games and words open in the student's app.</p>
        ${UNITS.filter(u => LESSONS.some(l => unitOf(l.code) === u.n)).map(u => { const ls = LESSONS.filter(l => unitOf(l.code) === u.n); const allOn = ls.every(l => st.un.has(l.code));
          return `<div style="margin-top:12px"><div style="display:flex;justify-content:space-between;align-items:center"><b>${u.n === 0 ? "Вступ" : "Розділ " + u.n}</b>
            <button class="btn ghost small" data-unit="${u.n}" data-on="${allOn ? 0 : 1}">${allOn ? "Close all" : "Open all"}</button></div>
            ${ls.map(l => { const p = lessonPctFrom(st.pr, l.code); return `<label class="toggle"><input type="checkbox" data-l="${l.code}" ${st.un.has(l.code) ? "checked" : ""}>
              <span class="tt">${l.code} · ${esc(ST(l.ua))}<span>${esc(l.en)}</span></span><span class="pc" style="color:${p >= 80 ? "var(--green)" : ""}">${p ? p + "%" : ""}</span></label>`; }).join("")}</div>`; }).join("")}
        <p class="note">Units 2–12 appear here as their games are built.</p></div>
      <div>
        <div class="panel" id="classes"></div>
        <div class="panel"><h3>Мова додатку · App language</h3>
          <p class="note" style="margin-top:0">Automatic: labels turn Ukrainian after the Intro at 100%, everything at A1 at 100%. Now: <b>${["bilingual", "labels in Ukrainian", "all Ukrainian"][stageOf(s, st)]}</b>${s.ui_choice === "bi" ? " (the student chose bilingual)" : ""}.</p>
          <select class="field" id="uiov">${[["", "Automatic"], ["0", "Bilingual"], ["1", "Labels in Ukrainian"], ["2", "All Ukrainian"]].map(([v, t]) =>
            `<option value="${v}" ${String(s.ui_override ?? "") === v ? "selected" : ""}>${t}</option>`).join("")}</select></div>
        <div class="panel"><h3>Слова · Word memory</h3><p class="note" style="margin-top:0">How many words sit in each review box (0 = new, 6 = long-term).</p>
          <div class="bars">${boxes.map((n,b) => `<div style="height:${n / maxB * 100}%" title="${n} words"><span>${b}</span></div>`).join("")}</div><div style="height:18px"></div></div>
        <div class="panel"><h3>Найважчі слова · Hardest words</h3>${weak.length ? weak.map(x => `<div class="toggle"><span class="tt">${esc(ST(x.w.ua))}<span>${esc(x.w.en)} · lesson ${x.w.lesson}</span></span><span class="pc">${x.c.lapses}× wrong</span></div>`).join("") : `<p class="note">No mistakes yet.</p>`}</div>
        <div class="panel"><h3>Акаунт · Account</h3>
          <div class="row"><button class="btn ghost" id="rp">Reset password</button><button class="btn danger" id="del">Delete student</button></div></div>
      </div>
    </div>`;
  $("#tb").onclick = () => renderStudentList();
  drawClasses(s);
  $("#uiov").onchange = async e => {
    const v = e.target.value === "" ? null : +e.target.value;
    const { error } = await sb.from("profiles").update({ ui_override: v }).eq("id", s.id);
    if (error) { toast("Couldn't save: " + error.message); return; }
    s.ui_override = v; toast("Saved"); renderStudent();
  };
  async function setLessons(codes, on){
    const r = on ? await sb.from("unlocks").upsert(codes.map(lesson => ({ student_id: s.id, lesson })), { ignoreDuplicates: true })
                 : await sb.from("unlocks").delete().eq("student_id", s.id).in("lesson", codes);
    if (r.error) { toast("Couldn't save: " + r.error.message); return false; }
    const set = (T.unlocks[s.id] ||= new Set()); codes.forEach(c => on ? set.add(c) : set.delete(c)); return true;
  }
  document.querySelectorAll("[data-l]").forEach(cb => cb.onchange = async () => {
    cb.disabled = true; const ok = await setLessons([cb.dataset.l], cb.checked); if (!ok) cb.checked = !cb.checked; cb.disabled = false;
    if (ok) toast(cb.checked ? `${cb.dataset.l} opened for ${s.nickname}` : `${cb.dataset.l} closed`);
  });
  document.querySelectorAll("[data-unit]").forEach(b => b.onclick = async () => {
    const codes = LESSONS.filter(l => String(unitOf(l.code)) === b.dataset.unit).map(l => l.code);
    if (await setLessons(codes, b.dataset.on === "1")) renderStudent();
  });
  $("#rp").onclick = () => {
    const pw = genPassword();
    openModal(`<h2>Reset password</h2><p class="sub">New password for <b>${esc(s.nickname)}</b>:</p><input class="field" id="rpw" value="${pw}"><div class="err" id="rerr"></div>
      <div class="row two"><button class="btn ghost" id="rc">Cancel</button><button class="btn blue" id="rok">Set password</button></div>`);
    $("#rc").onclick = closeModal;
    $("#rok").onclick = async () => { const p = $("#rpw").value; $("#rok").disabled = true;
      try { await callAdmin({ action: "reset_password", user_id: s.id, password: p }); showCredentials(s.username, p, "Password reset ✓"); }
      catch (e) { $("#rerr").textContent = e.message; $("#rok").disabled = false; } };
  };
  $("#del").onclick = () => {
    openModal(`<h2>Delete ${esc(s.nickname)}?</h2><p class="sub">This removes the login and all progress for <b>@${esc(s.username)}</b>. It can't be undone.</p>
      <label class="f" for="dc">Type the login name to confirm</label><input class="field" id="dc" autocapitalize="off"><div class="err" id="derr"></div>
      <div class="row two"><button class="btn ghost" id="dcan">Cancel</button><button class="btn danger" id="dok">Delete</button></div>`);
    $("#dcan").onclick = closeModal;
    $("#dok").onclick = async () => { if ($("#dc").value.trim() !== s.username) { $("#derr").textContent = "That doesn't match."; return; }
      $("#dok").disabled = true;
      try { await callAdmin({ action: "delete_student", user_id: s.id }); closeModal(); toast("Deleted"); view = { tab: "students" }; renderTeacher(); }
      catch (e) { $("#derr").textContent = e.message; $("#dok").disabled = false; } };
  };
}
