// Baut aus den Datendateien einen Index aller lernbaren Elemente.
import { vocabCategories } from './data/vocab.js';
import { levelLists } from './data/levels.js';
import { grammarGroups, grammarTopics } from './data/grammar.js';
import { customWords } from './store.js';

function slug(s) {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const POS_LABEL = { n: 'Nomen', v: 'Verb', adj: 'Adjektiv', adv: 'Adverb' };

export const categories = vocabCategories.map(cat => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
  words: cat.words.map(([de, en, ex, note]) => ({ id: `v:${cat.id}:${slug(de)}`, kind: 'vocab', cat: cat.id, de, en, ex, note })),
}));

// ── Wortschatz nach Niveau (CEFR-J / Octanove) ──
export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_INFO = {
  A1: ['Anfänger', '🌱'], A2: ['Grundlagen', '🌿'], B1: ['Mittelstufe', '🌳'],
  B2: ['Gute Mittelstufe', '⛰️'], C1: ['Fortgeschritten', '🚀'], C2: ['Nahezu muttersprachlich', '👑'],
};

export const levelCategories = LEVELS.map(lv => {
  const id = 'lv-' + lv.toLowerCase();
  return {
    id, level: lv, name: `${lv} · ${LEVEL_INFO[lv][0]}`, icon: LEVEL_INFO[lv][1],
    words: levelLists[lv].split('\n').map(line => {
      const [en, pos, de] = line.split('\t');
      return { id: `l:${lv}:${slug(en)}:${pos}`, kind: 'vocab', cat: id, level: lv, de, en, pos };
    }),
  };
});

export const groups = grammarGroups;

export const topics = grammarTopics.map(t => ({
  ...t,
  items: t.ex.map((e, i) => ({ ...e, id: `g:${t.id}:${i}`, kind: 'grammar', topic: t.id })),
}));

const byId = new Map();
for (const c of [...categories, ...levelCategories]) for (const w of c.words) byId.set(w.id, w);
for (const t of topics) for (const it of t.items) byId.set(it.id, it);

export function customCategory() {
  return {
    id: 'custom', name: 'Meine Wörter', icon: '⭐',
    words: customWords().map(w => ({ id: w.id, kind: 'vocab', cat: 'custom', de: w.de, en: w.en, ex: w.ex })),
  };
}

export function themeCategories() { return [...categories, customCategory()]; }

export function allCategories() {
  return [...categories, ...levelCategories, customCategory()];
}

export function getItem(id) {
  if (byId.has(id)) return byId.get(id);
  if (id.startsWith('c:')) return customCategory().words.find(w => w.id === id);
  return null;
}

export function getCategory(id) { return allCategories().find(c => c.id === id); }
export function getTopic(id) { return topics.find(t => t.id === id); }

export function allVocab() { return allCategories().flatMap(c => c.words); }
export function allGrammar() { return topics.flatMap(t => t.items); }
export function allItems() { return [...allVocab(), ...allGrammar()]; }

// Alle englischen Lösungen mit gleicher deutscher Bedeutung gelten als richtig
// (z. B. „Fahrrad“ → bicycle und bike). Verglichen werden die einzelnen Bedeutungen
// („Fahrrad, Rad“ → „Fahrrad“, „Rad“), aber nur innerhalb derselben Wortart.
const deParts = s => s.toLowerCase().split(/\s*[,;]\s*/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
let synonymIndex = null;
export function acceptedEnglish(item) {
  if (!synonymIndex) {
    synonymIndex = new Map();
    for (const c of [...categories, ...levelCategories]) for (const w of c.words) {
      for (const p of deParts(w.de)) {
        const k = (w.pos || '') + '|' + p;
        if (!synonymIndex.has(k)) synonymIndex.set(k, new Set());
        synonymIndex.get(k).add(w.en);
      }
    }
  }
  const set = new Set([item.en]);
  for (const p of deParts(item.de)) for (const en of synonymIndex.get((item.pos || '') + '|' + p) || []) set.add(en);
  return [...set].join(' / ');
}
