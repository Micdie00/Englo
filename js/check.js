// Antwortprüfung: tolerant gegenüber Groß-/Kleinschreibung, Satzzeichen,
// Kurzformen (don't = do not), Zahlen (9 = nine) und britisch/amerikanischer Schreibweise.

const NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

const SPELLING = {
  travelling: 'traveling', travelled: 'traveled', traveller: 'traveler',
  cancelled: 'canceled', cancelling: 'canceling', centre: 'center', theatre: 'theater',
  metre: 'meter', programme: 'program', grey: 'gray', practise: 'practice', licence: 'license',
  defence: 'defense', offence: 'offense', colour: 'color', favour: 'favor', neighbour: 'neighbor',
  behaviour: 'behavior', honour: 'honor', humour: 'humor', flavour: 'flavor', labour: 'labor',
  neighbours: 'neighbors', favourite: 'favorite', mum: 'mom', learnt: 'learned', burnt: 'burned',
  dreamt: 'dreamed', spelt: 'spelled', okay: 'ok', 'e-mail': 'email',
};

export function normalize(s) {
  let t = (s || '').toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”„"«»]/g, ' ')
    .replace(/\be-mail/g, 'email')
    .replace(/\bcannot\b/g, 'can not')
    .replace(/\bcan't\b/g, 'can not')
    .replace(/\bwon't\b/g, 'will not')
    .replace(/\bshan't\b/g, 'shall not')
    .replace(/\bain't\b/g, 'is not')
    .replace(/n't\b/g, ' not')
    .replace(/'re\b/g, ' are')
    .replace(/'m\b/g, ' am')
    .replace(/'ve\b/g, ' have')
    .replace(/'ll\b/g, ' will')
    .replace(/[.,!?;:()\[\]{}…–—\-\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  t = t.split(' ').map(w => {
    if (/^\d+$/.test(w) && +w < NUMBERS.length) return NUMBERS[+w];
    if (SPELLING[w]) return SPELLING[w];
    // -ise/-ize vereinheitlichen
    return w.replace(/^(\w{3,})is(e|ed|es|ing|ation)$/, '$1iz$2');
  }).join(' ');
  return t;
}

// 's und 'd sind mehrdeutig (is/has, would/had) – alle Lesarten erzeugen.
export function variants(s) {
  const out = new Set([normalize(s)]);
  for (const [re, reps] of [[/'s\b/g, [' is', ' has', 's']], [/'d\b/g, [' would', ' had']]]) {
    for (const v of [...out]) {
      if (re.test(v)) {
        re.lastIndex = 0;
        for (const r of reps) out.add(v.replace(re, r).replace(/\s+/g, ' ').trim());
      }
    }
  }
  return out;
}

export function matches(input, accepted) {
  const inV = variants(input);
  for (const a of accepted) {
    for (const v of variants(a)) if (inV.has(v)) return true;
  }
  return false;
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

// ── Vokabeln ──
// "to put sth off / to postpone" → Kandidaten ["put off", "postpone"]
function vocabForm(s) {
  return normalize(s.replace(/\([^)]*\)/g, ' '))
    .replace(/^to /, '')
    .replace(/\b(sb's|sbs|someone's|someones|one's|ones|my|your|his|her|our|their)\b/g, 'poss')
    .replace(/\b(sb|sth|someone|somebody|something|etw)\b/g, ' ')
    .replace(/\b(oneself|myself|yourself|himself|herself|ourselves|themselves)\b/g, 'self')
    .replace(/\s+/g, ' ').trim();
}

export function vocabAnswers(en) {
  return en.split(/\s\/\s/).map(s => s.trim()).filter(Boolean);
}

// Ergebnis: 'correct' | 'typo' | 'wrong'
export function checkVocab(input, en) {
  const users = [...variants(input)].map(vocabForm).filter(Boolean);
  if (!users.length) return { result: 'wrong' };
  let best = Infinity;
  for (const cand of vocabAnswers(en)) {
    for (const v of new Set([...variants(cand.replace(/\([^)]*\)/g, ' ')), ...variants(cand)])) {
      const c = vocabForm(v);
      for (const u of users) {
        if (u === c) return { result: 'correct' };
        best = Math.min(best, levenshtein(u, c));
      }
    }
  }
  const len = users[0].length;
  const tol = len >= 12 ? 2 : len >= 5 ? 1 : 0;
  if (best <= tol) return { result: 'typo' };
  return { result: 'wrong' };
}

// ── Grammatik ──
export function checkGrammar(input, accepted) {
  if (!input.trim()) return { result: 'wrong', closest: accepted[0] };
  if (matches(input, accepted)) return { result: 'correct' };
  // nächstgelegene Musterlösung für den Wortvergleich
  const u = normalize(input);
  let closest = accepted[0], best = Infinity;
  for (const a of accepted) {
    const d = levenshtein(u, normalize(a));
    if (d < best) { best = d; closest = a; }
  }
  return { result: 'wrong', closest };
}

// Wortweiser Vergleich (LCS) für die Anzeige: welche Wörter fehlen / sind falsch.
export function wordDiff(input, target) {
  const a = normalize(input).split(' ').filter(Boolean);
  const b = normalize(target).split(' ').filter(Boolean);
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) {
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const out = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { out.push({ w: a[i], k: 'same' }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ w: a[i], k: 'extra' }); i++; }
    else { out.push({ w: b[j], k: 'missing' }); j++; }
  }
  while (i < m) out.push({ w: a[i++], k: 'extra' });
  while (j < n) out.push({ w: b[j++], k: 'missing' });
  return out;
}
