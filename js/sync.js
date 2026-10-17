// Synchronisation über Supabase (Login mit E-Mail + Passwort, ein JSON-Datensatz pro Benutzer).
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';
import { snapshot, mergeIn, setMeta } from './store.js';

const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

let clientPromise = null;
let syncing = null;

export function syncConfigured() { return !!(SUPABASE_URL && SUPABASE_ANON_KEY); }

async function client() {
  if (!syncConfigured()) return null;
  clientPromise ||= import(SUPABASE_JS).then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'englisch-app-auth' } }));
  try { return await clientPromise; }
  catch (e) { clientPromise = null; throw new Error('Sync-Bibliothek konnte nicht geladen werden (offline?).'); }
}

export async function currentUser() {
  const c = await client().catch(() => null);
  if (!c) return null;
  const { data } = await c.auth.getSession();
  return data.session?.user || null;
}

function authError(error) {
  const m = error?.message || String(error);
  if (/invalid login credentials/i.test(m)) return 'E-Mail oder Passwort falsch.';
  if (/email not confirmed/i.test(m)) return 'Bitte bestätige zuerst deine E-Mail-Adresse (Link in der Bestätigungsmail).';
  if (/already registered/i.test(m)) return 'Diese E-Mail ist schon registriert – bitte anmelden.';
  if (/password should be/i.test(m)) return 'Das Passwort muss mindestens 6 Zeichen haben.';
  return m;
}

export async function signIn(email, password) {
  const c = await client();
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw new Error(authError(error));
  return syncNow();
}

export async function signUp(email, password) {
  const c = await client();
  const redirect = location.origin + location.pathname;
  const { data, error } = await c.auth.signUp({ email, password, options: { emailRedirectTo: redirect } });
  if (error) throw new Error(authError(error));
  if (!data.session) return 'confirm';
  await syncNow();
  return 'ok';
}

export async function signOut() {
  const c = await client();
  await c?.auth.signOut();
  setMeta('lastSync', null);
}

// Holen → zusammenführen → hochladen
export function syncNow() {
  if (syncing) return syncing;
  syncing = (async () => {
    const c = await client();
    if (!c) return 'off';
    const { data: { session } } = await c.auth.getSession();
    if (!session) return 'loggedout';
    const uid = session.user.id;
    const { data, error } = await c.from('progress').select('data').eq('user_id', uid).maybeSingle();
    if (error) throw new Error(tableError(error));
    const merged = mergeIn(data?.data || null);
    const { error: upErr } = await c.from('progress').upsert({ user_id: uid, data: merged, updated_at: new Date().toISOString() });
    if (upErr) throw new Error(tableError(upErr));
    setMeta('lastSync', Date.now());
    return 'ok';
  })().finally(() => { syncing = null; });
  return syncing;
}

// Nach "Fortschritt zurücksetzen": Server-Stand überschreiben statt zusammenführen
export async function overwriteRemote() {
  const c = await client().catch(() => null);
  if (!c) return;
  const { data: { session } } = await c.auth.getSession();
  if (!session) return;
  await c.from('progress').upsert({ user_id: session.user.id, data: snapshot(), updated_at: new Date().toISOString() });
}

function tableError(e) {
  if (/relation .* does not exist|could not find the table/i.test(e.message)) {
    return 'Tabelle "progress" fehlt – bitte supabase/schema.sql im Supabase SQL Editor ausführen.';
  }
  return e.message;
}

// Hintergrund-Sync, Fehler werden nur protokolliert
let timer = null;
export function scheduleSync(delay = 4000) {
  if (!syncConfigured()) return;
  clearTimeout(timer);
  timer = setTimeout(() => { syncNow().catch(e => console.warn('Sync:', e.message)); }, delay);
}
