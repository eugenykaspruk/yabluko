/* =====================================================================
   Ucranización · Práctica / Practice
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
let EN = false;   // teacher screens and the teacher's settings are English only
/* Explanation language per student: English or Spanish (profiles.lang). Ukrainian replaces it stage by stage.
   Strings are written in English in the code; X() looks up the Spanish in es.js (ES_UI for the interface,
   ES_TEXT for lesson content, ES_WORDS for word meanings). F() fills {0}, {1}… in a template after translating. */
let LANG = (() => { try { return localStorage.getItem("lang") === "es" ? "es" : "en"; } catch(e){ return "en"; } })();
const X = en => (!EN && LANG === "es" && typeof ES_UI !== "undefined") ? (ES_UI[en] ?? ES_TEXT[en] ?? en) : en;
const F = (t, ...a) => X(t).replace(/\{(\d)\}/g, (_, i) => a[i]);
const L  = (ua, en) => EN ? en : STAGE >= 1 ? ua : `${ua} · ${X(en)}`;              // short labels, inline
const Ls = (ua, en) => EN ? en : STAGE >= 1 ? ua : `${ua}<small>${X(en)}</small>`;  // short labels, stacked
const I  = (ua, en) => EN ? en : STAGE >= 2 ? ua : X(en);                           // instructions (explanation language until stage 2)
const I2 = (ua, en) => STAGE >= 2 ? ua : `${ua} · ${X(en)}`;              // messages already shown in both
const TT = t => { const [a, b] = String(t).split(" · "); return STAGE >= 1 || b === undefined ? a : `${a} · ${X(b)}`; };  // "Ukrainian · English" titles
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
WORDS.forEach(w => w.en0 = w.en);
LESSONS.forEach(l => { l.en0 = l.en; l.words0 = l.words.map(w => [...w]); }); UNITS.forEach(u => u.en0 = u.en);
// Switch word meanings, lesson and unit titles to the student's explanation language (English stays the fallback).
function applyLang(lang){
  LANG = lang === "es" ? "es" : "en"; try { localStorage.setItem("lang", LANG); } catch(e){}
  const es = LANG === "es" && typeof ES_WORDS !== "undefined";
  WORDS.forEach(w => w.en = es && ES_WORDS[w.id] || w.en0);
  LESSONS.forEach(l => { l.en = X(l.en0); l.words = l.words0.map(([ua, en]) => [ua, es && ES_WORDS[l.code + ":" + plain(ua)] || en]); });
  UNITS.forEach(u => u.en = X(u.en0));
  document.documentElement.lang = LANG === "es" ? "es" : "uk";
}
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
  "Match each place to what happens there.": "Знайди пару: місце і подія.",
  "Choose the place.": "Обери місце.",
  "Choose the word that fits.": "Обери правильне слово.",
  "Match the word to «in / at …».": "Знайди пару: слово і де?",
  "в/у + a place (inside), на + an event, an open place or a surface.": "в/у + місце, на + подія або відкрите місце.",
  "Choose the right form after в / у / на.": "Обери правильну форму.",
  "Match the direction to «in the …».": "Знайди пару: сторона світу і де?",
  "розташований agrees with the city: він, вона, воно, вони.": "розташований, -а, -е, -і: як місто.",
  "Match the person to the future of БУТИ.": "Знайди пару: хто і форма БУТИ.",
  "In the past БУТИ agrees with he / she / it / they.": "Минулий час: як він, вона, воно, вони.",
  "In the future БУТИ changes with the person.": "Майбутній час: як я, ти, він…",
  "Match the country to «in …».": "Знайди пару: країна і де?",
  "Where is it? Choose the place.": "Де це? Обери місце.",
  "Match what you can do to the place.": "Знайди пару: що можна робити і де.",
  "Choose the phrase.": "Обери фразу.",
  "Match the adjective to its noun (look at the ending).": "Знайди пару: прикметник і слово.",
  "Complete the postcard.": "Допиши поштівку.",
};
const HU = h => STAGE >= 2 ? (HINT_UA[h] || X(h)) : X(h);

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
// The base of a word: no stress marks, no "(plural)" note, lower case. "стіле`ць (стільці`)" → "стілець".
const baseOf = ua => plain(ua).replace(/\s*\(.*?\)\s*/g, " ").trim().toLowerCase();
// Meaning without a disambiguating note: "number (amount)" → "number". Synonyms share it.
const meaningOf = en => String(en).replace(/\s*\(.*?\)\s*$/, "").trim().toLowerCase();
// A word that comes back in a later lesson keeps one review card: the one from the earliest unlocked lesson.
const deck = () => { const seen = new Set();
  return WORDS.filter(w => { if (!unlocked.has(w.lesson) || !w.review) return false;
    const b = baseOf(w.ua); if (seen.has(b)) return false; seen.add(b); return true; }); };
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
  if (location.hash === "#keyboard") return renderKeyboard();
  $("#app").className = "wrap";
  $("#app").innerHTML = `<div class="login">
    <div class="logo">🇺🇦</div>
    <h1 style="text-align:center">Ucranización</h1>
    <p class="sub" style="text-align:center">Práctica · Practice</p>
    <form id="lf">
      <label class="f" for="lu">${L("Логін", "Username")}</label>
      <input class="field" id="lu" autocomplete="username" autocapitalize="off" spellcheck="false" required>
      <label class="f" for="lp">${L("Пароль", "Password")}</label>
      <input class="field" id="lp" type="password" autocomplete="current-password" required>
      <div class="err" id="lerr">${esc(msg||"")}</div>
      <button class="btn blue" id="lbtn">${L("Увійти", "Log in")}</button>
    </form>
    <p class="hint2" style="text-align:center;margin-top:16px">${X("Forgot your password? Ask your teacher to reset it.")}</p>
    <p style="text-align:center;margin-top:18px"><a class="kblink" href="#keyboard">⌨️ ${L("Українська клавіатура", "Ukrainian keyboard")}</a></p>
  </div>`;
  $("#lf").onsubmit = async e => {
    e.preventDefault();
    const u = $("#lu").value.trim(), p = $("#lp").value;
    const email = u.includes("@") ? u : `${u.toLowerCase()}@${STUDENT_DOMAIN}`;
    $("#lbtn").disabled = true; $("#lerr").textContent = "";
    const { error } = await sb.auth.signInWithPassword({ email, password: p });
    $("#lbtn").disabled = false;
    if (error) $("#lerr").textContent = /invalid/i.test(error.message) ? I2("Неправильний логін або пароль", "Wrong username or password")
      : /banned/i.test(error.message) ? I2("Доступ закрито: пакет закінчився. Напиши вчителю", "Access closed: your package has ended. Message your teacher.") : error.message;
  };
}

/* =====================================================================
   LOAD
   ===================================================================== */
async function loadMe(user){
  const { data: p, error } = await sb.from("profiles").select("*").eq("id", user.id).single();
  if (error || !p) { await sb.auth.signOut(); renderLogin(I2("Профіль не знайдено", "Profile not found. Ask your teacher.")); return false; }
  me = p;
  if (!isTeacher()) applyLang(p.lang || LANG);
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
  if (u.error || c.error || g.error) { $("#app").innerHTML = `<p class="status">${I2("Не вдалося завантажити", "Couldn't load your data. Refresh to try again.")}</p>`; return false; }
  unlocked = new Set(u.data.map(r => r.lesson).filter(c => BYCODE[c]));
  unlockedAt = Object.fromEntries(u.data.map(r => [r.lesson, r.unlocked_at]));
  cards = new Map(c.data.map(r => [r.word_id, r]));
  prog = {}; for (const r of g.data) (prog[r.lesson] ||= {})[r.game] = r.best;
  await loadBalance();
  if (BAL !== null && BEXP && daysTo(BEXP) < -14) {   // package ended more than 14 days ago: login closed (also enforced in Supabase, migrate_4.sql)
    loginMsg = I2("Доступ закрито: пакет закінчився. Напиши вчителю", "Access closed: your package has ended. Message your teacher.");
    await sb.auth.signOut();
    return false;
  }
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
  openModal(`<div class="congrats"><div class="cbig">${t.h}</div><p>${t.ua}</p><p class="note">${X(t.en)}</p>
    <div class="row"><button class="btn blue" id="cok">${I2("Чудово!", "Great!")}</button></div></div>`);
  $("#cok").onclick = closeModal;
}
let BAL = null;   // classes left, null until the database has the class balance
let BEXP = null;  // last package valid until (YYYY-MM-DD), needs supabase/migrate_3.sql
async function loadBalance(){
  if (!me || isTeacher()) return;
  const r = await sb.rpc("my_package");
  if (!r.error && r.data) { BAL = r.data.balance; BEXP = r.data.expires_on || null; return; }
  const { data, error } = await sb.rpc("my_balance");
  BAL = error ? null : data;
}
const dmy = d => new Date(d + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const daysTo = d => Math.round((new Date(d + "T12:00:00") - new Date(today() + "T12:00:00")) / 864e5);
function balanceBanner(){
  if (BAL !== null && BAL > 0 && BEXP && daysTo(BEXP) <= 7) {
    const d = dmy(BEXP), left = daysTo(BEXP);
    return left < 0
      ? `<div class="balbar zero">${I2(`Термін пакета минув ${d}. Напиши вчителю`, F("Your package expired on {0}. Message your teacher", d))}</div>`
      : `<div class="balbar">${I2(`Пакет діє до ${d}: залишилось ${BAL} ${pl(BAL, "заняття", "заняття", "занять")}`, F(BAL === 1 ? "Your package is valid until {0}: {1} class left" : "Your package is valid until {0}: {1} classes left", d, BAL))}</div>`;
  }
  if (BAL === null || BAL > 3) return "";
  const n = Math.max(0, BAL);
  return n === 0
    ? `<div class="balbar zero">${I2("Оплачені заняття закінчилися. Напиши вчителю, щоб поновити пакет", "No paid classes left. Message your teacher to renew")}</div>`
    : `<div class="balbar">${I2(`Залишилось ${n} ${pl(n, "заняття", "заняття", "занять")}. Час поновити пакет`, F(n === 1 ? "{0} class left. Time to renew your package" : "{0} classes left. Time to renew your package", n))}</div>`;
}

/* ---------- always run the newest version ----------
   GitHub Pages lets browsers keep files for up to 10 minutes. On start and whenever the app
   comes back to the screen, compare with docs/version.txt and reload if a newer one is out. */
async function checkVersion(){
  try {
    const v = (await (await fetch("version.txt?t=" + Date.now(), { cache: "no-store" })).text()).trim();
    if (v && window.APP_V && v !== window.APP_V && sessionStorage.getItem("yabluko-reloaded") !== v) {
      sessionStorage.setItem("yabluko-reloaded", v);
      location.replace(location.pathname + "?v=" + v + location.hash);
    }
  } catch(e) {}
}
checkVersion();
document.addEventListener("visibilitychange", () => { if (!document.hidden) checkVersion(); });

let booted = false, loginMsg = "";
sb.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) { me = null; booted = false; renderLogin(loginMsg); loginMsg = ""; return; }
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
  else { view = { tab: "home" }; setTimeout(() => toast(I2(`Урок ${code} відкриється після заняття`, F("Lesson {0} opens after your class", code))), 300); }
  render(); return true;
}
window.addEventListener("hashchange", () => { if (location.hash === "#keyboard") renderKeyboard(); else if (me) openFromHash(); });

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
      <div class="lbl"><span><b>${pct < 1 && pct > 0 ? pct.toFixed(1) : Math.round(pct)}%</b> · ${done} / ${N} ${STAGE >= 1 ? "уроків" : X("lessons done")}</span></div>
      <div class="bbar"><div class="open" style="width:${opened / N * 100}%"></div><i style="width:${pct}%"></i>
        <div class="mark" style="left:100%"><span>${goal}</span></div></div>
      <div class="legend2"><span><i style="background:var(--blue)"></i>${STAGE >= 1 ? "опрацьовано" : X("practised")}</span><span><i class="op"></i>${STAGE >= 1 ? "відкрито" : X("opened in class")} (${opened})</span></div>
    </div>`;
}
function render(){
  if (location.hash === "#keyboard") return renderKeyboard();
  if (!me) return renderLogin();
  EN = false;
  updateStage();
  if (view.tab === "students" || view.tab === "student") { $("#app").className = "wrap wide"; return renderTeacher(); }
  $("#app").className = "wrap";
  const inSession = rs.view !== "menu";
  const inLesson = !inSession && view.tab === "lesson";
  $("#app").innerHTML = `${inLesson ? "" : `
    <div class="head">
      <div><h1>Привіт, ${esc(me.nickname)}!</h1>${isTeacher() ? `<p class="sub" style="margin:0">Teacher preview · nothing here is saved</p>` : ""}</div>
      <div class="who">${isTeacher() ? `<button class="chip" id="toT">👩‍🏫 Students</button>` : ""}${!isTeacher() && BAL !== null ? `<span class="balchip ${BAL <= 3 ? "low" : ""}">${STAGE >= 1 ? "Баланс" : X("Balance")}: <b>${Math.max(0, BAL)}</b></span>` : ""}<button class="chip" id="settings" aria-label="Settings">⚙️</button></div>
    </div>`}
    ${inSession || view.tab === "lesson" || view.tab === "list" || view.tab === "lessons" ? "" : bookBar()}
    <section id="main"></section>`;
  if ($("#settings")) $("#settings").onclick = () => openSettings();
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
    <h3 class="sec">${STAGE >= 1 ? "Уроки" : `Уроки <small>${X("Lessons")}</small>`}</h3>
    <div class="lessons">${open.slice(0, 3).map(lessonRow).join("")}
      ${open.length > 3 ? `<button class="more-l" id="allL">${L("Усі уроки", "All lessons")} (${open.length}) →</button>`
        : lockedCount ? lockedRow(lockedCount) : ""}</div>
    <h3 class="sec">${STAGE >= 1 ? "Ще практика" : `Ще практика <small>${X("More practice")}</small>`}</h3>
    <div class="modes">
      <button class="mode" data-m="type" ${met < 4 ? "disabled" : ""}><span class="ic">⌨️</span><b>Пиши</b><span>${I("Напиши українською", "Type it in Ukrainian")}</span></button>
      <button class="mode" data-m="mc" ${met < 4 ? "disabled" : ""}><span class="ic">✅</span><b>Тест</b><span>${I("Обери значення", "Pick the meaning")}</span></button>
      <button class="mode" data-m="gender" ${nouns < 3 ? "disabled" : ""}><span class="ic">🎨</span><b>він · вона · воно</b><span>${I("Рід іменників", "Noun genders")}</span></button>
      <button class="mode" data-m="stress" ${str < 3 ? "disabled" : ""}><span class="ic">🎯</span><b>Наголос</b><span>${I("Знайди наголос", "Find the stress")}</span></button>
      <button class="mode wide" id="toList"><span class="ic">📖</span><b>${L("Словник", "Word list")}</b><span>${STAGE >= 2 ? `слів: ${d.length} · вивчено: ${d.filter(w => (cardOf(w.id).box || 0) >= 3).length}` : F("{0} words · {1} learned · newest first", d.length, d.filter(w => (cardOf(w.id).box || 0) >= 3).length)}</span></button>
      <button class="mode wide" id="toKb"><span class="ic">🇺🇦</span><b>${L("Клавіатура", "Keyboard")}</b><span>${I("Пиши українською і копіюй у Miro", "Type in Ukrainian and copy it into Miro")}</span></button>
    </div>
    ${met < 4 && d.length ? `<p class="status">${I("Ігри відкриються після перших карток.", "The practice games open after your first flashcards.")}</p>` : ""}`;
  if ($("#start")) $("#start").onclick = () => startReview("cards");
  if ($("#extra")) $("#extra").onclick = () => startReview("mix");
  el.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { view = { tab: "lesson", code: b.dataset.l, game: "words" }; render(); window.scrollTo(0, 0); });
  el.querySelectorAll("[data-m]").forEach(b => b.onclick = () => startReview(b.dataset.m));
  $("#toList").onclick = () => { view = { tab: "list" }; render(); window.scrollTo(0, 0); };
  $("#toKb").onclick = () => { location.hash = "keyboard"; };
  if ($("#allL")) $("#allL").onclick = () => { view = { tab: "lessons" }; render(); window.scrollTo(0, 0); };
}
function lessonRow(code){
  const l = BYCODE[code], p = lessonPct(code);
  return `<button class="lesson" data-l="${code}"><span class="code">${code}</span>
    <span class="t"><b>${esc(ST(l.ua))}</b>${STAGE >= 2 ? "" : `<span>${esc(l.en)}</span>`}<div class="mini"><i class="${p >= 80 ? "full" : ""}" style="width:${p}%"></i></div></span>
    <span class="pct ${p >= 80 ? "done" : ""}">${p >= 80 ? "✓" : p + "%"}</span></button>`;
}
const lockedRow = n => `<div class="lesson locked"><span class="code">🔒</span><span class="t"><span>${I(`Ще ${n} ${pl(n, "урок відкриється", "уроки відкриються", "уроків відкриються")} після занять`, F("{0} more lessons open after your classes", n))}</span></span></div>`;
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
    const lang = LANG === "es" ? "Español" : "English";
    openModal(`<h2>${L("Налаштування", "Settings")}</h2>
      <p class="sub">${L("Логін", "Login name")}: <b>${esc(me.username)}</b></p>
      <div class="setlist">
        <button class="setrow" data-p="theme"><span class="si">🎨</span><span class="st">${Ls("Тема", "Theme")}</span><span class="sv">${th}</span><span class="sa">›</span></button>
        <button class="setrow" data-p="nick"><span class="si">🙂</span><span class="st">${Ls("Нікнейм", "Nickname")}</span><span class="sv">${esc(me.nickname)}</span><span class="sa">›</span></button>
        <button class="setrow" data-p="pw"><span class="si">🔑</span><span class="st">${Ls("Пароль", "Password")}</span><span class="sv">••••••••</span><span class="sa">›</span></button>
        ${isTeacher() ? "" : `<button class="setrow" data-p="lang"><span class="si">🌐</span><span class="st">Мова<small>${X("App language")}</small></span><span class="sv">${lang}</span><span class="sa">›</span></button>`}
      </div>
      <div class="row two" style="margin-top:22px"><button class="btn danger" id="logout">${L("Вийти", "Log out")}</button><button class="btn" id="closeS">${L("Готово", "Done")}</button></div>`);
    $("#sheet").querySelectorAll("[data-p]").forEach(b => b.onclick = () => openSettings(b.dataset.p));
    $("#closeS").onclick = closeModal;
    $("#logout").onclick = async () => { closeModal(); await sb.auth.signOut(); };
    return;
  }
  if (page === "lang") {
    // explanation language; how much Ukrainian the app uses is automatic (STAGE), no manual choice
    openModal(`<button class="setback" id="sback">← Налаштування · ${X("Settings")}</button><h2>Мова · ${X("App language")}</h2>
      <h3 class="sec" style="margin-top:6px">Мова пояснень <small>Explanations · Explicaciones</small></h3>
      <div class="setlist" id="xl">
        <button class="setrow ${LANG === "en" ? "on" : ""}" data-x="en"><span class="si">🇬🇧</span><span class="st">English<small>Explanations in English</small></span><span class="sa">${LANG === "en" ? "✓" : ""}</span></button>
        <button class="setrow ${LANG === "es" ? "on" : ""}" data-x="es"><span class="si">🇪🇸</span><span class="st">Español<small>Explicaciones en español</small></span><span class="sa">${LANG === "es" ? "✓" : ""}</span></button>
      </div>
      <p class="sub" style="margin-top:14px">Коли ти завершуєш етапи на 100%, додаток поступово переходить на українську. · ${X("As you finish stages at 100%, the app gradually switches to Ukrainian.")}</p>`);
    $("#xl").querySelectorAll("[data-x]").forEach(b => b.onclick = async () => {
      applyLang(b.dataset.x); me.lang = LANG;
      sb.from("profiles").update({ lang: LANG }).eq("id", me.id).then(() => {});   // needs supabase/migrate_5.sql
      render(); openSettings("lang");
    });
    $("#sback").onclick = () => openSettings();
    return;
  }
  if (page === "theme") {
    const th = getTheme();
    openModal(back + `<h2>${L("Тема", "Theme")}</h2>
      <div class="setlist" id="theme">${(EN ? [["auto","🌗","Auto","Follows your device"],["light","☀️","Light",""],["dark","🌙","Dark",""]] : [["auto","🌗","Авто",I("Як на телефоні", "Follows your phone")],["light","☀️","Світла",STAGE >= 1 ? "" : "Light"],["dark","🌙","Темна",STAGE >= 1 ? "" : "Dark"]]).map(([k,i,t,e]) =>
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
      : `<div class="row"><button class="btn" id="show">${STAGE >= 1 ? "Показати відповідь" : "Показати · " + X("Show answer")}</button></div>`}`;
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
const TOUCH = matchMedia("(pointer: coarse)").matches;
function nativeKb(v){ try { if (v !== undefined) localStorage.setItem("nativeKb", v ? "1" : ""); return !!localStorage.getItem("nativeKb"); } catch(e){ return false; } }
function setCaret(inp, i){ if (document.activeElement !== inp) return; try { inp.setSelectionRange(i, i); } catch(e){} }
const KB_ROWS = ["й ц у к е н г ш щ з х ї", "ф і в а п р о л д ж є", "ґ я ч с м и т ь б ю '"].map(r => r.split(" "));

/* ---------- keyboard page (#keyboard): type Ukrainian without a Ukrainian keyboard, then copy it into Miro.
   Works without logging in. The computer's own keys type Ukrainian too, by position (the standard Ukrainian layout,
   the same one the on-screen keys show); the small Latin letter on each key says which key that is. ---------- */
const KB_LATIN = { "й":"Q","ц":"W","у":"E","к":"R","е":"T","н":"Y","г":"U","ш":"I","щ":"O","з":"P","х":"[","ї":"]",
  "ф":"A","і":"S","в":"D","а":"F","п":"G","р":"H","о":"J","л":"K","д":"L","ж":";","є":"'",
  "ґ":"\\","я":"Z","ч":"X","с":"C","м":"V","и":"B","т":"N","ь":"M","б":",","ю":".","'":"`" };
const KB_CODE = { Backquote:"'", Backslash:"ґ", IntlBackslash:"ґ" };
for (const [c, k] of Object.entries(KB_LATIN)) if (/^[A-Z]$/.test(k)) KB_CODE["Key" + k] = c;
Object.assign(KB_CODE, { BracketLeft:"х", BracketRight:"ї", Semicolon:"ж", Quote:"є", Comma:"б", Period:"ю" });
const KB_SHIFT_ONLY = { Slash: [".", ","], Digit2: [null, '"'], Digit4: [null, ";"], Digit6: [null, ":"], Digit7: [null, "?"] };
const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
function kbText(v){ try { if (v !== undefined) localStorage.setItem("kbText", v); return localStorage.getItem("kbText") || ""; } catch(e){ return v || ""; } }
function closeKeyboard(){ history.replaceState(null, "", location.pathname + location.search); if (me) goHome(); else renderLogin(); }
function renderKeyboard(){
  $("#app").className = "wrap";
  const paste = IS_MAC ? "⌘V" : "Ctrl+V", phone = TOUCH && !nativeKb();
  const key = x => `<button data-c="${esc(x)}">${esc(x)}${TOUCH ? "" : `<i>${esc(KB_LATIN[x] || "")}</i>`}</button>`;
  $("#app").innerHTML = `<div class="top"><button id="kbBack">← Назад</button><span>${L("Клавіатура", "Keyboard")}</span><span></span></div>
    <p class="sub" style="margin:4px 0 0">${I("Пиши тут, а потім скопіюй у Miro.", "Type here, then copy it into Miro.")}</p>
    <textarea class="kbtext" id="kbt" rows="3" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="українською…" ${phone ? 'readonly inputmode="none"' : ""}>${esc(kbText())}</textarea>
    <div class="row two kbacts"><button class="btn ghost" id="kbClear">${L("Стерти", "Clear")}</button><button class="btn blue" id="kbCopy">📋 ${L("Копіювати", "Copy")}</button></div>
    ${nativeKb() && TOUCH ? "" : `<div class="kb kbpage">${KB_ROWS.map(r => `<div class="kr">${r.map(key).join("")}</div>`).join("")}
      <div class="kr"><button class="sh" data-c="SH" aria-label="Shift">⇧</button><button data-c=",">,</button><button class="sp" data-c=" ">${L("пробіл", "space")}</button><button data-c=".">.</button><button data-c="?">?</button><button class="bs" data-c="BS">⌫</button><button class="bs" data-c="NL" aria-label="New line">↵</button></div></div>`}
    ${TOUCH ? `<button class="kbswitch" id="kbswitch">${nativeKb() ? "🇺🇦 " + L("Клавіатура додатка", "Use the app keyboard") : "⌨️ " + L("Моя клавіатура", "Use my phone keyboard")}</button>`
      : `<p class="hint2" style="text-align:center">${I("Клавіші комп'ютера теж пишуть українською: маленька літера показує, яку клавішу натиснути.", "Your computer keys type Ukrainian here too: the small letter shows which key to press.")}</p>`}`;
  const ta = $("#kbt"); let shift = false;
  const save = () => kbText(ta.value);
  function put(c){
    const focused = document.activeElement === ta, v = ta.value;
    const a = focused ? ta.selectionStart : v.length, b = focused ? ta.selectionEnd : v.length;
    if (c === "BS") { const from = b > a ? a : Math.max(0, a - 1); ta.value = v.slice(0, from) + v.slice(b); setCaret(ta, from); }
    else { ta.value = v.slice(0, a) + c + v.slice(b); setCaret(ta, a + c.length); }
    save();
  }
  function paintShift(){ document.querySelectorAll(".kbpage [data-c]").forEach(k => { const c = k.dataset.c;
      if (c.length === 1 && KB_LATIN[c] !== undefined && c !== "'") k.firstChild.textContent = shift ? c.toUpperCase() : c; });
    const sk = document.querySelector(".kbpage .sh"); if (sk) sk.classList.toggle("on", shift); }
  document.querySelectorAll(".kbpage [data-c]").forEach(b => {
    b.onpointerdown = e => e.preventDefault();
    b.onclick = () => { const c = b.dataset.c;
      if (c === "SH") { shift = !shift; return paintShift(); }
      if (c === "BS") return put("BS");
      if (c === "NL") return put("\n");
      put(shift ? c.toUpperCase() : c);
      if (shift && c !== " ") { shift = false; paintShift(); } };
  });
  // the computer's own keys, mapped by position; Ctrl/⌘/Alt shortcuts (copy, paste, select all) pass through
  ta.onkeydown = e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const up = e.shiftKey !== (e.getModifierState && e.getModifierState("CapsLock"));
    let c = KB_CODE[e.code];
    if (c) c = up && c !== "'" ? c.toUpperCase() : c;
    else if (KB_SHIFT_ONLY[e.code]) c = KB_SHIFT_ONLY[e.code][e.shiftKey ? 1 : 0];
    if (!c) return;
    e.preventDefault(); put(c);
  };
  ta.oninput = save;
  $("#kbBack").onclick = closeKeyboard;
  $("#kbClear").onclick = () => { ta.value = ""; save(); if (!TOUCH) ta.focus(); };
  $("#kbCopy").onclick = async () => {
    const t = ta.value; if (!t.trim()) return toast(I2("Ще нічого копіювати", "Nothing to copy yet"));
    let ok = false;
    try { await navigator.clipboard.writeText(t); ok = true; } catch(e) {
      try { const r = ta.readOnly; ta.readOnly = false; ta.select(); ok = document.execCommand("copy"); ta.readOnly = r; } catch(e2){} }
    toast(ok ? I2(`Скопійовано! Встав у Miro: ${paste}`, F("Copied! Paste it into Miro with {0}", paste))
             : I2(`Не вдалося: виділи текст і натисни ${IS_MAC ? "⌘C" : "Ctrl+C"}`, F("Couldn't copy: select the text and press {0}", IS_MAC ? "⌘C" : "Ctrl+C")));
  };
  const ks = $("#kbswitch"); if (ks) { ks.onpointerdown = e => e.preventDefault(); ks.onclick = () => { nativeKb(!nativeKb()); renderKeyboard(); if (nativeKb()) { try { $("#kbt").focus(); } catch(e){} } }; }
  if (!TOUCH) setTimeout(() => { try { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } catch(e){} }, 30);
}
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
// Capital letters count: proper names (Київ) and the polite Вас must be written as in the word list.
// Only the first letter of a phrase (Добрий день!) is free, like the start of any sentence.
const cleanC = s => plain(s).replace(/[’ʼ´`]/g,"'").replace(/\(.*?\)/g,"").replace(/[…?!.,]/g,"").replace(/\s+/g," ").trim();
function caseOk(given, w){
  const g = cleanC(given), lf = t => t.includes(" ") ? t.charAt(0).toLowerCase() + t.slice(1) : t;
  const forms = String(w.ua).replace(/\(([^)]*)\)/g, "").split(/\s*\/\s*/).map(cleanC);
  forms.push(cleanC(w.ua));
  return forms.some(f => f === g || lf(f) === lf(g));
}
function checkTyped(given, w){
  const g = clean(given); if (!g) return { kind:"bad" };
  // accept any word in the deck that shares this English meaning
  const syn = deck().filter(x => meaningOf(x.en0) === meaningOf(w.en0));
  const pool = syn.flatMap(x => variants(x.ua));
  if (pool.includes(g)) {
    const hit = variants(w.ua).includes(g) ? w : syn.find(x => variants(x.ua).includes(g));
    // spelled right but with the wrong capital letters (київ, як вас звати): almost right
    if (!caseOk(given, hit || w)) return { kind:"near", why:"case" };
    return hit && hit.id !== w.id ? { kind:"ok", syn: hit } : { kind:"ok" };
  }
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
    let pool = deck().filter(x => x.id !== w.id && meaningOf(x.en0) !== meaningOf(w.en0));
    if (pool.length < 3) pool = WORDS.filter(x => x.id !== w.id && meaningOf(x.en0) !== meaningOf(w.en0));
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
      <input class="answer ${a ? a.kind : ""}" id="ans" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="українською…" value="${a ? esc(a.given) : ""}" ${a ? "readonly" : TOUCH && !nativeKb() ? 'readonly inputmode="none"' : ""}>
      ${a ? "" : `${nativeKb() ? "" : `<div class="kb">${KB_ROWS.map(r => `<div class="kr">${r.map(x => `<button data-c="${x}">${x}</button>`).join("")}</div>`).join("")}<div class="kr"><button class="sh" data-c="SH" aria-label="Shift">⇧</button><button class="sp" data-c=" ">${L("пробіл", "space")}</button><button class="bs" data-c="BS">⌫</button></div></div>`}
      ${TOUCH ? `<button class="kbswitch" id="kbswitch">${nativeKb() ? "🇺🇦 " + L("Клавіатура додатка", "Use the app keyboard") : "⌨️ " + L("Моя клавіатура", "Use my phone keyboard")}</button>` : ""}`}
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
    const inp = $("#ans");
    // On a phone the app keypad is the keyboard: the field is read-only (inputmode="none" too), which keeps the phone's own keyboard closed,
    // and keys never take focus, so nothing pops up or jumps while typing. "Use my phone keyboard" switches back.
    if (!TOUCH || nativeKb()) setTimeout(() => { try { inp.focus(); } catch(e){} }, 30);
    inp.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); submitTyped(inp.value); } };
    el.querySelectorAll("[data-c]").forEach(b => {
      b.onpointerdown = e => e.preventDefault();
      b.onclick = () => {
        if (b.dataset.c === "SH") { shift = !shift; paintShift(); return; }
        const v = inp.value, at = document.activeElement === inp ? inp.selectionStart ?? v.length : v.length;
        const end = document.activeElement === inp ? inp.selectionEnd ?? at : at;
        if (b.dataset.c === "BS") { const from = end > at ? at : Math.max(0, at - 1); inp.value = v.slice(0, from) + v.slice(end); setCaret(inp, from); }
        else { const c = shift ? b.dataset.c.toUpperCase() : b.dataset.c; inp.value = v.slice(0, at) + c + v.slice(end); setCaret(inp, at + c.length);
          if (shift && b.dataset.c !== " ") { shift = false; paintShift(); } }
      };
    });
    // ⇧ capitalises the next letter only, like a phone keyboard
    let shift = false;
    function paintShift(){ el.querySelectorAll(".kb [data-c]").forEach(k => { const c = k.dataset.c;
      if (c.length === 1 && c !== " ") k.textContent = shift ? c.toUpperCase() : c; });
      const sk = el.querySelector(".kb .sh"); if (sk) sk.classList.toggle("on", shift); }
    const ks = $("#kbswitch"); if (ks) { ks.onpointerdown = e => e.preventDefault(); ks.onclick = () => {
      const typed = inp.value; nativeKb(!nativeKb()); renderDrill(); const n = $("#ans"); n.value = typed;
      if (nativeKb()) { try { n.focus(); } catch(e){} } }; }
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
const GNAME = new Proxy({}, { get: (_, k) => STAGE >= 2 ? GNAME_UA[k] : X(GNAME_EN[k]) });
function feedback(a, w){
  const sol = `<b>${esc(ST(w.ua))}</b>`; let html;
  if (rs.mode === "gender") {
    html = a.kind === "ok" ? `<div class="fb ok">✅ Правильно! <b>${esc(ST(rs.q.form))}</b> — ${GNAME[rs.q.g]}</div>`
      : `<div class="fb bad">❌ <b>${esc(ST(rs.q.form))}</b> — ${GNAME[rs.q.g]}<br><span class="note">${I("Повториться в кінці.", "Comes back at the end.")}</span></div>`;
  } else if (rs.mode === "stress") {
    html = a.kind === "ok" ? `<div class="fb ok">✅ Правильно! ${esc(ST(rs.q.word))}</div>` : `<div class="fb bad">❌ ${I("Правильно:", "It's")} <b>${esc(ST(rs.q.word))}</b><br><span class="note">${I("Повториться в кінці.", "Comes back at the end.")}</span></div>`;
  } else if (a.kind === "ok") html = a.syn
      ? `<div class="fb ok">✅ Правильно! <b>${esc(ST(a.syn.ua))}</b> · ${I("також:", "also:")} ${sol}</div>`
      : `<div class="fb ok">✅ Правильно! ${rs.mode === "type" ? sol : sol + " = " + esc(w.en)}</div>`;
  else if (a.kind === "near") html = `<div class="fb near">🟠 Майже! ${a.why === "iy" ? I("Зверни увагу на <b>и</b> та <b>і</b>.", "Watch <b>и</b> and <b>і</b>.") : a.why === "case" ? I("Зверни увагу на великі літери.", "Watch the capital letters.") : I("Маленька помилка.", "Small typo.")} ${I("Правильно:", "Correct:")} ${sol}</div>`;
  else html = `<div class="fb bad">❌ ${I("Правильна відповідь:", "Correct:")} ${sol} = ${esc(w.en)}<br><span class="note">${I("Повториться в кінці.", "Comes back at the end.")}</span></div>`;
  return html + `<div class="row"><button class="btn" id="next">Далі →</button></div>`;
}
function advance(){ rs.done++; rs.cur = rs.queue.shift() || null; prepQuestion(); renderDrill(); }
function renderDone(){
  const el = $("#main");
  if (rs.mode === "cards") {
    const met = deck().filter(w => cards.has(w.id)).length;
    el.innerHTML = `<div class="empty"><div class="big">Молодець! 💪</div>${I(`Пройдено ${rs.done} ${pl(rs.done, "картку", "картки", "карток")}.`, F("{0} cards done.", rs.done))}${met >= 4 ? "<br>" + I("Тепер швидка перевірка: 5 запитань.", "Now a quick check: 5 questions.") : ""}</div>
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
    if (!ls.length) return `<div class="unit">${head}<div class="lesson locked"><span class="code">🔒</span><span class="t"><span>${F("{0} lessons · coming soon", u.lessons)}</span></span></div></div>`;
    return `<div class="unit">${head}<div class="lessons">${ls.map(l => {
      const open = unlocked.has(l.code), p = lessonPct(l.code);
      return `<button class="lesson ${open ? "" : "locked"}" data-l="${l.code}" ${open ? "" : "disabled"}>
        <span class="code">${open ? l.code : "🔒"}</span>
        <span class="t"><b>${esc(ST(l.ua))}</b><span>${esc(l.en)}</span>${open ? `<div class="mini"><i class="${p >= 80 ? "full" : ""}" style="width:${p}%"></i></div>` : ""}</span>
        <span class="pct ${p >= 80 ? "done" : ""}">${open ? (p >= 80 ? "✓" : p + "%") : ""}</span></button>`; }).join("")}</div></div>`;
  }).join("") + `<p class="status">${X("Lessons open after your class. A lesson counts as done at 80%.")}</p>`;
  el.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { view = { tab: "lesson", code: b.dataset.l, game: "words" }; render(); });
}
/* A lesson has three tabs: Theory (grammar notes), Practice (the numbered games, which make the lesson %)
   and Extra (more games and resources from l.extra; progress is saved and the teacher sees it, but it doesn't
   count towards the lesson %). First visit opens Theory; after that, the tab the student was on last. */
const XKIND = { video: "🎬", song: "🎵", article: "📰", podcast: "🎧" };
function extraItems(l, lang = LANG){
  const x = l.extra || {};
  const g = (x.games || []).map((s, i) => ({ kind: "game", i, s, k: "x" + i }));
  const r = (x.res || []).map((s, i) => ({ kind: "res", i, s, k: "r" + i }))
    .filter(it => it.s.lang === "es" ? lang === "es" : !it.s.only || it.s.only === lang);   // Spanish resources only for Spanish students; an English one with a Spanish replacement is marked only:"en"
  return [...g, ...r];
}
function xPct(rec, it){
  if (it.kind === "res") return rec[it.k] ? 100 : 0;
  return Math.min(100, Object.keys(rec).filter(x => x.startsWith(it.k + "#")).length / it.s.items.length * 100);
}
const xNew = (rec, l) => extraItems(l).filter(it => !xPct(rec, it)).length;
function lessonTabs(l){ return [...((GRAMMAR[l.code] || []).length ? ["teo"] : []), "pra", ...(extraItems(l).length ? ["ext"] : [])]; }
function lessonTab(l){
  const t = lessonTabs(l); let last = null;
  if (view.ltab && t.includes(view.ltab)) return view.ltab;
  try { last = localStorage.getItem("ltab:" + l.code); } catch(e){}
  return t.includes(last) ? last : t[0];
}
function setTab(l, t){ view.ltab = t; try { localStorage.setItem("ltab:" + l.code, t); } catch(e){} }
function renderLesson(){
  const l = BYCODE[view.code], g = games(l), rec = prog[l.code] || {};
  const tab = lessonTab(l), tabs = lessonTabs(l), nx = xNew(rec, l);
  setTab(l, tab);
  const tname = { teo: STAGE >= 1 ? "Теорія" : X("Theory"), pra: STAGE >= 1 ? "Практика" : X("Practice"), ext: STAGE >= 1 ? "Додатково" : X("Extra") };
  $("#main").innerHTML = `<div class="top"><button id="backL">← Назад</button><span id="lpct">${lessonPct(l.code)}%</span><button class="gbtn" id="settings" aria-label="Settings">⚙️</button></div>
    <h2 style="margin-bottom:2px">${l.code} · ${esc(ST(l.ua))}</h2><p class="sub">${esc(l.en)}</p>
    ${tabs.length > 1 ? `<div class="ltabs">${tabs.map(t => `<button data-t="${t}" class="${t === tab ? "on" : ""}">${tname[t]}${t === "ext" && nx ? ` <span class="xn">${nx}</span>` : ""}</button>`).join("")}</div>` : ""}
    ${tab === "pra" ? `<div class="gnums">${g.map((x,i) => `<button data-k="${x.k}" class="n${i % 7} ${view.game === x.k ? "on" : ""} ${gamePctFrom(rec, l, x.k) >= 80 ? "done" : ""}" aria-label="${esc(TT(x.t))}">${i+1}</button>`).join("")}</div>
      <div class="gname">${esc(TT((g.find(x => x.k === view.game) || g[0]).t))}</div>` : ""}
    <div id="game"></div>`;
  $("#settings").onclick = () => openSettings();
  $("#backL").onclick = () => { if (view.from === "lessons") { view = { tab: "lessons" }; render(); window.scrollTo(0, 0); } else goHome(); };
  document.querySelectorAll(".ltabs button").forEach(b => b.onclick = () => { setTab(l, b.dataset.t); view.xg = null; renderLesson(); });
  document.querySelectorAll(".gnums button").forEach(b => b.onclick = () => { view.game = b.dataset.k; renderLesson(); });
  const box = $("#game");
  if (tab === "teo") return tTheory(box, l);
  if (tab === "ext") return tExtra(box, l);
  if (!g.some(x => x.k === view.game)) view.game = "words";
  if (view.game === "words") gWords(box, l);
  else if (view.game === "pairs") gPairs(box, l);
  else gQuiz(box, l, +view.game.slice(1));
}
function tTheory(box, l){
  box.innerHTML = (GRAMMAR[l.code] || []).map(t => gTopic(t, l.code)).join("")
    + `<div class="row"><button class="btn blue" id="topra">${STAGE >= 1 ? "Практика" : X("Practice")} →</button></div>`;
  wireSpeak(box);
  box.querySelectorAll("[data-play]").forEach(b => b.onclick = () => { view.game = b.dataset.play.split("|")[1]; setTab(l, "pra"); renderLesson(); window.scrollTo(0, 0); });
  $("#topra").onclick = () => { setTab(l, "pra"); renderLesson(); window.scrollTo(0, 0); };
  if (view.gfocus) { const f = view.gfocus; view.gfocus = null; setTimeout(() => { const t = document.getElementById("gt-" + f); if (t) { t.scrollIntoView({ block: "start" }); t.classList.add("flash"); } }, 50); }
}
function tExtra(box, l){
  const rec = prog[l.code] || {}, items = extraItems(l);
  const open = view.xg && items.find(it => it.k === view.xg && it.kind === "game");
  if (open) {
    box.innerHTML = `<div class="row" style="margin:0 0 8px"><button class="btn ghost small" id="xback">← ${STAGE >= 1 ? "Додатково" : X("Extra")}</button></div><div id="xg"></div>`;
    $("#xback").onclick = () => { view.xg = null; renderLesson(); };
    const xb = $("#xg");
    if (open.s.type === "pairs") gPairs(xb, l, open.s, open.k);
    else gQuiz(xb, l, 0, open.s, open.k);
    return;
  }
  box.innerHTML = `<p class="note" style="margin:0 0 10px">${I("Більше ігор і матеріалів до цього уроку. Вони не входять у відсоток уроку.", "More games and resources for this lesson. They don't count towards the lesson %.")}</p>
    <div class="xlist">${items.map(it => it.kind === "game"
      ? `<button class="xcard" data-x="${it.k}"><span class="xic">🎯</span><span class="xt"><b>${esc(TT(it.s.title))}</b><small>${Math.round(xPct(rec, it))}%</small></span>${xPct(rec, it) >= 80 ? '<span class="ck">✓</span>' : !xPct(rec, it) ? `<span class="xdot"></span>` : ""}</button>`
      : `<a class="xcard" data-r="${it.k}" href="${esc(it.s.url)}" target="_blank" rel="noopener"><span class="xic">${XKIND[it.s.kind] || "🔗"}</span><span class="xt"><b>${esc(it.s.title)}</b><small>${esc(X(it.s.kind ? it.s.kind[0].toUpperCase() + it.s.kind.slice(1) : "Link"))}${it.s.src ? " · " + esc(it.s.src) : ""}${it.s.dur ? " · " + esc(it.s.dur) : ""}${it.s.lang ? " · " + it.s.lang.toUpperCase() : ""}</small></span>${rec[it.k] ? '<span class="ck">✓</span>' : `<span class="xdot"></span>`}</a>`).join("")}</div>`;
  box.querySelectorAll("[data-x]").forEach(b => b.onclick = () => { view.xg = b.dataset.x; renderLesson(); window.scrollTo(0, 0); });
  box.querySelectorAll("[data-r]").forEach(a => a.onclick = () => { markItem(l.code, a.dataset.r); setTimeout(renderLesson, 300); });
}
/* "Next" between the games of a lesson; after the last game: the next open lesson, or home */
function nextStep(l, k){
  if (/^x\d/.test(k)) {
    const xs = extraItems(l).filter(it => it.kind === "game"), at = xs.findIndex(it => it.k === k), n = xs[at + 1];
    return n ? { label: `${L("Далі", "Next")} →`, go: () => { view.xg = n.k; renderLesson(); window.scrollTo(0, 0); } }
             : { label: `← ${STAGE >= 1 ? "Додатково" : X("Extra")}`, go: () => { view.xg = null; renderLesson(); window.scrollTo(0, 0); } };
  }
  const g = games(l), at = g.findIndex(x => x.k === k), nx = g[at + 1];
  if (nx) return { label: `${L("Далі", "Next")} →`, go: () => { view.game = nx.k; renderLesson(); window.scrollTo(0, 0); } };
  const nl = LESSONS[LIDX[l.code] + 1];
  if (l.extra && extraItems(l).length && xNew(prog[l.code] || {}, l)) return { label: `${STAGE >= 1 ? "Додатково" : X("Extra")} →`, go: () => { setTab(l, "ext"); view.xg = null; renderLesson(); window.scrollTo(0, 0); } };
  if (nl && unlocked.has(nl.code)) return { label: `${L("Наступний урок", "Next lesson")} →`, go: () => { view = { tab: "lesson", code: nl.code, game: "words", from: view.from }; render(); window.scrollTo(0, 0); } };
  return { label: `✓ ${L("Урок завершено", "Lesson finished")} · ${L("На головну", "Home")}`, go: () => goHome() };
}
function nextBtn(box, l, k, strong){
  const n = nextStep(l, k), d = document.createElement("div"); d.className = "row nextrow";
  d.innerHTML = `<button class="btn ${strong ? "blue" : "ghost"}" id="gnext">${n.label}</button>`;
  box.append(d); d.querySelector("button").onclick = n.go; return d.querySelector("button");
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
  show(); nextBtn(box, l, "words", gamePctFrom(prog[l.code] || {}, l, "words") >= 80);
}
function gPairs(box, l, spec = l.pairs, key = "p"){
  const P = spec.items.map(x => [ST(X(x[0])), ST(X(x[1]))]);
  box.innerHTML = `<p class="note" style="margin:0 0 10px">${HU(spec.hint || "")}</p><div class="match"><div class="col" id="mL"></div><div class="col" id="mR"></div></div><div class="status" id="mFb"></div>`;
  let sel = null, done = 0, tries = 0;
  function tile(t, i, s){ const b = document.createElement("button"); b.className = "tile"; b.textContent = t; b.dataset.i = i; b.dataset.s = s;
    b.onclick = () => { if (b.classList.contains("done")) return;
      if (!sel || sel.dataset.s === s) { if (sel) sel.classList.remove("sel"); sel = b; b.classList.add("sel"); return; }
      tries++;
      if (sel.dataset.i === b.dataset.i) { [sel, b].forEach(x => { x.classList.remove("sel"); x.classList.add("done"); }); done++; markItem(l.code, key + "#" + b.dataset.i); sel = null;
        if (done === P.length) { $("#mFb").textContent = STAGE >= 2 ? `Чудово! Усі пари. Спроб: ${tries}.` : "Чудово! " + F("All pairs in {0} tries.", tries);
          const nb = $("#gnext"); nb.classList.replace("ghost", "blue"); nb.scrollIntoView({ behavior: "smooth", block: "center" }); }
      } else { const a = sel; [a, b].forEach(x => x.classList.add("wrong")); setTimeout(() => [a, b].forEach(x => x.classList.remove("wrong", "sel")), 350); sel = null; } };
    return b; }
  shuffle(P.map((x,i) => [x[0], i])).forEach(([t,i]) => $("#mL").append(tile(t, i, "L")));
  shuffle(P.map((x,i) => [x[1], i])).forEach(([t,i]) => $("#mR").append(tile(t, i, "R")));
  nextBtn(box, l, key === "p" ? "pairs" : key, false);
}
const CASE_PRON = new Set("мене тебе його її нас вас їх мені тобі йому їй нам вам їм чий чия чиє чиї".split(" "));
function gQuiz(box, l, qi, spec, key){
  const Q = spec || l.quizzes[qi], K = key || "q" + qi; let order, i, score;
  const gpct = () => key ? xPct(prog[l.code] || {}, { kind: "game", k: K, s: Q }) : gamePctFrom(prog[l.code] || {}, l, K);
  function start(){ order = shuffle(Q.items.map((it, idx) => [...it.slice(0, 2), it[2], idx])); i = 0; score = 0; step(); }
  function step(){
    if (i >= order.length) {
      const pct = score / order.length * 100;
      box.innerHTML = `<div class="card"><div class="big" style="font-family:'Noto Serif',serif;font-size:26px">${score} / ${order.length}</div>
        <div class="note">${pct === 100 ? "Відмінно!" : pct >= 80 ? I("Добре! Зараховано.", "Добре! Counts as done.") : I("Спробуй ще раз: потрібно 80%.", "Try again: 80% counts as done.")} · ${I(`гру пройдено на ${Math.round(gpct())}%`, F("{0}% of this game done", Math.round(gpct())))}</div></div>
        <div class="row"><button class="btn ghost" id="qa">${L("Ще раз", "Again")}</button></div>`;
      $("#qa").onclick = start; nextBtn(box, l, K, pct >= 80); return;
    }
    const [q0, ans0, own, idx] = order[i], q = X(q0);
    // Shared option lists are written for the start of a sentence; fit them to where the gap is:
    // capital letter at the start, small letter for pronouns in the middle (the polite Вас / Вам keep theirs).
    const atStart = /^(___|.*[.!?]\s+___)/.test(q.replace(/<span class=wrong>[^<]*<\/span>/g, "").replace(/<[^>]+>/g, "").trim());
    const fit = o => { o = String(o); if (atStart) return o.charAt(0).toUpperCase() + o.slice(1);
      const low = o.charAt(0).toLowerCase() + o.slice(1);
      return CASE_PRON.has(plain(low)) && !/^Ва[смш]/.test(o) ? low : o; };
    const ans = fit(X(ans0)); let opts = (own || Q.opts).map(o => ST(fit(X(o)))); if (!Q.fixed) opts = shuffle(opts);
    box.innerHTML = `<div class="progress"><div style="width:${i / order.length * 100}%"></div></div>
      <p class="note" style="margin:0 0 6px">${HU(Q.hint || "")}</p>
      <div class="q">${ST(q).replace(/<span class=wrong>([^<]*)<\/span>___/, '<span class="gap wrong"><s>$1</s></span>').replace("___", '<span class="gap">&nbsp;</span>').replace(/class=sub/g, 'class="sub2"')}</div>
      <div class="chips">${opts.map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div><div id="qfb"></div>`;
    let done = false;
    box.querySelectorAll("[data-o]").forEach(b => b.onclick = () => {
      if (done) return; done = true; const ok = plain(b.dataset.o) === plain(ans); if (ok) { score++; markItem(l.code, K + "#" + idx); }
      b.classList.add(ok ? "ok" : "bad");
      if (!ok) box.querySelectorAll("[data-o]").forEach(x => { if (plain(x.dataset.o) === plain(ans)) x.classList.add("ok"); });
      const full = ST(q).replace(/<span[^>]*>[^<]*<\/span>/g, "").replace("___", ST(ans)).trim();
      const topic = key ? null : (GRAMMAR[l.code] || []).find(t => t.game === K);
      $("#qfb").innerHTML = `<div class="fb ${ok ? "ok" : "bad"}">${ok ? "✅ Правильно!" : "❌"} ${q.includes("___") ? esc(full) : I("Відповідь: ", "Answer: ") + "<b>" + esc(ST(ans)) + "</b>"}
          ${!ok && topic ? `<br><button class="linkbtn" id="qrule">📖 ${L("Правило", "See the rule")}</button>` : ""}</div>
        <div class="row"><button class="btn" id="qn">Далі →</button></div>`;
      if ($("#qrule")) $("#qrule").onclick = () => { view.gfocus = topic.id; setTab(l, "teo"); renderLesson(); };
      $("#qn").onclick = () => { i++; step(); }; $("#qn").focus();
    });
  }
  start();
}

/* =====================================================================
   GRAMMAR PANEL (📖 in a lesson): this lesson's topics, or every topic up to the newest open lesson
   ===================================================================== */
function gTopic(t, code){
  const lg = LANG === "es" ? "es" : "en";
  const tbl = t.table ? `<table class="gt">${t.table.map((r, i) => `<tr>${r.map(c => i === 0 && t.table[0][0] === "" ? `<th>${esc(c)}</th>` : `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table>` : "";
  const ex = (t.ex || []).map(([ua, en, es]) => `<div class="gex">${ukVoice ? `<button class="gsay" data-say="${esc(ua)}" aria-label="Listen">🔊</button>` : ""}<div><b>${esc(ua)}</b><span>${esc(lg === "es" ? es : en)}</span></div></div>`).join("");
  return `<div class="gtopic" id="gt-${t.id}">
    <h3>${esc(t.ua)} <small>${esc(t[lg])}</small></h3>
    <p>${t.rule[lg]}</p>${tbl}${ex}
    ${t.cmp ? `<div class="gcmp"><b>${lg === "es" ? "🇪🇸 Si hablas español" : "🇬🇧 If you speak English"}</b><br>${t.cmp[lg]}</div>` : ""}
    ${t.game && code ? `<button class="btn ghost small" data-play="${code}|${t.game}">${L("Практикуй", "Practise this")} →</button>` : ""}</div>`;
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
  const saved = !pr.error && pr.data && pr.data.value;
  T.prices = saved && saved.v >= 4 ? { ...DEFAULT_PRICES, ...saved, packs: { ...DEFAULT_PRICES.packs, ...saved.packs }, months: { ...DEFAULT_PRICES.months, ...saved.months } } : { ...DEFAULT_PRICES };   // older saved prices were placeholders
  // package expiry (supabase/migrate_3.sql) and founding students (stored with the settings, no migration needed)
  const [ex, fd, rg] = await Promise.all([
    sb.from("ledger").select("expires_on").limit(1),
    sb.from("app_settings").select("value").eq("key", "founding").maybeSingle(),
    sb.from("app_settings").select("value").eq("key", "regions").maybeSingle(),
  ]);
  T.expiryOK = T.ledgerOK && !ex.error;
  T.founding = (!fd.error && fd.data && fd.data.value) || {};
  T.regions = (!rg.error && rg.data && rg.data.value) || {};
}
// Prices (Notion spec, 14 Nov 2026): single $25 · 4 for $92 (2 months) · 8 for $168 (3 months) · 16 for $320 (6 months) · founding −15% for 6 months.
// Pair lessons were dropped; to bring them back, add `pair` (price per person) here, the toggle in openPackage and the row in openPrices.
// The 32-class package is on hold until there's more content: add 32 back here and in DEFAULT_PRICES.
const PACKS = [1, 4, 8, 16];
const DEFAULT_PRICES = { v: 4, currency: "$", packs: { 1: 25, 4: 92, 8: 168, 16: 320 }, months: { 4: 2, 8: 3, 16: 6 }, founding: 15, foundingMonths: 6 };
const plusDays = (d, n) => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate() + n); return fmt(x); };
const plusMonths = (d, n) => { const x = new Date(d + "T12:00:00"); x.setMonth(x.getMonth() + n); return fmt(x); };
const lastPackage = id => (T.ledger[id] || []).find(r => r.kind === "package" && r.expires_on);
// founding price runs from the first payment: "pending" until the first package is added, then an end date
const foundingUntil = id => { const d = T.founding[id]; return d === "pending" ? "pending" : d && daysTo(d) >= 0 ? d : null; };
const foundingText = (id, short) => { const u = foundingUntil(id); if (!u) return "";
  return u === "pending" ? (short ? `${T.prices.foundingMonths} months from the first payment` : `starts with the first payment, then ${T.prices.foundingMonths} months`) : `until ${dmy(u)}`; };
function expiryNote(id){   // "valid until …" for the latest package, while classes are left
  const p = lastPackage(id); if (!p || balanceOf(id) <= 0) return "";
  const n = daysTo(p.expires_on);
  return n < 0 ? `<span class="exp bad">expired ${dmy(p.expires_on)}</span>`
       : n <= 7 ? `<span class="exp soon">valid until ${dmy(p.expires_on)} (${n} ${n === 1 ? "day" : "days"})</span>`
       : `<span class="exp">valid until ${dmy(p.expires_on)}</span>`;
}
// Where each student lives (for the air-raid alert rule). Oblast names as alerts.in.ua writes them, English for the teacher view.
const REGIONS = [["", "Not set"], ["abroad", "Outside Ukraine"], ["м. Київ", "Kyiv city"], ["Київська область", "Kyiv oblast"],
  ["Вінницька область", "Vinnytsia"], ["Волинська область", "Volyn"], ["Дніпропетровська область", "Dnipropetrovsk"], ["Донецька область", "Donetsk"],
  ["Житомирська область", "Zhytomyr"], ["Закарпатська область", "Zakarpattia"], ["Запорізька область", "Zaporizhzhia"], ["Івано-Франківська область", "Ivano-Frankivsk"],
  ["Кіровоградська область", "Kirovohrad"], ["Луганська область", "Luhansk"], ["Львівська область", "Lviv"], ["Миколаївська область", "Mykolaiv"],
  ["Одеська область", "Odesa"], ["Полтавська область", "Poltava"], ["Рівненська область", "Rivne"], ["Сумська область", "Sumy"],
  ["Тернопільська область", "Ternopil"], ["Харківська область", "Kharkiv"], ["Херсонська область", "Kherson"], ["Хмельницька область", "Khmelnytskyi"],
  ["Черкаська область", "Cherkasy"], ["Чернівецька область", "Chernivtsi"], ["Чернігівська область", "Chernihiv"]];
const regionText = id => { const r = T.regions[id]; if (!r || (!r.oblast && !r.city)) return ""; if (!r.oblast) return r.city;
  const name = (REGIONS.find(x => x[0] === r.oblast) || [, r.oblast])[1];
  return r.oblast === "abroad" ? (r.city ? `${r.city} (outside Ukraine)` : "Outside Ukraine") : (r.city ? `${r.city}, ${name}` : name); };
async function saveSetting(key, value){
  const { error } = await sb.from("app_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) toast("Couldn't save: " + error.message);
  return !error;
}
// "Moved" records: kind 'fix', delta 0 (or a class, −1, for a late cancel), note starting "moved:<reason>"
const MOVE = {
  alert:   { label: "Air-raid alert", sub: "Alert in their region at the start or during the class, and they had to stop. No class taken off." },
  teacher: { label: "I moved or cancelled it", sub: "No class taken off. The package end date moves 1 week later." },
  ontime:  { label: "Student moved it in time", sub: "24 hours or more before. No class taken off." },
  late:    { label: "Late cancel or no-show", sub: "Less than 24 hours before, or didn't come. Counts as held: −1 class." },
};
const moveOf = r => { const m = /^moved:(\w+)/.exec(r.note || ""); return m && MOVE[m[1]] ? m[1] : null; };
const moveNote = r => (r.note || "").replace(/^moved:\w+\s*·?\s*/, "");
// Access after a package ends (supabase/migrate_4.sql does the blocking and deleting every night)
const BLOCK_AFTER_DAYS = 14, DELETE_AFTER_MONTHS = 12;
const lastEnd = id => (T.ledger[id] || []).filter(r => r.kind === "package" && r.expires_on).map(r => r.expires_on).sort().pop() || null;
function accessState(id){
  if (isTest(id)) return null;
  const e = lastEnd(id); if (!e) return null;
  const blockOn = plusDays(e, BLOCK_AFTER_DAYS + 1), deleteOn = plusMonths(e, DELETE_AFTER_MONTHS);
  return { end: e, blockOn, deleteOn, blocked: daysTo(blockOn) <= 0, ending: daysTo(e) < 0 && daysTo(blockOn) > 0 };
}
function accessNote(id){
  const a = accessState(id); if (!a) return "";
  if (a.blocked) return `<span class="exp bad">🔒 blocked since ${dmy(a.blockOn)} · deletes on ${dmy(a.deleteOn)}</span>`;
  if (a.ending) return `<span class="exp soon">package ended · login blocks on ${dmy(a.blockOn)}</span>`;
  return "";
}
// Refund for unused classes: classes left × what one class cost in their latest package (founding discount included)
function refundOf(id){
  const left = balanceOf(id); if (left <= 0) return null;
  const p = (T.ledger[id] || []).find(r => r.kind === "package" && r.delta > 0);
  let per = null;
  if (p && p.amount) per = Number(p.amount) / p.delta;
  else { const P = T.prices.packs || {}, n = p ? p.delta : 1, base = P[n] != null ? P[n] / n : P[1];
    if (base != null) per = foundingUntil(id) ? base * (100 - T.prices.founding) / 100 : base; }
  return per == null ? null : { left, per: Math.round(per * 100) / 100, sum: Math.round(per * left * 100) / 100 };
}
async function saveFounding(){
  const { error } = await sb.from("app_settings").upsert({ key: "founding", value: T.founding, updated_at: new Date().toISOString() });
  if (error) toast("Couldn't save: " + error.message);
  return !error;
}
const balanceOf = id => (T.ledger[id] || []).reduce((s, r) => s + r.delta, 0);
const money = v => v === null || v === undefined || v === "" ? "" : `${T.prices.currency || ""}${Number(v).toLocaleString()}`;
const isTest = id => !!(T.students.find(x => x.id === id) || {}).is_test;   // 🧪 test students: left out of money and access rules
function monthSummary(){
  const m = new Date().toISOString().slice(0, 7); let held = 0, paid = 0;
  for (const [id, rows] of Object.entries(T.ledger)) if (!isTest(id)) for (const r of rows) if (String(r.created_at).slice(0, 7) === m) {
    if (r.kind === "class") held -= r.delta; if ((r.kind === "package" || /^refund/.test(r.note || "")) && r.amount) paid += Number(r.amount); }
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
  EN = true;
  $("#app").innerHTML = `<div class="head"><div><h1>Students</h1><p class="sub" style="margin:0">Hi ${esc(me.nickname)} · teacher</p></div>
    <div class="who"><button class="chip" id="prices">💶 Prices</button><button class="chip" id="toP">📚 Practice</button><button class="chip" id="settings">⚙️</button></div></div><div id="tmain"><p class="status">Завантаження…</p></div>`;
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
  $("#tmain").innerHTML = `<div class="row" style="margin:16px 0"><button class="btn blue" id="add">＋ New student</button></div>
    ${ms ? `<p class="note" style="margin:-4px 0 12px">This month: <b>${ms.held}</b> ${ms.held === 1 ? "class" : "classes"} held · <b>${money(ms.paid) || 0}</b> received${T.students.some(x => x.is_test) ? " · 🧪 test students not counted" : ""}</p>`
         : `<p class="note" style="margin:-4px 0 12px">Class balances are off until you run <b>supabase/migrate_2.sql</b> in Supabase.</p>`}
    <div class="tlist">${T.students.length ? [...T.students].sort((a, b) => !!a.is_test - !!b.is_test).map(s => { const st = studentStats(s);
      return `<button class="trow ${s.is_test ? "test" : ""}" data-s="${s.id}"><div><b>${s.is_test ? "🧪 " : ""}${esc(s.nickname)}</b> <span class="note">@${esc(s.username)}${s.is_test ? " · test" : ""}</span>
        <div class="m2">Last active: ${ago(s.last_seen)} · ${st.un.size} lessons open${foundingUntil(s.id) ? " · ⭐ founding" : ""}${T.ledgerOK && accessNote(s.id) ? " · " + accessNote(s.id) : T.ledgerOK && expiryNote(s.id).includes("exp ") ? " · " + expiryNote(s.id) : ""}</div></div>
        <div class="nums">${T.ledgerOK ? `<div class="${balanceOf(s.id) <= 3 ? "lowbal" : ""}"><b>${balanceOf(s.id)}</b>classes</div>` : ""}<div><b>${st.level.toFixed(1)}%</b>to ${st.goal}</div><div><b>${st.due}</b>today</div><div><b>${st.learned}</b>learned</div></div></button>`; }).join("")
      : `<div class="empty"><div class="big">No students yet</div>Create your first student above.</div>`}</div>`;
  $("#add").onclick = openAddStudent;
  document.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { view = { tab: "student", id: b.dataset.s }; renderStudent(); });
}
function genPassword(){
  const latin = ["kalyna","kit","sontse","more","dim","lito","zyma","sad","myr","kava","chai","dub","les","vovk"];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  return `${pick(latin)}-${pick(latin)}-${Math.floor(1000 + Math.random() * 9000)}`;
}
async function callAdmin(body){
  const { data, error } = await sb.functions.invoke("admin", { body });
  if (error) { let msg = error.message; try { const j = await error.context.json(); msg = j.error || msg; } catch(e){} throw new Error(msg); }
  return data;
}
// Login details for the student, in their explanation language (profiles.lang)
function credText(username, password, lang){
  const url = location.origin + location.pathname;
  return lang === "es"
    ? `Ucranización · Práctica\n${url}\n\nUsuario: ${username}\nContraseña: ${password}\n\nDespués de entrar, puedes cambiar tu apodo y tu contraseña en ⚙️.`
    : `Ucranización · Practice\n${url}\n\nLogin: ${username}\nPassword: ${password}\n\nYou can change your nickname and password in ⚙️ after logging in.`;
}
function showCredentials(username, password, title, lang){
  const txt = credText(username, password, lang);
  openModal(`<h2>${title}</h2><p class="sub">Send this to your student. You won't see the password again.</p>
    <div class="cred" id="credt">${esc(txt)}</div>
    <div class="row two"><button class="btn ghost" id="cp">Copy</button><button class="btn" id="cd">Done</button></div>`);
  $("#cp").onclick = async () => { try { await navigator.clipboard.writeText(txt); toast("Copied"); } catch(e) { toast("Select the text and copy it"); } };
  $("#cd").onclick = () => { closeModal(); renderTeacher(); };
}
function openAddStudent(){
  openModal(`<h2>New student</h2>
    <label class="f" for="an">Name or nickname (shown in the app)</label><input class="field" id="an" placeholder="Maria">
    <label class="f" for="au">Login name (for logging in, can't be changed)</label><input class="field" id="au" placeholder="maria" autocapitalize="off" spellcheck="false">
    <div class="hint2">Small letters a–z, numbers, dot, dash or underscore.</div>
    <label class="f" for="ap">Starting password</label>
    <div style="display:flex;gap:8px"><input class="field" id="ap" value="${genPassword()}"><button class="btn ghost small" id="regen">↻</button></div>
    <div class="hint2">They can change it in the app.</div>
    <label class="f" for="alang">Explanations in</label>
    <select class="field" id="alang"><option value="es">Español</option><option value="en">English</option></select>
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
      await sb.from("profiles").update({ lang: $("#alang").value }).eq("id", r.id);   // needs supabase/migrate_5.sql
      showCredentials(username, password, "Student created ✓", $("#alang").value);
    } catch (e) { $("#aerr").textContent = e.message; $("#acreate").disabled = false; }
  };
}
function stageOf(s, st){
  const full = ls => ls.length && ls.every(l => lessonPctFrom(st.pr, l.code) >= 100);
  const a1 = LESSONS.filter(l => unitOf(l.code) <= 6);
  if (a1.length === A1_MARK && full(a1)) return 2;
  return full(LESSONS.filter(l => unitOf(l.code) === 0)) ? 1 : 0;
}
const stamp = t => new Date(t).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
function ledgerRows(rows){
  return rows.map(r => `<div class="lrow"><span class="ld">${stamp(r.created_at)}</span>
      <span class="lt">${moveOf(r) ? `↻ Moved: ${MOVE[moveOf(r)].label}${moveNote(r) ? ` · <span class="note">${esc(moveNote(r))}</span>` : ""}` : r.kind === "class" ? "Class held" : r.kind === "package" ? `Package +${r.delta}${r.expires_on ? ` · valid until ${dmy(r.expires_on)}` : ""}` : /^refund/.test(r.note || "") ? `↩ Refund ${r.delta}` : `Correction ${r.delta > 0 ? "+" : ""}${r.delta}`}${moveOf(r) ? "" : `${r.amount ? " · " + money(r.amount) : ""}${r.note && !/^refund$/.test(r.note) ? ` · <span class="note">${esc(r.note)}</span>` : ""}`}</span>
      <span class="lv ${r.delta < 0 ? "neg" : r.delta === 0 ? "" : "pos"}">${r.delta === 0 ? "0" : (r.delta > 0 ? "+" : "") + r.delta}</span><button class="lx" data-del="${r.id}" title="Delete">✕</button></div>`).join("");
}
function wireLedgerDelete(s, root, redraw){
  root.querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
    if (!b.classList.contains("sure")) { b.classList.add("sure"); b.textContent = "Delete?"; return; }
    const { error } = await sb.from("ledger").delete().eq("id", b.dataset.del);
    if (error) { toast("Couldn't delete: " + error.message); return; }
    const gone = (T.ledger[s.id] || []).find(r => String(r.id) === b.dataset.del), p = lastPackage(s.id);
    if (gone && moveOf(gone) === "teacher" && p && T.expiryOK) {   // undo the +1 week
      const nd = plusDays(p.expires_on, -7);
      if (!(await sb.from("ledger").update({ expires_on: nd }).eq("id", p.id)).error) p.expires_on = nd;
    }
    T.ledger[s.id] = (T.ledger[s.id] || []).filter(r => String(r.id) !== b.dataset.del); toast("Deleted"); redraw();
  });
}
function drawClasses(s){
  const box = $("#classes"); if (!box) return;
  if (!T.ledgerOK) { box.innerHTML = `<h3>Classes</h3><p class="note">Run <b>supabase/migrate_2.sql</b> in Supabase to turn on class balances.</p>`; return; }
  const bal = balanceOf(s.id), all = T.ledger[s.id] || [];
  box.innerHTML = `<h3>Classes</h3>
    <div class="balbig ${bal <= 3 ? "low" : ""}"><b>${bal}</b><span>${bal < 0 ? "classes owed" : bal === 1 ? "class left" : "classes left"}</span></div>
    ${accessNote(s.id) ? `<p class="note" style="margin:-6px 0 10px">${accessNote(s.id)}</p>` : expiryNote(s.id) ? `<p class="note" style="margin:-6px 0 10px">${expiryNote(s.id)}</p>` : ""}
    <div class="founding">${foundingUntil(s.id)
      ? `<span class="fchip">⭐ Founding price −${T.prices.founding}% · ${foundingText(s.id)}</span><button class="linkbtn" id="funset">Remove</button>`
      : `<button class="linkbtn" id="fset">⭐ Mark as founding student (−${T.prices.founding}% for ${T.prices.foundingMonths} months)</button>`}</div>
    <div class="row two"><button class="btn blue" id="held">✓ Class held<br><small>−1 class</small></button><button class="btn ghost" id="pack">＋ Package<br><small>add classes</small></button></div>
    <div class="row"><button class="btn ghost small" id="moved">↻ Class moved or cancelled</button></div>
    ${refundOf(s.id) ? `<p class="note region">↩ Refund if they stop: ${refundOf(s.id).left} × ${money(refundOf(s.id).per)} = <b>${money(refundOf(s.id).sum)}</b> · <button class="linkbtn inline" id="refund">record refund</button></p>` : ""}
    <p class="note region">📍 ${regionText(s.id) ? esc(regionText(s.id)) : "Region not set"} · <button class="linkbtn inline" id="regset">${regionText(s.id) ? "change" : "set"}</button></p>
    ${bal <= 3 ? `<div class="row"><button class="btn ghost small" id="remind">✉️ Send a reminder</button></div>` : ""}
    ${all.length ? `<div class="ledger">${ledgerRows(all.slice(0, 3))}</div>
      <button class="linkbtn" id="hist">Full history (${all.length}) →</button>` : `<p class="note">No packages or classes yet.</p>`}`;
  $("#held").onclick = () => classHeld(s);
  $("#pack").onclick = () => openPackage(s);
  $("#moved").onclick = () => openMoved(s);
  $("#regset").onclick = () => openRegion(s);
  if ($("#refund")) $("#refund").onclick = () => openRefund(s);
  if ($("#fset")) $("#fset").onclick = async () => {
    const first = [...(T.ledger[s.id] || [])].reverse().find(r => r.kind === "package");   // ledger is newest first
    T.founding[s.id] = first ? plusMonths(fmt(new Date(first.created_at)), T.prices.foundingMonths) : "pending";
    if (first && daysTo(T.founding[s.id]) < 0) { delete T.founding[s.id]; toast("Their first payment was more than " + T.prices.foundingMonths + " months ago"); return; }
    if (await saveFounding()) { toast(`Founding price ${foundingText(s.id, true)}`); drawClasses(s); } else delete T.founding[s.id];
  };
  if ($("#funset")) $("#funset").onclick = async () => {
    const was = T.founding[s.id]; delete T.founding[s.id];
    if (await saveFounding()) { toast("Founding price removed"); drawClasses(s); } else T.founding[s.id] = was;
  };
  if ($("#remind")) $("#remind").onclick = () => openReminder(s);
  if ($("#hist")) $("#hist").onclick = () => { view = { tab: "student", id: s.id, sub: "history" }; renderStudent(); window.scrollTo(0, 0); };
  wireLedgerDelete(s, box, () => drawClasses(s));
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
  openModal(`<h2>Class recorded ✓</h2><p class="sub">Class recorded for ${esc(s.nickname)} · <b>${bal}</b> ${bal === 1 ? "class" : "classes"} left.</p>
    <label class="f">Open the lessons you did today:</label>
    ${next.map((l, i) => `<label class="toggle"><input type="checkbox" data-nl="${l.code}" ${i === 0 ? "checked" : ""}><span class="tt">${l.code} · ${esc(l.en)}<span>${esc(ST(l.ua))}</span></span></label>`).join("")}
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
function openMoved(s){
  openModal(`<h2>Class moved or cancelled</h2><p class="sub">${esc(s.nickname)}${regionText(s.id) ? " · 📍 " + esc(regionText(s.id)) : ""}</p>
    ${Object.entries(MOVE).map(([k, m], i) => `<label class="toggle"><input type="radio" name="mv" value="${k}" ${i === 0 ? "checked" : ""}><span class="tt">${m.label}<span>${m.sub}</span></span></label>`).join("")}
    <label class="f" for="mvd">Date of the class</label><input class="field" id="mvd" type="date" value="${today()}">
    <label class="f" for="mvn">Note</label><input class="field" id="mvn" placeholder="optional, e.g. new time Thu 18:00">
    <div class="err" id="mverr"></div>
    <div class="row two"><button class="btn ghost" id="mvc">Cancel</button><button class="btn blue" id="mvok">Save</button></div>`);
  $("#mvc").onclick = closeModal;
  $("#mvok").onclick = async () => {
    const k = document.querySelector('[name="mv"]:checked').value, d = $("#mvd").value || today();
    const extra = [d !== today() ? "class on " + dmy(d) : "", $("#mvn").value.trim()].filter(Boolean).join(" · ");
    $("#mvok").disabled = true;
    const ok = await addLedger(s, { delta: k === "late" ? -1 : 0, kind: k === "late" ? "class" : "fix", amount: null, note: `moved:${k}` + (extra ? " · " + extra : "") });
    if (!ok) { $("#mvok").disabled = false; return; }
    let msg = "Saved";
    if (k === "teacher") {   // +1 week on the latest package's end date
      const p = lastPackage(s.id);
      if (p && T.expiryOK) {
        const nd = plusDays(p.expires_on, 7);
        const { error } = await sb.from("ledger").update({ expires_on: nd }).eq("id", p.id);
        if (error) msg = "Saved, but couldn't move the end date: " + error.message; else { p.expires_on = nd; msg = `Saved · package now valid until ${dmy(nd)}`; }
      }
    }
    if (k === "late") msg = `Counted as held · ${balanceOf(s.id)} left`;
    closeModal(); toast(msg); renderStudent();
  };
}
function openRefund(s){
  const r = refundOf(s.id); if (!r) return;
  openModal(`<h2>Refund</h2><p class="sub">${esc(s.nickname)} stops: ${r.left} unused ${r.left === 1 ? "class" : "classes"} × ${money(r.per)}.</p>
    <label class="f" for="rfa">Amount refunded</label><input class="field" id="rfa" type="number" inputmode="decimal" value="${r.sum}">
    <p class="note">Records the refund and sets their classes to 0. Send the money yourself from the ФОП account.</p>
    <div class="row two"><button class="btn ghost" id="rfx">Cancel</button><button class="btn blue" id="rfok">Record refund</button></div>`);
  $("#rfx").onclick = closeModal;
  $("#rfok").onclick = async () => {
    $("#rfok").disabled = true;
    const ok = await addLedger(s, { delta: -r.left, kind: "fix", amount: -Math.abs(Number($("#rfa").value) || 0), note: "refund" });
    if (ok) { closeModal(); toast("Refund recorded"); renderStudent(); } else $("#rfok").disabled = false;
  };
}
function openRegion(s){
  const r = T.regions[s.id] || {};
  openModal(`<h2>Where ${esc(s.nickname)} lives</h2><p class="sub">Used for the air-raid alert rule. Ask on the intro call; the student tells you when it changes.</p>
    <label class="f" for="rgo">Region</label><select class="field" id="rgo">${REGIONS.map(([v, n]) => `<option value="${esc(v)}" ${v === (r.oblast || "") ? "selected" : ""}>${n}</option>`).join("")}</select>
    <label class="f" for="rgc">City</label><input class="field" id="rgc" value="${esc(r.city || "")}" placeholder="optional, e.g. Kyiv, Lviv, Bogotá">
    <div class="row two"><button class="btn ghost" id="rgx">Cancel</button><button class="btn blue" id="rgok">Save</button></div>`);
  $("#rgx").onclick = closeModal;
  $("#rgok").onclick = async () => {
    const oblast = $("#rgo").value, city = $("#rgc").value.trim(), was = T.regions[s.id];
    if (oblast || city) T.regions[s.id] = { oblast, city, since: today() }; else delete T.regions[s.id];
    if (await saveSetting("regions", T.regions)) { closeModal(); toast("Region saved"); drawClasses(s); }
    else { if (was) T.regions[s.id] = was; else delete T.regions[s.id]; }
  };
}
function openPackage(s){
  const P = T.prices.packs || {}, M = T.prices.months || {}, fu = foundingUntil(s.id), cur = T.prices.currency || "";
  openModal(`<h2>New package</h2><p class="sub">for ${esc(s.nickname)}</p>
    <div class="seg">${PACKS.map(n => `<button data-n="${n}">${n === 1 ? "1 · single" : n}</button>`).join("")}</div>
    ${fu ? `<label class="toggle"><input type="checkbox" id="pfound" checked><span class="tt">⭐ Founding price −${T.prices.founding}%<span>${foundingText(s.id)}</span></span></label>` : ""}
    <label class="f" for="pn">Classes (a negative number corrects the balance)</label><input class="field" id="pn" type="number" inputmode="numeric" value="8">
    <label class="f" for="pa">Paid ${esc(cur)}</label><input class="field" id="pa" type="number" inputmode="decimal" placeholder="optional">
    ${T.expiryOK ? `<label class="f" for="pe">Valid until</label><input class="field" id="pe" type="date"><div class="hint2">Empty = no end date.</div>`
                 : `<p class="note">Run <b>supabase/migrate_3.sql</b> in Supabase to save package end dates.</p>`}
    <label class="f" for="pnote">Note</label><input class="field" id="pnote" placeholder="optional, e.g. bank transfer">
    <div class="err" id="perr"></div>
    <div class="row two"><button class="btn ghost" id="pc">Cancel</button><button class="btn blue" id="pok">Add</button></div>`);
  let n = 8;
  const price = () => {
    const found = $("#pfound") && $("#pfound").checked;
    let v = P[n] ?? (P[1] ? P[1] * n : null);
    if (v !== null && found) v = Math.round(v * (100 - T.prices.founding)) / 100;
    $("#pa").value = v ?? "";
  };
  const pick = k => { n = k; $("#pn").value = k; price();
    if ($("#pe")) $("#pe").value = M[k] ? plusMonths(today(), M[k]) : "";
    document.querySelectorAll("[data-n]").forEach(b => b.classList.toggle("on", +b.dataset.n === k)); };
  document.querySelectorAll("[data-n]").forEach(b => b.onclick = () => pick(+b.dataset.n)); pick(8);
  $("#pn").oninput = () => { n = parseInt($("#pn").value, 10) || 0; price();
    document.querySelectorAll("[data-n]").forEach(b => b.classList.toggle("on", +b.dataset.n === n)); };
  if ($("#pfound")) $("#pfound").onchange = price;
  $("#pc").onclick = closeModal;
  $("#pok").onclick = async () => {
    const k = parseInt($("#pn").value, 10), a = $("#pa").value === "" ? null : Number($("#pa").value);
    if (!k) { $("#perr").textContent = "Enter the number of classes."; return; }
    const tags = [$("#pfound") && $("#pfound").checked ? `founding −${T.prices.founding}%` : ""].filter(Boolean);
    const note = [...tags, $("#pnote").value.trim()].filter(Boolean).join(" · ") || null;
    const row = { delta: k, kind: k > 0 ? "package" : "fix", amount: a, note };
    if (T.expiryOK && k > 0 && $("#pe").value) row.expires_on = $("#pe").value;
    $("#pok").disabled = true;
    const ok = await addLedger(s, row);
    if (ok && k > 0 && T.founding[s.id] === "pending") { T.founding[s.id] = plusMonths(today(), T.prices.foundingMonths); await saveFounding(); }
    if (ok) { closeModal(); toast(`Balance: ${balanceOf(s.id)} classes`); renderStudent(); } else $("#pok").disabled = false;
  };
}
function openReminder(s){
  const n = Math.max(0, balanceOf(s.id));
  const msg = n === 0
    ? `Привіт, ${s.nickname}! 🙂 Оплачені заняття в пакеті закінчилися. Щоб продовжити, можна поновити пакет.\nHi ${s.nickname}! Your package has no classes left. Let me know when you'd like to renew.`
    : `Привіт, ${s.nickname}! 🙂 У твоєму пакеті залишилось ${n} ${pl(n, "заняття", "заняття", "занять")}. Щоб продовжити без перерви, можна поновити пакет.\nHi ${s.nickname}! You have ${n} ${n === 1 ? "class" : "classes"} left in your package. Let me know when you'd like to renew.`;
  openModal(`<h2>Reminder</h2><p class="sub">${esc(s.nickname)} has <b>${n}</b> ${n === 1 ? "class" : "classes"} left. Edit the message if you like, then send it in your messenger.</p>
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
  const P = T.prices.packs || {}, M = T.prices.months || {}, cur = T.prices.currency || "$";
  openModal(`<h2>Prices</h2><p class="sub">Used to fill in the amount and end date when you add a package. You can still change them for each student.</p>
    <label class="f" for="pcur">Currency</label><input class="field" id="pcur" value="${esc(cur)}" maxlength="4" style="max-width:120px">
    <div class="ptable">${PACKS.map(n => `<div class="prow"><span class="pn">${n === 1 ? "Single class" : n + " classes"}</span>
      <input class="field" data-p="${n}" type="number" inputmode="decimal" value="${P[n] ?? ""}" placeholder="—"><span class="pper" id="pp${n}"></span></div>
      ${n > 1 ? `<div class="prow sub2"><span class="pn">valid for</span><input class="field" data-w="${n}" type="number" inputmode="numeric" value="${M[n] ?? ""}" placeholder="—"><span class="pper">months</span></div>` : ""}`).join("")}
      <div class="prow"><span class="pn">Founding discount</span><input class="field" id="pfd" type="number" inputmode="numeric" value="${T.prices.founding ?? 15}"><span class="pper">% for</span></div>
      <div class="prow sub2"><span class="pn"></span><input class="field" id="pfm" type="number" inputmode="numeric" value="${T.prices.foundingMonths ?? 6}"><span class="pper">months</span></div></div>
    ${T.ledgerOK ? "" : `<p class="note">Run <b>supabase/migrate_2.sql</b> first, then prices can be saved.</p>`}
    <div class="err" id="prerr"></div>
    <div class="row two"><button class="btn ghost" id="prc">Cancel</button><button class="btn blue" id="prs">Save</button></div>`);
  const upd = () => { const single = Number(document.querySelector('[data-p="1"]').value) || 0;
    PACKS.forEach(n => { const v = Number(document.querySelector(`[data-p="${n}"]`).value);
      $("#pp" + n).textContent = v ? `${$("#pcur").value}${(v / n).toFixed(2)} / class${single && n > 1 ? ` · ${Math.round((1 - v / n / single) * 100)}% off` : ""}` : ""; }); };
  document.querySelectorAll("[data-p], #pcur").forEach(i => i.oninput = upd); upd();
  $("#prc").onclick = closeModal;
  $("#prs").onclick = async () => {
    const num = v => v === "" ? undefined : Number(v);
    const packs = {}, months = {};
    PACKS.forEach(n => { const v = num(document.querySelector(`[data-p="${n}"]`).value); if (v !== undefined) packs[n] = v;
      const w = document.querySelector(`[data-w="${n}"]`); if (w && num(w.value)) months[n] = num(w.value); });
    const value = { v: 4, currency: $("#pcur").value.trim() || "$", packs, months,
      founding: num($("#pfd").value) ?? 15, foundingMonths: num($("#pfm").value) ?? 6 };
    const { error } = await sb.from("app_settings").upsert({ key: "prices", value, updated_at: new Date().toISOString() });
    if (error) { $("#prerr").textContent = error.message; return; }
    T.prices = value; closeModal(); toast("Prices saved");
  };
}
function renderStudent(){
  const s = T.students.find(x => x.id === view.id), st = studentStats(s);
  const back = () => { view = { tab: "student", id: s.id }; renderStudent(); window.scrollTo(0, 0); };
  const head = `<h2 style="margin-bottom:2px">${esc(s.nickname)} <span class="note">@${esc(s.username)}</span></h2>`;

  if (view.sub === "history") {
    const all = T.ledger[s.id] || [];
    $("#tmain").innerHTML = `<div class="top" style="margin-top:14px"><button id="tb">← ${esc(s.nickname)}</button><span></span><span></span></div>${head}
      <p class="sub">${(n => `${n} ${n === 1 ? "class" : "classes"} left`)(balanceOf(s.id))} · ${all.filter(r => r.kind === "class").length} held · ${(n => `${n} ${n === 1 ? "package" : "packages"}`)(all.filter(r => r.kind === "package").length)}</p>
      <div class="panel"><h3>Class history</h3>${all.length ? `<div class="ledger">${ledgerRows(all)}</div>` : `<p class="note">Nothing yet.</p>`}</div>`;
    $("#tb").onclick = back;
    wireLedgerDelete(s, $("#tmain"), () => renderStudent());
    return;
  }

  if (view.sub === "lessons") {
    $("#tmain").innerHTML = `<div class="top" style="margin-top:14px"><button id="tb">← ${esc(s.nickname)}</button><span></span><span></span></div>${head}
      <div class="panel"><h3>Lessons</h3><p class="note" style="margin-top:0">Tick a lesson after you've done it in class. Its games and words open in the student's app.</p>
        ${UNITS.filter(u => LESSONS.some(l => unitOf(l.code) === u.n)).map(u => { const ls = LESSONS.filter(l => unitOf(l.code) === u.n); const allOn = ls.every(l => st.un.has(l.code));
          return `<div style="margin-top:12px"><div style="display:flex;justify-content:space-between;align-items:center"><b>${u.n === 0 ? "Introduction" : "Unit " + u.n}</b>
            <button class="btn ghost small" data-unit="${u.n}" data-on="${allOn ? 0 : 1}">${allOn ? "Close all" : "Open all"}</button></div>
            ${ls.map(l => { const p = lessonPctFrom(st.pr, l.code); return `<label class="toggle"><input type="checkbox" data-l="${l.code}" ${st.un.has(l.code) ? "checked" : ""}>
              <span class="tt">${l.code} · ${esc(l.en)}<span>${esc(ST(l.ua))}</span></span><span class="pc" style="color:${p >= 80 ? "var(--green)" : ""}">${p ? p + "%" : ""}</span></label>`; }).join("")}</div>`; }).join("")}
        <p class="note">Units 3–12 appear here as their games are built.</p></div>`;
    $("#tb").onclick = back;
  } else {
    // overview: the things used every class come first
    const weak = st.words.map(w => ({ w, c: st.cs.get(w.id) })).filter(x => x.c && x.c.lapses > 0).sort((a,b) => b.c.lapses - a.c.lapses).slice(0, 5);
    const boxes = Array.from({ length: MAXBOX + 1 }, (_, b) => st.words.filter(w => (st.cs.get(w.id)?.box || 0) === b).length);
    const maxB = Math.max(1, ...boxes);
    const openL = LESSONS.filter(l => st.un.has(l.code)), nextL = LESSONS.find(l => !st.un.has(l.code));
    const recent = [...openL].reverse().slice(0, 3);
    $("#tmain").innerHTML = `<div class="top" style="margin-top:14px"><button id="tb">← All students</button><span></span><span></span></div>${head}
      <p class="sub">Last active ${ago(s.last_seen)} · ${st.level.toFixed(1)}% to ${st.goal} · ${st.due} words for today · ${st.learned} learned</p>
      <div class="tgrid">
        <div class="panel" id="classes"></div>
        <div class="panel"><h3>Lessons</h3>
          <p class="note" style="margin-top:0"><b>${openL.length}</b> of ${LESSONS.length} open · <b>${openL.filter(l => lessonPctFrom(st.pr, l.code) >= 80).length}</b> done</p>
          ${nextL ? `<div class="nextl"><span class="tt">Next: ${nextL.code} · ${esc(nextL.en)}<span>${esc(ST(nextL.ua))}</span></span><button class="btn blue small" id="opennext">Open</button></div>` : `<p class="note">All built lessons are open.</p>`}
          ${recent.map(l => { const p = lessonPctFrom(st.pr, l.code), xi = extraItems(l, s.lang || "en"), xd = xi.filter(it => xPct(st.pr[l.code] || {}, it) >= 80).length;
            return `<div class="toggle"><span class="tt">${l.code} · ${esc(l.en)}${xi.length ? `<span>Extra: ${xd} of ${xi.length} done</span>` : ""}</span><span class="pc" style="color:${p >= 80 ? "var(--green)" : ""}">${p}%</span></div>`; }).join("")}
          <button class="linkbtn" id="alll">Manage all lessons →</button></div>
        <div class="panel"><h3>Word memory</h3><p class="note" style="margin-top:0">Words in each review box (0 = new, 6 = long-term).</p>
          <div class="bars">${boxes.map((n,b) => `<div style="height:${n / maxB * 100}%" title="${n} words"><span>${b}</span></div>`).join("")}</div><div style="height:18px"></div></div>
        <div class="panel"><h3>Hardest words</h3>${weak.length ? weak.map(x => `<div class="toggle"><span class="tt">${esc(ST(x.w.ua))}<span>${esc(x.w.en)} · lesson ${x.w.lesson}</span></span><span class="pc">${x.c.lapses}× wrong</span></div>`).join("") : `<p class="note">No mistakes yet.</p>`}</div>
        <div class="panel"><h3>App language</h3>
          <p class="note" style="margin-top:0">Now: <b>${["bilingual", "labels in Ukrainian", "all Ukrainian"][stageOf(s, st)]}</b>. It switches by itself: labels turn Ukrainian when the Intro is at 100%, everything at A1 at 100%.</p>
          <label class="f" for="slang">Explanations in</label>
          <select class="field" id="slang">${[["en", "English"], ["es", "Español"]].map(([v, t]) => `<option value="${v}" ${(s.lang || "en") === v ? "selected" : ""}>${t}</option>`).join("")}</select>
          ${s.lang === undefined ? `<p class="note">Run supabase/migrate_5.sql once to save this.</p>` : ""}</div>
        <div class="panel"><h3>Account</h3>
          <label class="toggle"><input type="checkbox" id="istest" ${s.is_test ? "checked" : ""}><span class="tt">🧪 Test student<span>Works like a real student, but classes and payments don't count in your totals, and the login is never blocked or deleted when a package ends.</span></span></label>
          ${s.is_test === undefined ? `<p class="note">Run supabase/migrate_4.sql and migrate_5.sql once to save this.</p>` : ""}
          <div class="row two"><button class="btn ghost" id="rp">Reset password</button><button class="btn ghost" id="rprog">Reset progress</button></div>
          <div class="row"><button class="btn danger" id="del">Delete student</button></div></div>
      </div>`;
    $("#tb").onclick = () => renderStudentList();
    drawClasses(s);
    $("#alll").onclick = () => { view = { tab: "student", id: s.id, sub: "lessons" }; renderStudent(); window.scrollTo(0, 0); };
    if ($("#opennext")) $("#opennext").onclick = async () => { if (await setLessons([nextL.code], true)) { toast(`${nextL.code} opened for ${s.nickname}`); renderStudent(); } };
    $("#istest").onchange = async e => {
      const v = e.target.checked, { error } = await sb.from("profiles").update({ is_test: v }).eq("id", s.id);
      if (error) { e.target.checked = !v; toast("Couldn't save: " + error.message); return; }
      s.is_test = v; toast(v ? "Marked as a test student" : "Now a real student"); renderStudent();
    };
    $("#rprog").onclick = () => {
      openModal(`<h2>Reset ${esc(s.nickname)}'s progress?</h2>
        <p class="sub">This deletes their game scores and word memory (review boxes, hardest words), as if they had never practised.
        Open lessons, class balance and history stay. It can't be undone.</p><div class="err" id="rperr"></div>
        <div class="row two"><button class="btn ghost" id="rpc">Cancel</button><button class="btn danger" id="rpok">Reset progress</button></div>`);
      $("#rpc").onclick = closeModal;
      $("#rpok").onclick = async () => {
        $("#rpok").disabled = true;
        const [a, b] = await Promise.all([sb.from("progress").delete().eq("student_id", s.id), sb.from("cards").delete().eq("student_id", s.id)]);
        if (a.error || b.error) { $("#rperr").textContent = (a.error || b.error).message; $("#rpok").disabled = false; return; }
        delete T.progress[s.id]; delete T.cards[s.id];
        closeModal(); toast("Progress reset"); renderStudent();
      };
    };
    $("#slang").onchange = async e => {
      const v = e.target.value, { error } = await sb.from("profiles").update({ lang: v }).eq("id", s.id);
      if (error) { toast("Couldn't save: " + error.message); return; }
      s.lang = v; toast("Saved"); renderStudent();
    };
  }
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
  if ($("#rp")) $("#rp").onclick = () => {
    const pw = genPassword();
    openModal(`<h2>Reset password</h2><p class="sub">New password for <b>${esc(s.nickname)}</b>:</p><input class="field" id="rpw" value="${pw}"><div class="err" id="rerr"></div>
      <div class="row two"><button class="btn ghost" id="rc">Cancel</button><button class="btn blue" id="rok">Set password</button></div>`);
    $("#rc").onclick = closeModal;
    $("#rok").onclick = async () => { const p = $("#rpw").value; $("#rok").disabled = true;
      try { await callAdmin({ action: "reset_password", user_id: s.id, password: p }); showCredentials(s.username, p, "Password reset ✓", s.lang); }
      catch (e) { $("#rerr").textContent = e.message; $("#rok").disabled = false; } };
  };
  if ($("#del")) $("#del").onclick = () => {
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
