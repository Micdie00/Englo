// Sprachausgabe (Text-to-Speech) und Spracherkennung über die Web Speech API.
import { settings } from './store.js';

const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
let voices = [];

function loadVoices() {
  if (!synth) return;
  voices = synth.getVoices().filter(v => /^en[-_]/i.test(v.lang));
}
if (synth) {
  loadVoices();
  synth.addEventListener?.('voiceschanged', loadVoices);
}

export function ttsSupported() { return !!synth; }

export function englishVoices() {
  loadVoices();
  return voices;
}

function pickVoice() {
  const wanted = settings().voice;
  const list = englishVoices();
  return list.find(v => v.voiceURI === wanted)
    || list.find(v => /en-GB/i.test(v.lang) && /natural|online|google/i.test(v.name))
    || list.find(v => /en-GB/i.test(v.lang))
    || list.find(v => /en-US/i.test(v.lang))
    || list[0];
}

export function speak(text, rate) {
  if (!synth || !text) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
  u.rate = rate ?? settings().rate ?? 0.95;
  synth.speak(u);
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export function recognitionSupported() { return !!Recognition; }

// Startet die Spracherkennung, liefert ein Promise mit den erkannten Varianten.
export function listen() {
  return new Promise((resolve, reject) => {
    if (!Recognition) return reject(new Error('Spracherkennung wird von diesem Browser nicht unterstützt.'));
    const rec = new Recognition();
    const v = pickVoice();
    rec.lang = v?.lang?.startsWith('en-US') ? 'en-US' : 'en-GB';
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    let done = false;
    rec.onresult = e => {
      done = true;
      const alts = [];
      for (const r of e.results) for (const a of r) alts.push(a.transcript);
      resolve(alts);
    };
    rec.onerror = e => {
      if (done) return;
      done = true;
      const msg = {
        'not-allowed': 'Mikrofon-Zugriff wurde verweigert.',
        'no-speech': 'Ich habe nichts gehört – versuch es nochmal.',
        'network': 'Spracherkennung braucht eine Internetverbindung.',
        'audio-capture': 'Kein Mikrofon gefunden.',
      }[e.error] || 'Spracherkennung fehlgeschlagen (' + e.error + ').';
      reject(new Error(msg));
    };
    rec.onend = () => { if (!done) { done = true; reject(new Error('Ich habe nichts gehört – versuch es nochmal.')); } };
    rec.start();
  });
}
