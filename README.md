# Englisch lernen 🇬🇧

Lern-App für Deutschsprachige: Vokabeln, Tenses und Grammatik mit Wiederholungssystem.
Läuft als installierbare Web-App (PWA) auf PC und Android, funktioniert offline und synchronisiert über Supabase.

## Inhalt

- **371 Themen-Vokabeln** in 12 Themen (Phrasal Verbs, Business, Kollokationen, False Friends, Redewendungen …), dazu eigene Wörter
- **9.458 Wörter nach Niveau A1–C2** (Nomen, Verben, Adjektive, Adverbien) mit deutscher Übersetzung
- **20 Grammatik-Themen mit 226 Übungen**, davon 9 zu Zeitformen
- Übungsarten: Tippen, Multiple Choice, Hören & Schreiben, Sprechen (Mikrofon), Lückentext, Fehler korrigieren, Satz übersetzen
- Wiederholungssystem (Spaced Repetition): Was du schlecht kannst, kommt öfter
- Tagesziel, Serie und Statistik; Hell- und Dunkelmodus

## 1. Supabase einrichten (Sync zwischen Geräten)

1. Im [Supabase-Dashboard](https://supabase.com/dashboard) dein Projekt öffnen und unter **SQL Editor** den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) ausführen.
2. Unter **Project Settings → API** die **Project URL** und den **anon / publishable key** kopieren und in [`config.js`](config.js) eintragen.
   Der Key ist absichtlich öffentlich. Row Level Security sorgt dafür, dass jeder nur seine eigenen Daten sieht.
3. Unter **Authentication → URL Configuration** die **Site URL** auf die GitHub-Pages-Adresse setzen (z. B. `https://micdie00.github.io/Englo/`), damit der Bestätigungslink in der Registrierungs-Mail funktioniert.
   Alternativ unter **Authentication → Providers → Email** „Confirm email“ ausschalten.
4. In der App unter **Mehr → Synchronisation** registrieren bzw. anmelden. Auf dem zweiten Gerät mit denselben Daten anmelden.

## 2. Auf GitHub Pages veröffentlichen

```bash
git init
git add .
git commit -m "Englisch-App"
git branch -M main
git remote add origin https://github.com/Micdie00/Englo.git
git push -u origin main
```

Danach im Repository auf GitHub unter **Settings → Pages** „Deploy from a branch“, Branch `main` und Ordner `/ (root)` wählen. Nach 1–2 Minuten ist die App unter `https://micdie00.github.io/Englo/` erreichbar.

## 3. Installieren

- **Windows (Chrome/Edge):** Seite öffnen, dann das Installieren-Symbol in der Adressleiste anklicken oder in der App **Mehr → Als App installieren** wählen.
- **Android (Chrome):** Seite öffnen, dann **⋮ → App installieren** bzw. **Zum Startbildschirm hinzufügen** wählen.

## Updates

Nach Änderungen in [`sw.js`](sw.js) die `VERSION` erhöhen, sonst behalten installierte Apps die alte Version.
Die App zeigt dann „Neue Version verfügbar“ an.

## Lokal testen

```bash
python tools/devserver.py
```

Danach http://localhost:5173 öffnen. Lokal ist der Service Worker abgeschaltet, damit Änderungen sofort sichtbar sind.

## Inhalte erweitern

- Vokabeln: [`js/data/vocab.js`](js/data/vocab.js) im Format `[Deutsch, Englisch (Varianten mit " / "), Beispielsatz, Hinweis]`
- Grammatik: [`js/data/grammar.js`](js/data/grammar.js). Neue Übungen nur **hinten** an ein Thema anhängen, weil sich die ID aus der Position ergibt.

## Quellen der Niveau-Wortlisten

- **A1–B2:** The CEFR-J Wordlist Version 1.5, compiled by Yukio Tono, Tokyo University of Foreign Studies ([cefr-j.org](http://www.cefr-j.org/), via [openlanguageprofiles/olp-en-cefrj](https://github.com/openlanguageprofiles/olp-en-cefrj)). Frei nutzbar für Forschung und kommerzielle Zwecke bei korrekter Quellenangabe.
- **C1–C2:** Octanove Vocabulary Profile C1/C2 1.0 von Octanove Labs, Lizenz [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Die deutschen Übersetzungen wurden für diese App erstellt. Die C1/C2-Daten in [`js/data/levels.js`](js/data/levels.js) stehen samt Übersetzungen ebenfalls unter CC BY-SA 4.0.
