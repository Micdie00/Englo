// Lokaler Speicher (localStorage) + Wiederholungssystem (vereinfachtes SM-2) + Zusammenführen für den Sync.

const KEY = 'englisch-app-v1';
const DAY = 86400000;

const DEFAULT_SETTINGS = {
  goal: 30,            // Antworten pro Tag
  sessionLen: 20,      // Fragen pro Runde
  newPerSession: 8,    // neue Wörter pro Runde
  voice: '',
  rate: 0.95,
  modes: { type: true, mc: true, listen: true, speak: true },
  theme: 'auto',
  u: 0,
};

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function blank() {
  return { v: 1, srs: {}, log: {}, custom: {}, settings: { ...DEFAULT_SETTINGS } };
}

let state = load();
const listeners = new Set();

function load() {
  let s;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch { s = null; }
  s = s && typeof s === 'object' ? s : blank();
  s.srs ||= {}; s.log ||= {}; s.custom ||= {};
  s.settings = { ...DEFAULT_SETTINGS, ...(s.settings || {}), modes: { ...DEFAULT_SETTINGS.modes, ...(s.settings?.modes || {}) } };
  s.device ||= uid();
  s.meta ||= {};
  return s;
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('Speichern fehlgeschlagen', e); }
  listeners.forEach(fn => fn());
}

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function getState() { return state; }
export function settings() { return state.settings; }
export function setSetting(key, value) {
  state.settings[key] = value;
  state.settings.u = Date.now();
  save();
}

// ── Datum ──
export function dayKey(t = Date.now()) {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function startOfDay(t = Date.now()) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }

// ── SRS ──
export function card(id) { return state.srs[id]; }

export function isDue(id, now = Date.now()) {
  const c = state.srs[id];
  return !!c && c.d <= now;
}

export function isNew(id) { return !state.srs[id]; }

export function grade(id, correct) {
  const now = Date.now();
  const c = state.srs[id] || { r: 0, i: 0, e: 2.3, d: now, l: 0 };
  if (correct) {
    c.i = c.r === 0 ? 1 : c.r === 1 ? 3 : Math.max(c.i + 1, Math.round(c.i * c.e));
    c.e = Math.min(2.8, c.e + 0.05);
    c.r += 1;
    c.d = startOfDay(now) + c.i * DAY + 3 * 3600000; // ab 3 Uhr früh fällig
  } else {
    c.l += 1;
    c.r = 0;
    c.i = 0;
    c.e = Math.max(1.3, c.e - 0.2);
    c.d = now + 10 * 60000; // in 10 Minuten wieder fällig
  }
  c.u = now;
  state.srs[id] = c;
}

export function logAnswer(correct) {
  const dev = (state.log[state.device] ||= {});
  const k = dayKey();
  const e = (dev[k] ||= { n: 0, c: 0 });
  e.n += 1;
  if (correct) e.c += 1;
}

// Status eines Elements für Fortschrittsanzeigen
export function level(id) {
  const c = state.srs[id];
  if (!c) return 'new';
  if (c.i >= 21) return 'mastered';
  if (c.r > 0) return 'learning';
  return 'struggling';
}

// ── Statistik ──
export function dailyTotals() {
  const out = {};
  for (const dev of Object.values(state.log)) {
    for (const [k, e] of Object.entries(dev)) {
      const o = (out[k] ||= { n: 0, c: 0 });
      o.n += e.n; o.c += e.c;
    }
  }
  return out;
}

export function today() {
  return dailyTotals()[dayKey()] || { n: 0, c: 0 };
}

export function streak() {
  const days = dailyTotals();
  let n = 0;
  let t = Date.now();
  if (!days[dayKey(t)]?.n) t -= DAY; // heute noch nicht gelernt → Serie zählt ab gestern
  while (days[dayKey(t)]?.n) { n++; t -= DAY; }
  return n;
}

// ── Eigene Vokabeln ──
export function customWords() {
  return Object.entries(state.custom).filter(([, w]) => !w.del).map(([id, w]) => ({ id, ...w }));
}
export function addCustom(de, en, ex) {
  const id = 'c:' + uid();
  state.custom[id] = { de, en, ex, u: Date.now() };
  save();
  return id;
}
export function deleteCustom(id) {
  if (state.custom[id]) state.custom[id] = { del: true, u: Date.now() };
  delete state.srs[id];
  save();
}

// ── Export / Import / Reset ──
function syncable(s) {
  return { v: 1, srs: s.srs, log: s.log, custom: s.custom, settings: s.settings };
}
export function exportData() { return JSON.stringify(syncable(state), null, 1); }

export function importData(json) {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object' || !data.srs) throw new Error('Ungültige Datei');
  mergeIn(data);
}

export function resetProgress() {
  const device = state.device;
  state = blank();
  state.device = device;
  state.meta = {};
  save();
}

// ── Zusammenführen (Sync) ── pro Eintrag gewinnt der neuere Stand
export function merge(a, b) {
  if (!b) return syncable(a);
  const out = { v: 1, srs: { ...a.srs }, log: {}, custom: { ...a.custom }, settings: a.settings };
  for (const [id, c] of Object.entries(b.srs || {})) {
    if (!out.srs[id] || (c.u || 0) > (out.srs[id].u || 0)) out.srs[id] = c;
  }
  for (const [id, w] of Object.entries(b.custom || {})) {
    if (!out.custom[id] || (w.u || 0) > (out.custom[id].u || 0)) out.custom[id] = w;
  }
  // gelöschte eigene Wörter auch aus SRS entfernen
  for (const [id, w] of Object.entries(out.custom)) if (w.del) delete out.srs[id];
  // Logs: pro Gerät und Tag den höheren Zähler nehmen
  for (const src of [a.log || {}, b.log || {}]) {
    for (const [dev, days] of Object.entries(src)) {
      const d = (out.log[dev] ||= {});
      for (const [k, e] of Object.entries(days)) {
        if (!d[k] || e.n > d[k].n) d[k] = { ...e };
      }
    }
  }
  if (b.settings && (b.settings.u || 0) > (a.settings?.u || 0)) {
    out.settings = { ...DEFAULT_SETTINGS, ...b.settings, modes: { ...DEFAULT_SETTINGS.modes, ...(b.settings.modes || {}) } };
  }
  return out;
}

export function mergeIn(remote) {
  const m = merge(state, remote);
  state.srs = m.srs; state.log = m.log; state.custom = m.custom; state.settings = m.settings;
  save();
  return syncable(state);
}

export function snapshot() { return syncable(state); }
export function setMeta(k, v) { state.meta[k] = v; save(); }
export function meta(k) { return state.meta[k]; }
