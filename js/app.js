import * as store from './store.js';
import { allCategories, getCategory, topics, groups, getTopic, allVocab, allGrammar, allItems } from './content.js';
import { Session, buildQueue, mcOptions, shuffle } from './session.js';
import { checkVocab, checkGrammar, wordDiff, vocabAnswers, matches } from './check.js';
import { speak, ttsSupported, recognitionSupported, listen, englishVoices } from './speech.js';
import * as sync from './sync.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const view = $('#view');

let session = null;
let installPrompt = null;

// ───────────────────────── Router ─────────────────────────
const routes = [
  [/^#\/?$/, renderHome],
  [/^#\/vocab$/, renderVocab],
  [/^#\/vocab\/([\w-]+)$/, renderCategory],
  [/^#\/grammar$/, renderGrammar],
  [/^#\/grammar\/([\w-]+)$/, renderTopic],
  [/^#\/stats$/, renderStats],
  [/^#\/settings$/, renderSettings],
  [/^#\/session$/, renderSession],
];

function route() {
  const h = location.hash || '#/';
  if (sync.isAuthRedirect(h)) {
    history.replaceState(null, '', location.pathname + '#/settings');
    sync.handleAuthRedirect(h)
      .then(() => { toast('E-Mail bestätigt und angemeldet ✓'); route(); })
      .catch(err => { toast(err.message, 8000); route(); });
    return;
  }
  if (h !== '#/session' && session) { session = null; sync.scheduleSync(1000); }
  document.body.classList.toggle('in-session', h === '#/session');
  for (const [re, fn] of routes) {
    const m = h.match(re);
    if (m) {
      const tab = h.split('/')[1] || '';
      $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
      fn(...m.slice(1));
      window.scrollTo(0, 0);
      return;
    }
  }
  location.hash = '#/';
}
window.addEventListener('hashchange', route);

function go(hash) {
  if (location.hash === hash) route(); else location.hash = hash;
}

function toast(msg, ms = 3000) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, ms);
}

// ───────────────────────── Fortschritt ─────────────────────────
function progressOf(items) {
  let learned = 0, mastered = 0, due = 0;
  const now = Date.now();
  for (const it of items) {
    const lv = store.level(it.id);
    if (lv === 'learning' || lv === 'mastered') learned++;
    if (lv === 'mastered') mastered++;
    if (store.isDue(it.id, now)) due++;
  }
  return { learned, mastered, due, total: items.length };
}

function bar(p, total) {
  const pct = total ? Math.round((p / total) * 100) : 0;
  return `<div class="bar"><i style="width:${pct}%"></i></div>`;
}

function ring(value, max) {
  const pct = Math.min(1, max ? value / max : 0);
  const r = 26, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="${r}" class="ring-bg"/>
    <circle cx="32" cy="32" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct)}"/>
  </svg>`;
}

// ───────────────────────── Start ─────────────────────────
function renderHome() {
  const s = store.settings();
  const t = store.today();
  const streak = store.streak();
  const due = allItems().filter(it => store.isDue(it.id)).length;
  const fresh = allVocab().filter(it => store.isNew(it.id)).length;
  const tenses = topics.filter(tp => tp.group === 'tenses');
  const tips = allVocab().filter(w => w.note);
  const tip = tips[Math.floor(Date.now() / 86400000) % tips.length];
  const hour = new Date().getHours();
  const hello = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';

  view.innerHTML = `
  <header class="page-head">
    <h1>${hello}! 👋</h1>
    <p class="muted">${new Date().toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
  </header>

  <div class="stats-row">
    <div class="stat"><div class="stat-ring">${ring(t.n, s.goal)}<span>${Math.min(100, Math.round((t.n / s.goal) * 100))}%</span></div><div><b>${t.n} / ${s.goal}</b><small>Tagesziel</small></div></div>
    <div class="stat"><div class="stat-icon">🔥</div><div><b>${streak} ${streak === 1 ? 'Tag' : 'Tage'}</b><small>Serie</small></div></div>
    <div class="stat"><div class="stat-icon">⏰</div><div><b>${due}</b><small>fällig</small></div></div>
  </div>

  ${installPrompt ? `<button class="banner" id="install">📲 Als App installieren</button>` : ''}

  <div class="actions-grid">
    ${due ? `<button class="action primary" id="review">
      <span class="a-icon">🔁</span><span><b>Wiederholen</b><small>${Math.min(due, s.sessionLen)} von ${due} fälligen Übungen</small></span>
    </button>` : ''}
    <button class="action ${due ? '' : 'primary'}" id="new" ${fresh ? '' : 'disabled'}>
      <span class="a-icon">✨</span><span><b>Neue Wörter</b><small>${due ? '' : 'Nichts fällig – Zeit für Neues! · '}${s.newPerSession} neue Vokabeln aus allen Themen</small></span>
    </button>
    <button class="action" id="tenses">
      <span class="a-icon">⏳</span><span><b>Tenses-Training</b><small>Gemischte Übungen zu allen Zeitformen</small></span>
    </button>
    <button class="action" id="grammar-mix">
      <span class="a-icon">🧠</span><span><b>Grammatik-Mix</b><small>Quer durch alle Themen</small></span>
    </button>
  </div>

  <section class="card">
    <h2>Zeitformen</h2>
    <div class="topic-list">
      ${tenses.map(tp => topicRow(tp)).join('')}
    </div>
  </section>

  ${tip ? `<section class="card tip">
    <h2>💡 Wusstest du?</h2>
    <p><b>${esc(tip.de)}</b> → <b>${esc(vocabAnswers(tip.en)[0])}</b> <button class="icon-btn" data-say="${esc(vocabAnswers(tip.en)[0])}" aria-label="Vorlesen">🔊</button></p>
    <p class="muted">${esc(tip.note)}</p>
  </section>` : ''}
  `;

  $('#review')?.addEventListener('click', () => {
    const items = buildQueue(allItems(), { len: s.sessionLen });
    startSession('Wiederholung', items, '#/');
  });
  $('#new')?.addEventListener('click', () => {
    const items = buildQueue(allVocab(), { len: s.newPerSession, newMax: s.newPerSession, shuffleNew: true });
    startSession('Neue Wörter', items, '#/');
  });
  $('#tenses').addEventListener('click', () => {
    const pool = tenses.flatMap(tp => tp.items);
    startSession('Tenses-Training', buildQueue(pool, { len: s.sessionLen, newMax: s.sessionLen, fill: true, shuffleNew: true }), '#/');
  });
  $('#grammar-mix').addEventListener('click', () => {
    startSession('Grammatik-Mix', buildQueue(allGrammar(), { len: s.sessionLen, newMax: s.sessionLen, fill: true, shuffleNew: true }), '#/');
  });
  $('#install')?.addEventListener('click', doInstall);
  bindSay(view);
}

function topicRow(tp) {
  const p = progressOf(tp.items);
  return `<a class="topic-row" href="#/grammar/${tp.id}">
    <div class="tr-main"><b>${esc(tp.title)}</b>${bar(p.learned, p.total)}</div>
    <div class="tr-side"><span class="badge">${tp.level}</span>${p.due ? `<span class="due-dot" title="${p.due} fällig">${p.due}</span>` : ''}</div>
  </a>`;
}

function bindSay(root) {
  $$('[data-say]', root).forEach(b => b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); speak(b.dataset.say); }));
}

// ───────────────────────── Vokabeln ─────────────────────────
function renderVocab() {
  const cats = allCategories();
  const all = allVocab();
  const p = progressOf(all);
  view.innerHTML = `
  <header class="page-head">
    <h1>Vokabeln</h1>
    <p class="muted">${p.learned} von ${p.total} Wörtern gelernt · ${p.mastered} gefestigt</p>
  </header>
  <div class="cat-grid">
    ${cats.map(c => {
      const cp = progressOf(c.words);
      return `<a class="cat-card" href="#/vocab/${c.id}">
        <div class="cat-icon">${c.icon}</div>
        <div class="cat-name">${esc(c.name)}</div>
        <div class="cat-meta">${c.id === 'custom' && !c.words.length ? 'Eigene Wörter hinzufügen' : `${cp.learned} / ${cp.total}`}${cp.due ? ` · <span class="due-txt">${cp.due} fällig</span>` : ''}</div>
        ${bar(cp.learned, cp.total)}
      </a>`;
    }).join('')}
  </div>`;
}

function renderCategory(id) {
  const c = getCategory(id);
  if (!c) return go('#/vocab');
  const s = store.settings();
  const p = progressOf(c.words);
  const isCustom = id === 'custom';
  const labels = { new: 'neu', learning: 'lerne ich', mastered: 'gefestigt', struggling: 'schwierig' };

  view.innerHTML = `
  <header class="page-head">
    <a class="back" href="#/vocab">← Vokabeln</a>
    <h1>${c.icon} ${esc(c.name)}</h1>
    <p class="muted">${p.learned} / ${p.total} gelernt · ${p.mastered} gefestigt${p.due ? ` · ${p.due} fällig` : ''}</p>
  </header>
  <div class="btn-row">
    <button class="btn primary" id="learn" ${c.words.length ? '' : 'disabled'}>Lernen</button>
    <button class="btn" id="practice" ${c.words.length ? '' : 'disabled'}>Alles üben</button>
  </div>
  ${isCustom ? `
  <form class="card add-form" id="add">
    <h2>Neues Wort</h2>
    <label>Deutsch<input name="de" required autocomplete="off"></label>
    <label>Englisch <small class="muted">(Varianten mit „ / “ trennen)</small><input name="en" required autocomplete="off" autocapitalize="off" spellcheck="false" lang="en"></label>
    <label>Beispielsatz <small class="muted">(optional)</small><input name="ex" autocomplete="off" lang="en"></label>
    <button class="btn primary">Hinzufügen</button>
  </form>` : ''}
  <section class="card">
    <ul class="word-list">
      ${c.words.map(w => {
        const lv = store.level(w.id);
        return `<li>
          <span class="lv lv-${lv}" title="${labels[lv]}"></span>
          <div class="wl-main"><b>${esc(w.de)}</b><span>${esc(w.en)}</span>${w.note ? `<small class="note">${esc(w.note)}</small>` : ''}</div>
          <button class="icon-btn" data-say="${esc(vocabAnswers(w.en)[0])}" aria-label="Vorlesen">🔊</button>
          ${isCustom ? `<button class="icon-btn" data-del="${w.id}" aria-label="Löschen">🗑️</button>` : ''}
        </li>`;
      }).join('') || '<li class="muted">Noch keine Wörter.</li>'}
    </ul>
  </section>
  <p class="legend"><span class="lv lv-new"></span>neu <span class="lv lv-struggling"></span>schwierig <span class="lv lv-learning"></span>lerne ich <span class="lv lv-mastered"></span>gefestigt</p>
  `;

  $('#learn').addEventListener('click', () => {
    const items = buildQueue(c.words, { len: s.sessionLen, newMax: s.newPerSession });
    if (!items.length) { toast('Nichts fällig und keine neuen Wörter – probier „Alles üben“.'); return; }
    startSession(c.name, items, `#/vocab/${id}`);
  });
  $('#practice').addEventListener('click', () => {
    startSession(c.name, buildQueue(c.words, { len: s.sessionLen, newMax: s.sessionLen, fill: true }), `#/vocab/${id}`, true);
  });
  $('#add')?.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    store.addCustom(f.get('de').trim(), f.get('en').trim(), f.get('ex').trim());
    sync.scheduleSync();
    toast('Wort hinzugefügt');
    renderCategory(id);
    $('#add input[name=de]')?.focus();
  });
  $$('[data-del]').forEach(b => b.addEventListener('click', () => {
    if (!confirm('Dieses Wort löschen?')) return;
    store.deleteCustom(b.dataset.del);
    sync.scheduleSync();
    renderCategory(id);
  }));
  bindSay(view);
}

// ───────────────────────── Grammatik ─────────────────────────
function renderGrammar() {
  const p = progressOf(allGrammar());
  view.innerHTML = `
  <header class="page-head">
    <h1>Grammatik</h1>
    <p class="muted">${p.learned} von ${p.total} Übungen geschafft</p>
  </header>
  ${groups.map(g => `
    <section class="card">
      <h2>${esc(g.name)}</h2>
      <div class="topic-list">${topics.filter(t => t.group === g.id).map(topicRow).join('')}</div>
    </section>`).join('')}
  `;
}

function renderTopic(id) {
  const tp = getTopic(id);
  if (!tp) return go('#/grammar');
  const p = progressOf(tp.items);
  view.innerHTML = `
  <header class="page-head">
    <a class="back" href="#/grammar">← Grammatik</a>
    <h1>${esc(tp.title)}</h1>
    <p class="muted"><span class="badge">${tp.level}</span> ${p.learned} / ${p.total} Übungen geschafft${p.due ? ` · ${p.due} fällig` : ''}</p>
  </header>
  <div class="btn-row">
    <button class="btn primary" id="start">Übungen starten (${tp.items.length})</button>
    ${p.due ? `<button class="btn" id="due">Nur fällige (${p.due})</button>` : ''}
  </div>
  <article class="card lesson">${tp.explain}</article>
  <div class="btn-row bottom"><button class="btn primary" id="start2">Jetzt üben →</button></div>
  `;
  const start = () => startSession(tp.title, shuffle([...tp.items]), `#/grammar/${id}`);
  $('#start').addEventListener('click', start);
  $('#start2').addEventListener('click', start);
  $('#due')?.addEventListener('click', () => startSession(tp.title, buildQueue(tp.items, { len: 50 }), `#/grammar/${id}`));
}

// ───────────────────────── Lernrunde ─────────────────────────
function startSession(title, items, back, practice = false) {
  if (!items.length) { toast('Keine Übungen verfügbar.'); return; }
  session = new Session(title, items, { back, practice });
  go('#/session');
}

function renderSession() {
  if (!session) return go('#/');
  if (session.done) return renderSummary();
  const q = session.current;
  const it = q.item;
  const answered = session.pos;
  const total = session.queue.length;

  view.innerHTML = `
  <div class="session">
    <div class="s-top">
      <button class="icon-btn" id="quit" aria-label="Beenden">✕</button>
      <div class="bar s-bar"><i style="width:${Math.round((answered / total) * 100)}%"></i></div>
      <span class="s-count">${answered + 1}/${total}</span>
    </div>
    <div class="q-card" id="qcard"></div>
    <div class="feedback" id="fb" hidden></div>
    <div class="s-actions" id="actions"></div>
  </div>`;
  $('#quit').addEventListener('click', () => {
    if (session.pos > 0) { session.queue.length = session.pos; renderSummary(); }
    else { const b = session.back; session = null; go(b); }
  });

  if (it.kind === 'vocab') renderVocabQ(q);
  else renderGrammarQ(q);
}

function setActions(html) { $('#actions').innerHTML = html; }

function textInput(placeholder = 'Deine Antwort …', value = '', multiline = false) {
  const attrs = `id="ans" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="en" placeholder="${esc(placeholder)}"`;
  return multiline
    ? `<textarea ${attrs} rows="3">${esc(value)}</textarea>`
    : `<input ${attrs} value="${esc(value)}" enterkeyhint="done">`;
}

// Eingabe absenden mit Enter (auch in Textarea)
function bindSubmit(fn) {
  const inp = $('#ans');
  inp?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      e.stopPropagation(); // sonst würde das globale Enter sofort „Weiter“ auslösen
      if ($('#fb').hidden) fn(); else next();
    }
  });
  $('#check')?.addEventListener('click', fn);
  setTimeout(() => { if (inp) { inp.focus(); const l = inp.value.length; inp.setSelectionRange?.(l, l); } }, 50);
}

function showFeedback(ok, html, { canOverride = false, typo = false } = {}) {
  const fb = $('#fb');
  fb.hidden = false;
  fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
  const head = ok ? (typo ? '✓ Richtig – kleiner Tippfehler' : pick(['✓ Richtig!', '✓ Genau!', '✓ Super!', '✓ Perfekt!'])) : '✗ Nicht ganz';
  fb.innerHTML = `<div class="fb-head">${head}</div>${html}`;
  $('#ans')?.setAttribute('readonly', '');
  $$('.opt').forEach(b => b.disabled = true);
  setActions(`${canOverride && !ok ? '<button class="btn ghost" id="override">Meine Antwort war richtig</button>' : ''}<button class="btn primary" id="next">Weiter →</button>`);
  $('#override')?.addEventListener('click', () => { session.override(); next(); });
  $('#next').addEventListener('click', next);
  $('#next').focus({ preventScroll: true });
  fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function pick(a) { return a[(Math.random() * a.length) | 0]; }

function next() {
  session.commit();
  renderSession();
}

// globales Enter für „Weiter“ (wenn Feedback sichtbar)
document.addEventListener('keydown', e => {
  if (location.hash !== '#/session' || !session) return;
  const fbVisible = $('#fb') && !$('#fb').hidden;
  if (e.key === 'Enter' && fbVisible && document.activeElement?.id !== 'override') { e.preventDefault(); next(); return; }
  if (!fbVisible && /^[1-4]$/.test(e.key) && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    $$('.opt')[+e.key - 1]?.click();
  }
});

function vocabReveal(it) {
  const main = vocabAnswers(it.en)[0];
  return `<div class="reveal">
    <div class="rv-word"><b>${esc(it.en)}</b> <button class="icon-btn" data-say="${esc(main)}" aria-label="Vorlesen">🔊</button></div>
    <div class="rv-de">${esc(it.de)}</div>
    ${it.ex ? `<div class="rv-ex">„${esc(it.ex)}“ <button class="icon-btn sm" data-say="${esc(it.ex)}" aria-label="Beispiel vorlesen">🔊</button></div>` : ''}
    ${it.note ? `<div class="rv-note">💡 ${esc(it.note)}</div>` : ''}
  </div>`;
}

function autoSay(it) {
  if (store.settings().autoSpeak !== false) speak(vocabAnswers(it.en)[0]);
}

function renderVocabQ(q) {
  const it = q.item;
  const card = $('#qcard');
  const finish = (ok, extra = '', opts = {}) => {
    session.answer(ok);
    showFeedback(ok, extra + vocabReveal(it), opts);
    bindSay($('#fb'));
    autoSay(it);
  };

  if (q.mode === 'mc' || q.mode === 'mcrev') {
    const rev = q.mode === 'mcrev';
    const { opts, correct } = mcOptions(it, rev);
    card.innerHTML = `
      <div class="q-label">${rev ? 'Was bedeutet das?' : 'Wie heißt das auf Englisch?'}</div>
      <div class="q-prompt">${rev ? `${esc(vocabAnswers(it.en)[0])} <button class="icon-btn" data-say="${esc(vocabAnswers(it.en)[0])}">🔊</button>` : esc(it.de)}</div>
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}"><kbd>${i + 1}</kbd>${esc(o)}</button>`).join('')}</div>`;
    bindSay(card);
    if (rev) speak(vocabAnswers(it.en)[0]);
    $$('.opt', card).forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.i;
      $$('.opt', card)[correct].classList.add('correct');
      if (i !== correct) b.classList.add('wrong');
      finish(i === correct);
    }));
    setActions(`<button class="btn ghost" id="dunno">Weiß ich nicht</button>`);
    $('#dunno').addEventListener('click', () => { $$('.opt', card)[correct].classList.add('correct'); finish(false); });
    return;
  }

  if (q.mode === 'listen') {
    card.innerHTML = `
      <div class="q-label">Hör zu und schreib das englische Wort</div>
      <div class="q-prompt"><button class="big-play" id="play" aria-label="Abspielen">🔊</button><button class="btn ghost sm" id="slow">🐢 langsam</button></div>
      ${textInput('Was hörst du?')}`;
    const word = vocabAnswers(it.en)[0];
    $('#play').addEventListener('click', () => speak(word));
    $('#slow').addEventListener('click', () => speak(word, 0.6));
    setTimeout(() => speak(word), 250);
    setActions(`<button class="btn ghost" id="dunno">Weiß ich nicht</button><button class="btn primary" id="check">Prüfen</button>`);
    const submit = () => {
      if ($('#fb').hidden === false) return;
      const r = checkVocab($('#ans').value, word);
      finish(r.result !== 'wrong', '', { canOverride: true, typo: r.result === 'typo' });
    };
    bindSubmit(submit);
    $('#dunno').addEventListener('click', () => finish(false));
    return;
  }

  if (q.mode === 'speak') {
    card.innerHTML = `
      <div class="q-label">Sag es auf Englisch 🎤</div>
      <div class="q-prompt">${esc(it.de)}</div>
      <div class="speak-box"><button class="mic" id="mic" aria-label="Sprechen">🎤</button><div class="heard muted" id="heard">Tippe aufs Mikrofon und sprich.</div></div>`;
    setActions(`<button class="btn ghost" id="totype">Lieber tippen</button><button class="btn ghost" id="dunno">Weiß ich nicht</button>`);
    $('#mic').addEventListener('click', async () => {
      const mic = $('#mic');
      mic.classList.add('rec');
      $('#heard').textContent = 'Ich höre zu …';
      try {
        const alts = await listen();
        mic.classList.remove('rec');
        const hit = alts.find(a => checkVocab(a, it.en).result !== 'wrong');
        $('#heard').innerHTML = `Verstanden: „${esc(hit || alts[0])}“`;
        if (hit) finish(true);
        else {
          // zweiter Versuch erlaubt
          $('#heard').innerHTML += '<br><span class="warn">Das passt nicht ganz – nochmal versuchen?</span>';
          setActions(`<button class="btn ghost" id="dunno">Auflösen</button>`);
          $('#dunno').addEventListener('click', () => finish(false, '', { canOverride: true }));
        }
      } catch (e) {
        mic.classList.remove('rec');
        $('#heard').innerHTML = `<span class="warn">${esc(e.message)}</span>`;
      }
    });
    $('#totype')?.addEventListener('click', () => { q.mode = 'type'; renderVocabQ(q); });
    $('#dunno').addEventListener('click', () => finish(false));
    return;
  }

  // Standard: tippen (Deutsch → Englisch)
  card.innerHTML = `
    <div class="q-label">Übersetze ins Englische</div>
    <div class="q-prompt">${esc(it.de)}</div>
    ${textInput('auf Englisch …')}`;
  setActions(`<button class="btn ghost" id="dunno">Weiß ich nicht</button><button class="btn primary" id="check">Prüfen</button>`);
  const submit = () => {
    if ($('#fb').hidden === false) return;
    const val = $('#ans').value;
    if (!val.trim()) { $('#ans').focus(); return; }
    const r = checkVocab(val, it.en);
    finish(r.result !== 'wrong', r.result === 'wrong' ? `<div class="yours">Deine Antwort: <s>${esc(val)}</s></div>` : '', { canOverride: true, typo: r.result === 'typo' });
  };
  bindSubmit(submit);
  $('#dunno').addEventListener('click', () => finish(false));
}

function renderGrammarQ(q) {
  const it = q.item;
  const tp = getTopic(it.topic);
  const card = $('#qcard');
  const labels = { gap: 'Setze die richtige Form ein', mc: 'Wähle die richtige Antwort', fix: 'Korrigiere den Fehler', tr: 'Übersetze ins Englische' };
  const sentence = s => esc(s).replace(/___/g, '<span class="gap">_____</span>');
  const ex = it.ex ? `<div class="explain">💡 ${esc(it.ex)}</div>` : '';
  const topicLink = `<a class="topic-link" href="#/grammar/${tp.id}" data-leave>Regel ansehen: ${esc(tp.title)}</a>`;

  card.innerHTML = `
    <div class="q-label">${labels[it.t]} <span class="q-topic">${esc(tp.title)}</span></div>
    <div class="q-prompt sentence ${it.t === 'fix' ? 'wrong-sentence' : ''}">${sentence(it.q)}</div>
    ${it.t === 'mc'
      ? `<div class="opts">${it.o.map((o, i) => `<button class="opt" data-i="${i}"><kbd>${i + 1}</kbd>${esc(o)}</button>`).join('')}</div>`
      : it.t === 'gap' ? textInput('Lücke …')
      : textInput(it.t === 'fix' ? 'Korrigierter Satz …' : 'Auf Englisch …', it.t === 'fix' ? it.q : '', true)}`;

  if (it.t === 'mc') {
    $$('.opt', card).forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.i;
      $$('.opt', card)[it.c].classList.add('correct');
      if (i !== it.c) b.classList.add('wrong');
      session.answer(i === it.c);
      showFeedback(i === it.c, ex + topicLink);
    }));
    setActions('');
    return;
  }

  setActions(`<button class="btn ghost" id="dunno">Lösung zeigen</button><button class="btn primary" id="check">Prüfen</button>`);
  const solution = (closest, val) => {
    const shown = it.a.slice(0, 3).map(a => `<li>${esc(it.t === 'gap' ? it.q.replace('___', '[' + a + ']') : a)}</li>`).join('');
    let diff = '';
    if (val && (it.t === 'fix' || it.t === 'tr')) {
      diff = `<div class="diff">${wordDiff(val, closest).map(d => `<span class="d-${d.k}">${esc(d.w)}</span>`).join(' ')}</div>
              <small class="muted diff-legend"><span class="d-missing">fehlt</span> <span class="d-extra">zu viel / falsch</span></small>`;
    }
    return `${diff}<div class="solution"><small>${it.a.length > 1 ? 'Mögliche Lösungen' : 'Lösung'}:</small><ul>${shown}</ul></div>`;
  };
  const submit = () => {
    if ($('#fb').hidden === false) return;
    const val = $('#ans').value;
    if (!val.trim()) { $('#ans').focus(); return; }
    const r = checkGrammar(val, it.a);
    const ok = r.result === 'correct';
    session.answer(ok);
    const okExtra = ok && it.a.length > 1 && it.t !== 'gap' ? `<div class="solution"><small>Auch möglich:</small><ul>${it.a.filter(a => !matches(val, [a])).slice(0, 2).map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>` : '';
    showFeedback(ok, (ok ? okExtra : solution(r.closest, val)) + ex + topicLink, { canOverride: true });
  };
  bindSubmit(submit);
  $('#dunno').addEventListener('click', () => {
    session.answer(false);
    showFeedback(false, solution(it.a[0], '') + ex + topicLink);
  });
}

function renderSummary() {
  const s = session;
  const total = s.graded.size;
  const pct = total ? Math.round((s.correct / total) * 100) : 0;
  const wrong = [...s.wrong.values()];
  const msg = pct >= 90 ? 'Ausgezeichnet! 🏆' : pct >= 70 ? 'Gut gemacht! 💪' : pct >= 50 ? 'Weiter so! 📈' : 'Übung macht den Meister! 🌱';
  sync.scheduleSync(500);

  view.innerHTML = `
  <div class="session summary">
    <div class="sum-head">
      <div class="stat-ring big">${ring(s.correct, total)}<span>${pct}%</span></div>
      <h1>${msg}</h1>
      <p class="muted">${s.correct} von ${total} beim ersten Versuch richtig · Heute: ${store.today().n} / ${store.settings().goal}</p>
    </div>
    ${wrong.length ? `<section class="card">
      <h2>Das üben wir nochmal</h2>
      <ul class="wrong-list">${wrong.map(it => it.kind === 'vocab'
        ? `<li><b>${esc(it.de)}</b> → ${esc(it.en)}</li>`
        : `<li>${esc(it.t === 'tr' ? it.q : it.q.replace('___', '…'))}<br><span class="ok-txt">${esc(it.t === 'mc' ? it.o[it.c] : it.a[0])}</span></li>`).join('')}</ul>
    </section>` : ''}
    <div class="btn-row center">
      ${wrong.length ? '<button class="btn" id="again">Fehler nochmal üben</button>' : ''}
      <button class="btn primary" id="done">Fertig</button>
    </div>
  </div>`;
  $('#done').addEventListener('click', () => { const b = s.back; session = null; go(b); });
  $('#again')?.addEventListener('click', () => {
    session = new Session(s.title, shuffle(wrong), { back: s.back, practice: true });
    renderSession();
  });
}

// ───────────────────────── Statistik ─────────────────────────
function renderStats() {
  const days = store.dailyTotals();
  const last = [];
  for (let i = 13; i >= 0; i--) {
    const t = Date.now() - i * 86400000;
    const k = store.dayKey(t);
    last.push({ k, d: new Date(t), ...(days[k] || { n: 0, c: 0 }) });
  }
  const max = Math.max(10, ...last.map(d => d.n));
  const all = Object.values(days).reduce((a, d) => ({ n: a.n + d.n, c: a.c + d.c }), { n: 0, c: 0 });
  const vp = progressOf(allVocab());
  const gp = progressOf(allGrammar());
  const goal = store.settings().goal;

  view.innerHTML = `
  <header class="page-head"><h1>Statistik</h1></header>
  <div class="stats-row">
    <div class="stat"><div class="stat-icon">🔥</div><div><b>${store.streak()}</b><small>Tage Serie</small></div></div>
    <div class="stat"><div class="stat-icon">✍️</div><div><b>${all.n}</b><small>Antworten gesamt</small></div></div>
    <div class="stat"><div class="stat-icon">🎯</div><div><b>${all.n ? Math.round((all.c / all.n) * 100) : 0}%</b><small>Trefferquote</small></div></div>
  </div>
  <section class="card">
    <h2>Letzte 14 Tage</h2>
    <div class="chart" role="img" aria-label="Antworten pro Tag">
      ${last.map(d => `<div class="col" title="${d.d.toLocaleDateString('de-AT')}: ${d.n} Antworten, ${d.c} richtig">
        <div class="col-bar ${d.n >= goal ? 'goal' : ''}" style="height:${(d.n / max) * 100}%"></div>
        <span>${d.d.toLocaleDateString('de-AT', { weekday: 'narrow' })}</span>
      </div>`).join('')}
    </div>
    <p class="muted small">Grün = Tagesziel (${goal}) erreicht</p>
  </section>
  <section class="card">
    <h2>Vokabeln</h2>
    <p>${vp.learned} / ${vp.total} gelernt · ${vp.mastered} gefestigt</p>
    ${bar(vp.learned, vp.total)}
    <div class="mini-list">${allCategories().filter(c => c.words.length).map(c => { const p = progressOf(c.words); return `<div><span>${c.icon} ${esc(c.name)}</span><span class="muted">${p.learned}/${p.total}</span></div>${bar(p.learned, p.total)}`; }).join('')}</div>
  </section>
  <section class="card">
    <h2>Grammatik</h2>
    <p>${gp.learned} / ${gp.total} Übungen geschafft</p>
    ${bar(gp.learned, gp.total)}
    <div class="mini-list">${topics.map(t => { const p = progressOf(t.items); return `<div><span>${esc(t.title)}</span><span class="muted">${p.learned}/${p.total}</span></div>${bar(p.learned, p.total)}`; }).join('')}</div>
  </section>`;
}

// ───────────────────────── Einstellungen ─────────────────────────
async function renderSettings() {
  const s = store.settings();
  const voices = englishVoices();
  view.innerHTML = `
  <header class="page-head"><h1>Einstellungen</h1></header>

  ${installPrompt ? `<button class="banner" id="install">📲 Als App installieren</button>` : ''}

  <section class="card" id="sync-card"><h2>☁️ Synchronisation</h2><div id="sync-body" class="muted">Lade …</div></section>

  <section class="card form">
    <h2>Lernen</h2>
    <label>Tagesziel (Antworten)<select id="goal">${[10, 20, 30, 50, 80, 120].map(n => `<option ${n === s.goal ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    <label>Fragen pro Runde<select id="sessionLen">${[10, 15, 20, 30, 40].map(n => `<option ${n === s.sessionLen ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    <label>Neue Wörter pro Runde<select id="newPerSession">${[3, 5, 8, 10, 15, 20].map(n => `<option ${n === s.newPerSession ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    <fieldset><legend>Übungsarten für Vokabeln</legend>
      <label class="check"><input type="checkbox" data-mode="type" ${s.modes.type ? 'checked' : ''}> ⌨️ Tippen (Deutsch → Englisch)</label>
      <label class="check"><input type="checkbox" data-mode="mc" ${s.modes.mc ? 'checked' : ''}> ☑️ Multiple Choice</label>
      <label class="check"><input type="checkbox" data-mode="listen" ${s.modes.listen ? 'checked' : ''} ${ttsSupported() ? '' : 'disabled'}> 👂 Hören & schreiben</label>
      <label class="check"><input type="checkbox" data-mode="speak" ${s.modes.speak ? 'checked' : ''} ${recognitionSupported() ? '' : 'disabled'}> 🎤 Sprechen ${recognitionSupported() ? '' : '<small class="muted">(in diesem Browser nicht verfügbar)</small>'}</label>
    </fieldset>
  </section>

  <section class="card form">
    <h2>Aussprache</h2>
    <label>Stimme<select id="voice"><option value="">Automatisch (britisch bevorzugt)</option>${voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.voice ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select></label>
    <label>Sprechtempo <span id="rate-val">${s.rate.toFixed(2)}</span><input type="range" id="rate" min="0.5" max="1.3" step="0.05" value="${s.rate}"></label>
    <label class="check"><input type="checkbox" id="autoSpeak" ${s.autoSpeak !== false ? 'checked' : ''}> Lösung automatisch vorlesen</label>
    <button class="btn" id="test-voice">🔊 Stimme testen</button>
  </section>

  <section class="card form">
    <h2>Darstellung</h2>
    <label>Design<select id="theme">
      <option value="auto" ${s.theme === 'auto' ? 'selected' : ''}>Wie System</option>
      <option value="light" ${s.theme === 'light' ? 'selected' : ''}>Hell</option>
      <option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>Dunkel</option>
    </select></label>
  </section>

  <section class="card form">
    <h2>Daten</h2>
    <div class="btn-row">
      <button class="btn" id="export">⬇️ Exportieren</button>
      <label class="btn file-btn">⬆️ Importieren<input type="file" id="import" accept="application/json,.json" hidden></label>
    </div>
    <button class="btn danger" id="reset">Fortschritt zurücksetzen</button>
  </section>
  <p class="muted small center">Englisch lernen · Version ${window.APP_VERSION || ''}</p>
  `;

  const num = id => $('#' + id).addEventListener('change', e => store.setSetting(id, +e.target.value));
  ['goal', 'sessionLen', 'newPerSession'].forEach(num);
  $$('[data-mode]').forEach(c => c.addEventListener('change', () => {
    store.setSetting('modes', { ...store.settings().modes, [c.dataset.mode]: c.checked });
  }));
  $('#voice').addEventListener('change', e => { store.setSetting('voice', e.target.value); speak('Hello! How are you today?'); });
  $('#rate').addEventListener('input', e => { $('#rate-val').textContent = (+e.target.value).toFixed(2); });
  $('#rate').addEventListener('change', e => store.setSetting('rate', +e.target.value));
  $('#autoSpeak').addEventListener('change', e => store.setSetting('autoSpeak', e.target.checked));
  $('#test-voice').addEventListener('click', () => speak("I've been learning English for years, and I'm getting better every day."));
  $('#theme').addEventListener('change', e => { store.setSetting('theme', e.target.value); applyTheme(); });
  $('#install')?.addEventListener('click', doInstall);

  $('#export').addEventListener('click', () => {
    const blob = new Blob([store.exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `englisch-fortschritt-${store.dayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('#import').addEventListener('change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    try { store.importData(await f.text()); toast('Fortschritt importiert und zusammengeführt ✓'); sync.scheduleSync(); renderSettings(); }
    catch (err) { toast('Import fehlgeschlagen: ' + err.message); }
  });
  $('#reset').addEventListener('click', async () => {
    if (!confirm('Wirklich den gesamten Lernfortschritt löschen? Das kann nicht rückgängig gemacht werden.')) return;
    store.resetProgress();
    await sync.overwriteRemote().catch(() => {});
    toast('Fortschritt zurückgesetzt');
    renderSettings();
  });

  renderSyncCard();
}

async function renderSyncCard() {
  const body = $('#sync-body');
  if (!body) return;
  if (!sync.syncConfigured()) {
    body.innerHTML = `<p>Noch nicht eingerichtet. Trage deine Supabase-URL und den Key in <code>config.js</code> ein, dann kannst du dich hier anmelden und deinen Fortschritt zwischen PC und Handy abgleichen.</p>`;
    return;
  }
  let user = null;
  try { user = await sync.currentUser(); } catch { /* offline */ }
  if (!$('#sync-body')) return;
  if (user) {
    const last = store.meta('lastSync');
    body.innerHTML = `
      <p>Angemeldet als <b>${esc(user.email)}</b></p>
      <p class="muted small" id="last-sync">${last ? 'Zuletzt synchronisiert: ' + new Date(last).toLocaleString('de-AT') : 'Noch nicht synchronisiert'}</p>
      <div class="btn-row"><button class="btn primary" id="sync-now">🔄 Jetzt synchronisieren</button><button class="btn ghost" id="logout">Abmelden</button></div>`;
    $('#sync-now').addEventListener('click', async e => {
      e.target.disabled = true;
      try { await sync.syncNow(); toast('Synchronisiert ✓'); renderSyncCard(); }
      catch (err) { toast('Sync fehlgeschlagen: ' + err.message, 5000); e.target.disabled = false; }
    });
    $('#logout').addEventListener('click', async () => { await sync.signOut(); renderSyncCard(); });
  } else {
    body.innerHTML = `
      <p class="muted">Melde dich an, um deinen Fortschritt auf allen Geräten zu haben.</p>
      <form id="login" class="form">
        <label>E-Mail<input type="email" name="email" required autocomplete="email" autocapitalize="off" spellcheck="false"></label>
        <label>Passwort<input type="password" name="password" required minlength="6" autocomplete="current-password"></label>
        <div class="btn-row"><button class="btn primary" value="in">Anmelden</button><button class="btn" value="up">Registrieren</button></div>
        <p class="warn small" id="login-err"></p>
      </form>`;
    $('#login').addEventListener('submit', async e => {
      e.preventDefault();
      const mode = e.submitter?.value || 'in';
      const f = new FormData(e.target);
      const btns = $$('#login button');
      btns.forEach(b => b.disabled = true);
      $('#login-err').textContent = '';
      try {
        if (mode === 'up') {
          const r = await sync.signUp(f.get('email'), f.get('password'));
          if (r === 'confirm') { $('#login-err').textContent = 'Fast geschafft! Bitte bestätige deine E-Mail-Adresse über den Link in der Mail und melde dich dann hier an.'; btns.forEach(b => b.disabled = false); return; }
        } else {
          await sync.signIn(f.get('email'), f.get('password'));
        }
        toast('Angemeldet und synchronisiert ✓');
        renderSyncCard();
      } catch (err) {
        $('#login-err').textContent = err.message;
        btns.forEach(b => b.disabled = false);
      }
    });
  }
}

// ───────────────────────── Theme, Installation, Service Worker ─────────────────────────
function applyTheme() {
  const t = store.settings().theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = t;
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installPrompt = e;
  if (['#/', '', '#/settings'].includes(location.hash)) route();
});
window.addEventListener('appinstalled', () => { installPrompt = null; toast('App installiert 🎉'); });

async function doInstall() {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  route();
}

// Lokal (Entwicklung) ohne Service Worker, damit Änderungen sofort sichtbar sind – außer mit ?sw
const devHost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !location.search.includes('sw');
if ('serviceWorker' in navigator && location.protocol !== 'file:' && !devHost) {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    const offer = w => {
      const t = document.createElement('div');
      t.className = 'toast show update';
      t.innerHTML = 'Neue Version verfügbar <button class="btn sm primary">Aktualisieren</button>';
      t.querySelector('button').addEventListener('click', () => w.postMessage('skipWaiting'));
      document.body.appendChild(t);
    };
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w);
      });
    });
  });
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
}

// Sync beim Start und beim Verlassen der App
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') sync.syncNow().catch(() => {});
  else sync.scheduleSync(500);
});

store.onChange(() => {
  const t = store.today();
  const badge = $('#today-badge');
  if (badge) badge.textContent = t.n ? t.n : '';
});

applyTheme();
route();
// nach erfolgreichem Start-Sync aktuelle Ansicht auffrischen (außer mitten in einer Runde)
setTimeout(async () => {
  if (!sync.syncConfigured()) return;
  try { if (await sync.syncNow() === 'ok' && location.hash !== '#/session') route(); } catch { /* offline */ }
}, 1200);
