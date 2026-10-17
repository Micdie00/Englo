// Aufbau und Ablauf einer Lernrunde.
import { isDue, isNew, card, grade, logAnswer, settings, save } from './store.js';
import { allVocab, allCategories } from './content.js';
import { ttsSupported, recognitionSupported } from './speech.js';
import { vocabAnswers } from './check.js';

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Fällige zuerst, dann neue, optional auffüllen mit beliebigen (Übungsmodus)
export function buildQueue(pool, { len, newMax = 0, fill = false, shuffleNew = false }) {
  const now = Date.now();
  const due = pool.filter(it => isDue(it.id, now)).sort((a, b) => card(a.id).d - card(b.id).d);
  let fresh = pool.filter(it => isNew(it.id));
  if (shuffleNew) fresh = shuffle(fresh);
  let q = due.slice(0, len);
  if (q.length < len && newMax > 0) q = q.concat(fresh.slice(0, Math.min(newMax, len - q.length)));
  if (fill && q.length < len) {
    const taken = new Set(q.map(i => i.id));
    q = q.concat(shuffle(pool.filter(it => !taken.has(it.id))).slice(0, len - q.length));
  }
  return shuffle(q);
}

function enabledModes() {
  const m = settings().modes;
  const out = [];
  if (m.type) out.push('type');
  if (m.mc) out.push('mc', 'mcrev');
  if (m.listen && ttsSupported()) out.push('listen');
  if (m.speak && recognitionSupported()) out.push('speak');
  return out.length ? out : ['type'];
}

// Übungsart für eine Vokabel – neue Wörter erst erkennen, bekannte aktiv produzieren
export function pickMode(item) {
  if (item.kind === 'grammar') return item.t;
  const modes = enabledModes();
  const c = card(item.id);
  const reps = c?.r || 0;
  let prefer;
  if (!c) prefer = ['mc', 'type'];
  else if (reps <= 1) prefer = ['type', 'mc', 'listen'];
  else prefer = ['type', 'type', 'type', 'speak', 'listen', 'mcrev'];
  const options = prefer.filter(p => modes.includes(p));
  const pool = options.length ? options : modes;
  return pool[(Math.random() * pool.length) | 0];
}

export function mcOptions(item, reverse) {
  const sameCat = allCategories().find(c => c.id === item.cat)?.words || [];
  let pool = sameCat.filter(w => w.id !== item.id);
  if (pool.length < 3) pool = allVocab().filter(w => w.id !== item.id);
  const label = w => reverse ? w.de : vocabAnswers(w.en)[0];
  const correct = label(item);
  const seen = new Set([correct.toLowerCase()]);
  const distractors = [];
  for (const w of shuffle([...pool])) {
    const l = label(w);
    if (seen.has(l.toLowerCase())) continue;
    seen.add(l.toLowerCase());
    distractors.push(l);
    if (distractors.length === 3) break;
  }
  const opts = shuffle([correct, ...distractors]);
  return { opts, correct: opts.indexOf(correct) };
}

export class Session {
  constructor(title, items, { back = '#/', practice = false } = {}) {
    this.title = title;
    this.back = back;
    this.practice = practice;
    this.queue = items.map(item => ({ item, mode: pickMode(item) }));
    this.total = items.length;
    this.pos = 0;
    this.graded = new Set();
    this.retries = new Map();
    this.correct = 0;
    this.wrong = new Map(); // id → item
    this.pending = null;
  }
  get current() { return this.queue[this.pos]; }
  get done() { return this.pos >= this.queue.length; }

  // Antwort vormerken – wirksam erst bei commit(), damit "Ich hatte recht" noch möglich ist
  answer(correct) { this.pending = { correct }; }
  override() { if (this.pending) this.pending.correct = true; }

  commit() {
    const q = this.current;
    if (!q || !this.pending) return;
    const { correct } = this.pending;
    const id = q.item.id;
    logAnswer(correct);
    if (!this.graded.has(id)) {
      this.graded.add(id);
      grade(id, correct);
      if (correct) this.correct++;
    }
    if (!correct) {
      this.wrong.set(id, q.item);
      const n = this.retries.get(id) || 0;
      if (n < 2) {
        this.retries.set(id, n + 1);
        const at = Math.min(this.queue.length, this.pos + 4);
        const mode = q.item.kind === 'vocab' ? (enabledModes().includes('type') ? 'type' : q.mode) : q.mode;
        this.queue.splice(at, 0, { item: q.item, mode, retry: true });
      }
    }
    save();
    this.pending = null;
    this.pos++;
  }
}
