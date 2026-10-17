// Baut aus den Datendateien einen Index aller lernbaren Elemente.
import { vocabCategories } from './data/vocab.js';
import { grammarGroups, grammarTopics } from './data/grammar.js';
import { customWords } from './store.js';

function slug(s) {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const categories = vocabCategories.map(cat => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
  words: cat.words.map(([de, en, ex, note]) => ({ id: `v:${cat.id}:${slug(de)}`, kind: 'vocab', cat: cat.id, de, en, ex, note })),
}));

export const groups = grammarGroups;

export const topics = grammarTopics.map(t => ({
  ...t,
  items: t.ex.map((e, i) => ({ ...e, id: `g:${t.id}:${i}`, kind: 'grammar', topic: t.id })),
}));

const byId = new Map();
for (const c of categories) for (const w of c.words) byId.set(w.id, w);
for (const t of topics) for (const it of t.items) byId.set(it.id, it);

export function customCategory() {
  return {
    id: 'custom', name: 'Meine Wörter', icon: '⭐',
    words: customWords().map(w => ({ id: w.id, kind: 'vocab', cat: 'custom', de: w.de, en: w.en, ex: w.ex })),
  };
}

export function allCategories() {
  return [...categories, customCategory()];
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
