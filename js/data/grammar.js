// Grammatik-Themen mit Erklärung (HTML) und Übungen.
// Übungstypen:
//   gap – Lücke füllen (___), a = akzeptierte Antworten
//   mc  – Multiple Choice, o = Optionen, c = Index der richtigen
//   fix – fehlerhaften Satz korrigiert eintippen, a = akzeptierte Sätze
//   tr  – Deutsch → Englisch übersetzen, a = akzeptierte Sätze
// Akzeptierte Antworten in Langform schreiben (I have, do not …) – Kurzformen werden automatisch erkannt.
// Übungen nur hinten anhängen: die ID ergibt sich aus der Position.

export const grammarGroups = [
  { id: 'tenses', name: 'Zeitformen (Tenses)' },
  { id: 'structures', name: 'Satzstrukturen' },
  { id: 'pitfalls', name: 'Typische Stolpersteine' },
];

export const grammarTopics = [
  // ───────────────────────── TENSES ─────────────────────────
  {
    id: 'pres-simple-cont', group: 'tenses', title: 'Present Simple vs. Present Continuous', level: 'B1',
    explain: `
<p>Im Deutschen gibt es keine Verlaufsform – im Englischen musst du dich <b>immer</b> entscheiden.</p>
<table>
<tr><th>Present Simple</th><th>Present Continuous</th></tr>
<tr><td>Gewohnheiten, Routinen<br><i>I <b>drink</b> coffee every morning.</i></td><td>Passiert gerade jetzt<br><i>I'<b>m drinking</b> coffee right now.</i></td></tr>
<tr><td>Fakten, allgemeine Wahrheiten<br><i>Water <b>boils</b> at 100°C.</i></td><td>Vorübergehend<br><i>I'<b>m living</b> with my parents this month.</i></td></tr>
<tr><td>Fahrpläne<br><i>The train <b>leaves</b> at 8.</i></td><td>Feste Pläne für die Zukunft<br><i>I'<b>m meeting</b> Tom tonight.</i></td></tr>
<tr><td></td><td>Ärgerliche Gewohnheit + <i>always</i><br><i>He'<b>s always interrupting</b> me!</i></td></tr>
</table>
<p><b>Signalwörter:</b> always, usually, often, every day, never ↔ now, right now, at the moment, currently, this week, Look!, Listen!</p>
<h4>Zustandsverben (stative verbs)</h4>
<p>Diese Verben stehen normalerweise <b>nicht</b> in der -ing-Form: <i>know, understand, believe, like, love, hate, want, need, prefer, mean, seem, belong, own, remember</i>.</p>
<p>✗ <i>I am knowing him.</i> → ✓ <i>I <b>know</b> him.</i></p>
<p>Achtung bei Bedeutungsunterschied: <i>I <b>think</b> you're right</i> (= meinen) vs. <i>I'<b>m thinking</b> about it</i> (= nachdenken); <i>I <b>have</b> a car</i> (besitzen) vs. <i>I'<b>m having</b> lunch</i> (essen).</p>`,
    ex: [
      { t: 'gap', q: "Listen! Somebody ___ (knock) at the door.", a: ["is knocking"], ex: "„Listen!“ → passiert gerade jetzt." },
      { t: 'gap', q: "Water ___ (boil) at 100 degrees Celsius.", a: ["boils"], ex: "Naturgesetz/Fakt → Present Simple." },
      { t: 'gap', q: "I ___ (not/understand) what you mean.", a: ["do not understand"], ex: "understand ist ein Zustandsverb → keine -ing-Form." },
      { t: 'gap', q: "She ___ (work) from home this week because her office is being renovated.", a: ["is working"], ex: "Vorübergehende Situation (this week)." },
      { t: 'mc', q: "What ___ tonight? – I'm meeting Anna.", o: ["do you do", "are you doing", "will you doing"], c: 1, ex: "Feste Pläne → Present Continuous." },
      { t: 'mc', q: "I ___ you're right.", o: ["think", "am thinking"], c: 0, ex: "think = meinen/glauben → Zustand." },
      { t: 'mc', q: "Be quiet, please. I ___ about the problem.", o: ["think", "am thinking"], c: 1, ex: "think = nachdenken → Handlung, die gerade läuft." },
      { t: 'fix', q: "She is owning a big house in the country.", a: ["She owns a big house in the country."], ex: "own (besitzen) ist ein Zustandsverb." },
      { t: 'fix', q: "Look, it rains!", a: ["Look, it is raining!"], ex: "„Look!“ → gerade jetzt → Present Continuous." },
      { t: 'gap', q: "My brother ___ (always/leave) his dirty socks on the floor! It's so annoying.", a: ["is always leaving"], ex: "Ärgerliche Gewohnheit: always + Present Continuous." },
      { t: 'tr', q: "Ich wohne normalerweise in Wien, aber im Moment wohne ich bei meinen Eltern.", a: ["I usually live in Vienna, but at the moment I am living with my parents.", "I normally live in Vienna, but at the moment I am living with my parents.", "I usually live in Vienna, but I am living with my parents at the moment.", "I normally live in Vienna, but I am living with my parents at the moment.", "I usually live in Vienna, but I am currently living with my parents.", "I usually live in Vienna but at the moment I am staying with my parents.", "I usually live in Vienna, but at the moment I am staying with my parents."], ex: "Normalerweise → Simple; im Moment (vorübergehend) → Continuous." },
      { t: 'mc', q: "How often ___ to the gym?", o: ["do you go", "are you going", "you go"], c: 0, ex: "How often → Gewohnheit → Present Simple." },
    ]
  },
  {
    id: 'past-vs-perfect', group: 'tenses', title: 'Past Simple vs. Present Perfect', level: 'B1',
    explain: `
<p><b>Die größte Falle für Deutschsprachige!</b> Das deutsche Perfekt („Ich habe gestern gearbeitet“) entspricht meistens dem englischen <b>Past Simple</b>.</p>
<table>
<tr><th>Past Simple</th><th>Present Perfect (have + 3. Form)</th></tr>
<tr><td>Abgeschlossen, <b>konkreter Zeitpunkt</b> in der Vergangenheit<br><i>I <b>saw</b> him yesterday.</i></td><td>Zeitpunkt unbekannt/unwichtig, Bezug zur Gegenwart<br><i>I'<b>ve seen</b> that film.</i></td></tr>
<tr><td>yesterday, last week, in 2019, two years ago, when …?</td><td>ever, never, already, yet, just, so far, recently</td></tr>
<tr><td>Abgeschlossener Zeitraum<br><i>I <b>worked</b> there for 5 years</i> (jetzt nicht mehr).</td><td>Bis jetzt andauernd (since/for)<br><i>I'<b>ve worked</b> here for 5 years</i> (immer noch).</td></tr>
<tr><td></td><td>Ergebnis ist jetzt sichtbar<br><i>I'<b>ve lost</b> my keys.</i> (Ich habe sie jetzt nicht.)</td></tr>
<tr><td></td><td>Noch nicht abgeschlossener Zeitraum<br><i>I'<b>ve had</b> three coffees today.</i></td></tr>
</table>
<p><b>Faustregel:</b> Sobald ein konkreter vergangener Zeitpunkt im Satz steht (yesterday, ago, last …, in 2010) oder mit <i>When …?</i> gefragt wird → <b>Past Simple</b>.</p>
<p>✗ <i>I have bought a new car last month.</i> → ✓ <i>I <b>bought</b> a new car last month.</i></p>`,
    ex: [
      { t: 'gap', q: "I ___ (see) that film last weekend.", a: ["saw"], ex: "„last weekend“ = konkreter Zeitpunkt → Past Simple." },
      { t: 'gap', q: "I ___ (never/be) to Japan.", a: ["have never been"], ex: "Lebenserfahrung ohne Zeitpunkt → Present Perfect." },
      { t: 'gap', q: "We ___ (live) here since 2015.", a: ["have lived", "have been living"], ex: "since + bis jetzt → Present Perfect." },
      { t: 'mc', q: "When ___ you ___ your new job?", o: ["did … start", "have … started"], c: 0, ex: "Fragen mit When → Past Simple." },
      { t: 'gap', q: "Oh no! I ___ (lose) my keys. I can't get into the house.", a: ["have lost"], ex: "Ergebnis jetzt relevant → Present Perfect." },
      { t: 'gap', q: "She ___ (move) to London three years ago.", a: ["moved"], ex: "„ago“ → immer Past Simple." },
      { t: 'mc', q: "___ you ever ___ sushi?", o: ["Did … eat", "Have … eaten", "Have … ate"], c: 1, ex: "ever → Erfahrung → Present Perfect (have + eaten)." },
      { t: 'fix', q: "I have bought a new car last month.", a: ["I bought a new car last month."], ex: "„last month“ → Past Simple." },
      { t: 'fix', q: "He works here since 2020.", a: ["He has worked here since 2020.", "He has been working here since 2020."], ex: "Deutsch „seit“ + Präsens → Englisch Present Perfect." },
      { t: 'tr', q: "Ich habe gestern mit meinem Chef gesprochen.", a: ["I spoke to my boss yesterday.", "I talked to my boss yesterday.", "I spoke with my boss yesterday.", "I talked with my boss yesterday.", "Yesterday I spoke to my boss.", "Yesterday I talked to my boss.", "Yesterday I spoke with my boss.", "Yesterday I talked with my boss."], ex: "Deutsches Perfekt + gestern → Past Simple." },
      { t: 'tr', q: "Hast du schon gegessen?", a: ["Have you eaten yet?", "Have you already eaten?", "Have you eaten already?"], ex: "schon/yet → Present Perfect. In Fragen meist „yet“ am Ende." },
      { t: 'mc', q: "It's only 10 am and I ___ three cups of coffee today.", o: ["had", "have had"], c: 1, ex: "„today“ ist noch nicht vorbei → Present Perfect." },
      { t: 'gap', q: "Shakespeare ___ (write) many famous plays.", a: ["wrote"], ex: "Abgeschlossen (er lebt nicht mehr) → Past Simple." },
    ]
  },
  {
    id: 'perfect-simple-cont', group: 'tenses', title: 'Present Perfect Simple vs. Continuous (since/for)', level: 'B2',
    explain: `
<p>Deutsch „seit“ + Präsens wird im Englischen fast immer zum <b>Present Perfect</b>:</p>
<p>„Ich lerne <b>seit</b> 10 Jahren Englisch.“ → <i>I'<b>ve been learning</b> English <b>for</b> ten years.</i> (✗ <i>I learn English since 10 years.</i>)</p>
<table>
<tr><th>Present Perfect Simple</th><th>Present Perfect Continuous (have been + -ing)</th></tr>
<tr><td>Ergebnis, Menge – <b>How many/much?</b><br><i>I'<b>ve written</b> five emails.</i></td><td>Dauer, Aktivität – <b>How long?</b><br><i>I'<b>ve been writing</b> emails all morning.</i></td></tr>
<tr><td>Zustandsverben<br><i>I'<b>ve known</b> her for years.</i></td><td>Sichtbare Folgen einer Aktivität<br><i>You're out of breath. <b>Have</b> you <b>been running</b>?</i></td></tr>
</table>
<h4>since oder for?</h4>
<ul><li><b>since</b> + Zeitpunkt: since 2018, since Monday, since I was a child</li>
<li><b>for</b> + Zeitraum: for two hours, for ten years, for ages</li>
<li><b>ago</b> = vor (mit Past Simple): two years ago</li></ul>`,
    ex: [
      { t: 'gap', q: "I ___ (learn) English for ten years.", a: ["have been learning", "have learned", "have learnt"], ex: "seit + bis jetzt → Present Perfect (Continuous betont die Dauer)." },
      { t: 'mc', q: "I've lived here ___ 2018.", o: ["since", "for", "ago"], c: 0, ex: "Zeitpunkt → since." },
      { t: 'mc', q: "She's been waiting ___ two hours.", o: ["since", "for", "during"], c: 1, ex: "Zeitraum → for." },
      { t: 'gap', q: "I ___ (write) five emails this morning.", a: ["have written"], ex: "Menge/Ergebnis → Simple." },
      { t: 'mc', q: "Your eyes are red. ___?", o: ["Have you cried", "Have you been crying", "Did you cry"], c: 1, ex: "Sichtbare Folge einer Aktivität → Continuous." },
      { t: 'gap', q: "They ___ (know) each other since school.", a: ["have known"], ex: "know = Zustandsverb → kein Continuous." },
      { t: 'fix', q: "I am waiting here since 9 o'clock.", a: ["I have been waiting here since 9 o'clock.", "I have been waiting here since nine o'clock.", "I have been waiting here since 9."], ex: "seit + Präsens (Deutsch) → have been + -ing." },
      { t: 'tr', q: "Wie lange wohnst du schon hier?", a: ["How long have you lived here?", "How long have you been living here?", "How long have you lived here for?", "How long have you been living here for?"], ex: "How long …? → Present Perfect (Continuous)." },
      { t: 'gap', q: "We ___ (paint) the living room all day, and we still haven't finished.", a: ["have been painting"], ex: "Dauer einer Aktivität, noch nicht fertig → Continuous." },
      { t: 'mc', q: "I've ___ this book twice.", o: ["read", "been reading"], c: 0, ex: "twice = Anzahl → Simple." },
      { t: 'tr', q: "Ich kenne sie seit drei Jahren.", a: ["I have known her for three years.", "I have known her for 3 years."], ex: "Zustandsverb know + for." },
    ]
  },
  {
    id: 'past-simple-cont', group: 'tenses', title: 'Past Simple vs. Past Continuous', level: 'B1',
    explain: `
<table>
<tr><th>Past Continuous (was/were + -ing)</th><th>Past Simple</th></tr>
<tr><td>Handlung war gerade im Gange (Hintergrund)<br><i>I <b>was having</b> a shower …</i></td><td>… als etwas Neues passierte (Unterbrechung)<br><i>… when the phone <b>rang</b>.</i></td></tr>
<tr><td>Zu einem bestimmten Zeitpunkt im Verlauf<br><i>At 8 pm I <b>was cooking</b>.</i></td><td>Aufeinanderfolgende Handlungen<br><i>She <b>opened</b> the door, <b>turned</b> on the light and <b>sat</b> down.</i></td></tr>
<tr><td>Szenenbeschreibung<br><i>The sun <b>was shining</b> and birds <b>were singing</b>.</i></td><td></td></tr>
</table>
<p><b>while</b> + Continuous (lange Handlung), <b>when</b> + Simple (kurze Handlung):<br><i>While we <b>were walking</b>, it <b>started</b> to rain.</i></p>
<p>Zustandsverben auch hier nicht in der -ing-Form: ✗ <i>I was knowing</i> → ✓ <i>I knew</i>.</p>`,
    ex: [
      { t: 'gap', q: "I ___ (have) a shower when the phone rang.", a: ["was having"], ex: "Laufende Handlung, die unterbrochen wird." },
      { t: 'gap', q: "While we ___ (walk) in the park, it started to rain.", a: ["were walking"], ex: "while + Continuous." },
      { t: 'gap', q: "He ___ (fall) asleep while he was watching TV.", a: ["fell"], ex: "Kurze, neue Handlung → Simple." },
      { t: 'mc', q: "What ___ at 10 o'clock last night?", o: ["did you do", "were you doing"], c: 1, ex: "Zu einem Zeitpunkt im Verlauf → Continuous." },
      { t: 'fix', q: "I was knowing the answer.", a: ["I knew the answer."], ex: "know = Zustandsverb." },
      { t: 'tr', q: "Als du angerufen hast, habe ich gerade gekocht.", a: ["When you called, I was cooking.", "I was cooking when you called.", "When you rang, I was cooking.", "I was cooking when you rang.", "When you phoned, I was cooking.", "I was cooking when you phoned."], ex: "gerade gekocht → Continuous; angerufen → Simple." },
      { t: 'gap', q: "She opened the door, ___ (turn) on the light and sat down.", a: ["turned"], ex: "Aufeinanderfolgende Handlungen → Simple." },
      { t: 'mc', q: "It was a beautiful morning. The sun ___ and the birds were singing.", o: ["shone", "was shining"], c: 1, ex: "Hintergrundbeschreibung → Continuous." },
      { t: 'gap', q: "I ___ (not/listen) when the teacher explained it, so I didn't understand.", a: ["was not listening"], ex: "Laufende (Nicht-)Handlung im Hintergrund." },
      { t: 'mc', q: "When I arrived at the party, Tom ___ immediately. He didn't want to see me.", o: ["left", "was leaving"], c: 0, ex: "Reaktion auf meine Ankunft → Simple (erst ich, dann er)." },
    ]
  },
  {
    id: 'past-perfect', group: 'tenses', title: 'Past Perfect (Simple & Continuous)', level: 'B2',
    explain: `
<p>Das <b>Past Perfect</b> (had + 3. Form) ist die „Vorvergangenheit“: etwas passierte <b>vor</b> einem anderen Zeitpunkt in der Vergangenheit.</p>
<p><i>When we got to the station, the train <b>had</b> already <b>left</b>.</i> (Zuerst fuhr der Zug, dann kamen wir.)</p>
<p>Vergleiche: <i>When we got there, the train <b>left</b>.</i> = Wir kamen an, <b>dann</b> fuhr er ab.</p>
<h4>Past Perfect Continuous (had been + -ing)</h4>
<p>Dauer bis zu einem Zeitpunkt in der Vergangenheit: <i>She was tired because she <b>had been working</b> all day.</i></p>
<p><b>Signalwörter:</b> already, by the time, before, after, never … before, the first time</p>
<p>Wenn die Reihenfolge durch <i>before/after</i> klar ist, ist auch Past Simple oft okay: <i>After she <b>ate</b>, she went out.</i></p>`,
    ex: [
      { t: 'gap', q: "When we got to the station, the train ___ (already/leave).", a: ["had already left"], ex: "Zug fuhr vorher ab → Past Perfect." },
      { t: 'gap', q: "She was tired because she ___ (work) all day.", a: ["had been working", "had worked"], ex: "Dauer bis zu einem vergangenen Zeitpunkt → Past Perfect Continuous." },
      { t: 'mc', q: "By the time I arrived, everyone ___ home.", o: ["went", "had gone", "has gone"], c: 1, ex: "by the time → Past Perfect." },
      { t: 'gap', q: "I didn't recognise him because I ___ (never/meet) him before.", a: ["had never met"], ex: "never … before (bis zu dem Zeitpunkt) → Past Perfect." },
      { t: 'fix', q: "I was hungry because I didn't eat anything since breakfast.", a: ["I was hungry because I had not eaten anything since breakfast."], ex: "since + Vergangenheit-Bezug → Past Perfect." },
      { t: 'tr', q: "Nachdem sie gegessen hatte, ging sie spazieren.", a: ["After she had eaten, she went for a walk.", "After she had eaten she went for a walk.", "After eating, she went for a walk.", "After she ate, she went for a walk.", "She went for a walk after she had eaten."], ex: "„gegessen hatte“ → had eaten." },
      { t: 'gap', q: "They ___ (wait) for over an hour when the bus finally came.", a: ["had been waiting"], ex: "Dauer vor einem vergangenen Ereignis." },
      { t: 'mc', q: "When I got to work, I realised I ___ my wallet at home.", o: ["left", "had left", "have left"], c: 1, ex: "Das Liegenlassen passierte vor dem Bemerken." },
      { t: 'gap', q: "It was the first time I ___ (fly) in a helicopter.", a: ["had flown", "had ever flown"], ex: "It was the first time + Past Perfect." },
      { t: 'tr', q: "Er hatte das Buch schon gelesen.", a: ["He had already read the book.", "He had read the book already."], ex: "had + already + 3. Form." },
    ]
  },
  {
    id: 'future', group: 'tenses', title: 'Zukunft: will, going to & Co.', level: 'B1',
    explain: `
<p>Im Deutschen reicht oft das Präsens („Ich rufe dich morgen an“). Im Englischen brauchst du eine Zukunftsform – welche, hängt von der Situation ab:</p>
<table>
<tr><th>Form</th><th>Wann?</th><th>Beispiel</th></tr>
<tr><td><b>will</b></td><td>Spontane Entscheidung, Angebot, Versprechen, Vermutung (I think …)</td><td><i>The phone's ringing – I'<b>ll get</b> it!</i></td></tr>
<tr><td><b>going to</b></td><td>Absicht/Plan (schon entschieden); Vorhersage mit sichtbaren Anzeichen</td><td><i>I'<b>m going to look</b> for a new job.<br>Look at the clouds – it'<b>s going to rain</b>.</i></td></tr>
<tr><td><b>Present Continuous</b></td><td>Feste Verabredung (Zeit/Ort stehen)</td><td><i>I'<b>m meeting</b> Sarah at 6.</i></td></tr>
<tr><td><b>Present Simple</b></td><td>Fahrpläne, Programme</td><td><i>The film <b>starts</b> at 8.</i></td></tr>
</table>
<h4>⚠️ Kein will nach when, if, as soon as, before, after, until</h4>
<p>✗ <i>I'll call you when I will get home.</i> → ✓ <i>I'll call you when I <b>get</b> home.</i></p>`,
    ex: [
      { t: 'mc', q: "The phone is ringing. – I ___ get it!", o: ["'ll", "am going to", "get"], c: 0, ex: "Spontane Entscheidung → will." },
      { t: 'mc', q: "Look at those black clouds. It ___ rain.", o: ["will", "is going to"], c: 1, ex: "Vorhersage mit sichtbarem Anzeichen → going to." },
      { t: 'gap', q: "I ___ (meet) Sarah for lunch tomorrow – we've booked a table.", a: ["am meeting", "am going to meet"], ex: "Feste Verabredung → Present Continuous." },
      { t: 'gap', q: "The film ___ (start) at 8:15 tonight.", a: ["starts"], ex: "Programm/Fahrplan → Present Simple." },
      { t: 'fix', q: "I will call you when I will get home.", a: ["I will call you when I get home."], ex: "Nach when kein will." },
      { t: 'tr', q: "Ich helfe dir morgen. (Angebot)", a: ["I will help you tomorrow.", "Tomorrow I will help you."], ex: "Angebot/Versprechen → will." },
      { t: 'gap', q: "As soon as she ___ (arrive), we'll start dinner.", a: ["arrives"], ex: "as soon as + Present Simple." },
      { t: 'mc', q: "I've made up my mind: I ___ for a new job.", o: ["will look", "am going to look", "look"], c: 1, ex: "Bereits gefasste Absicht → going to." },
      { t: 'mc', q: "I think Brazil ___ the next World Cup.", o: ["will win", "is winning", "wins"], c: 0, ex: "Vermutung (I think) → will." },
      { t: 'tr', q: "Was machst du am Wochenende? (Pläne)", a: ["What are you doing at the weekend?", "What are you doing on the weekend?", "What are you doing this weekend?", "What are you going to do at the weekend?", "What are you going to do on the weekend?", "What are you going to do this weekend?"], ex: "Frage nach Plänen → Present Continuous oder going to." },
      { t: 'gap', q: "If it ___ (rain) tomorrow, we'll stay at home.", a: ["rains"], ex: "Nach if kein will." },
    ]
  },
  {
    id: 'future-cont-perfect', group: 'tenses', title: 'Future Continuous & Future Perfect', level: 'B2',
    explain: `
<table>
<tr><th>Future Continuous (will be + -ing)</th><th>Future Perfect (will have + 3. Form)</th></tr>
<tr><td>Handlung ist zu einem Zeitpunkt in der Zukunft <b>im Gange</b><br><i>This time tomorrow I'<b>ll be lying</b> on the beach.</i></td><td>Handlung ist bis zu einem Zeitpunkt in der Zukunft <b>abgeschlossen</b><br><i>By 2030 I'<b>ll have paid off</b> the loan.</i></td></tr>
<tr><td>Höfliche Frage nach Plänen<br><i><b>Will</b> you <b>be using</b> the car tonight?</i></td><td>Signalwort: <b>by</b> (bis spätestens), by the time, by then</td></tr>
</table>
<p>Deutsch: „Bis morgen <b>habe</b> ich es <b>geschrieben</b>“ → <i>By tomorrow I <b>will have written</b> it.</i></p>`,
    ex: [
      { t: 'gap', q: "This time next week, I ___ (lie) on a beach in Greece.", a: ["will be lying"], ex: "Zu einem Zeitpunkt in der Zukunft im Gange." },
      { t: 'gap', q: "By the end of the year, we ___ (finish) the project.", a: ["will have finished"], ex: "by … → Future Perfect." },
      { t: 'mc', q: "Don't call me at 8 – I ___ dinner then.", o: ["will have", "will be having", "will have had"], c: 1, ex: "Um 8 im Gange → Future Continuous." },
      { t: 'mc', q: "By the time you get here, I ___ everything.", o: ["will be cleaning", "will have cleaned", "clean"], c: 1, ex: "Bis dahin abgeschlossen → Future Perfect." },
      { t: 'mc', q: "___ the car this evening? I'd like to borrow it.", o: ["Will you be using", "Will you have used", "Are you use"], c: 0, ex: "Höfliche Frage nach Plänen → Future Continuous." },
      { t: 'tr', q: "Bis morgen habe ich den Bericht geschrieben.", a: ["By tomorrow I will have written the report.", "I will have written the report by tomorrow.", "By tomorrow I will have finished the report.", "I will have finished the report by tomorrow."], ex: "Bis + Zukunft → will have + 3. Form." },
      { t: 'gap', q: "In 2030, they ___ (be) married for 25 years.", a: ["will have been"], ex: "Dauer bis zu einem Zukunftszeitpunkt." },
      { t: 'gap', q: "Tomorrow at 10 am, I ___ (sit) in an exam.", a: ["will be sitting"], ex: "Im Gange zu einem Zeitpunkt." },
      { t: 'fix', q: "By next month I will finish my course.", a: ["By next month I will have finished my course.", "I will have finished my course by next month."], ex: "by next month → Future Perfect." },
      { t: 'mc', q: "Don't phone after midnight – we ___.", o: ["will sleep", "will be sleeping", "will have slept"], c: 1, ex: "Zu dem Zeitpunkt im Gange." },
    ]
  },
  {
    id: 'used-to', group: 'tenses', title: 'used to / would / be used to / get used to', level: 'B2',
    explain: `
<table>
<tr><th>Form</th><th>Bedeutung</th><th>Beispiel</th></tr>
<tr><td><b>used to</b> + Infinitiv</td><td>früher (heute nicht mehr)</td><td><i>I <b>used to smoke</b>.</i></td></tr>
<tr><td><b>would</b> + Infinitiv</td><td>früher, wiederholte <b>Handlungen</b> (nicht für Zustände!)</td><td><i>Every summer we <b>would go</b> to Italy.</i></td></tr>
<tr><td><b>be used to</b> + -ing / Nomen</td><td>an etw. gewöhnt sein</td><td><i>I'<b>m used to getting</b> up early.</i></td></tr>
<tr><td><b>get used to</b> + -ing / Nomen</td><td>sich an etw. gewöhnen</td><td><i>I'm <b>getting used to</b> the cold.</i></td></tr>
</table>
<p>Verneinung und Frage: <i>I <b>didn't use to</b> like it. / <b>Did</b> you <b>use to</b> live here?</i> (ohne -d!)</p>
<p>Zustände: ✗ <i>We would have a dog.</i> → ✓ <i>We <b>used to have</b> a dog.</i></p>`,
    ex: [
      { t: 'gap', q: "I ___ (play) football when I was a kid, but now I don't.", a: ["used to play"], ex: "Früher, heute nicht mehr." },
      { t: 'gap', q: "I'm used to ___ (work) late.", a: ["working"], ex: "be used to + -ing." },
      { t: 'mc', q: "It took me a long time to get used to ___ on the left.", o: ["drive", "driving", "drove"], c: 1, ex: "get used to + -ing." },
      { t: 'mc', q: "When I was a child, we ___ a dog.", o: ["would have", "used to have"], c: 1, ex: "Zustand (besitzen) → nur used to." },
      { t: 'fix', q: "I am used to get up early.", a: ["I am used to getting up early."], ex: "be used to + -ing." },
      { t: 'tr', q: "Früher habe ich in Graz gewohnt.", a: ["I used to live in Graz."], ex: "Früher (heute nicht mehr) → used to." },
      { t: 'mc', q: "___ use to wear glasses?", o: ["Did you", "Were you", "Do you"], c: 0, ex: "Frage: Did … use to." },
      { t: 'gap', q: "She didn't ___ like coffee, but now she loves it.", a: ["use to"], ex: "Nach didn't: use to (ohne -d)." },
      { t: 'tr', q: "Ich gewöhne mich langsam an das kalte Wetter.", a: ["I am slowly getting used to the cold weather.", "I am getting used to the cold weather slowly.", "I am slowly getting used to the cold.", "Slowly I am getting used to the cold weather."], ex: "sich gewöhnen → get used to." },
      { t: 'mc', q: "Every summer my grandmother ___ make strawberry jam.", o: ["would", "was used to", "is used to"], c: 0, ex: "Wiederholte Handlung in der Vergangenheit → would (oder used to)." },
    ]
  },
  {
    id: 'tense-mix', group: 'tenses', title: 'Zeitformen gemischt', level: 'B2',
    explain: `
<p>Hier kommt alles durcheinander – so wie im echten Leben. Frag dich bei jedem Satz:</p>
<ol>
<li><b>Wann?</b> Vergangenheit, Gegenwart, Zukunft – oder eine Verbindung (Vergangenheit → jetzt)?</li>
<li><b>Gibt es einen konkreten Zeitpunkt?</b> (yesterday, ago → Past Simple)</li>
<li><b>Abgeschlossen oder im Verlauf?</b> (Simple vs. Continuous)</li>
<li><b>Signalwörter?</b> since/for, already/yet, by the time, while, when, if …</li>
</ol>
<table>
<tr><th>Zeitform</th><th>Bildung</th></tr>
<tr><td>Present Simple / Continuous</td><td>work(s) / am-is-are working</td></tr>
<tr><td>Past Simple / Continuous</td><td>worked / was-were working</td></tr>
<tr><td>Present Perfect / Continuous</td><td>have-has worked / have-has been working</td></tr>
<tr><td>Past Perfect / Continuous</td><td>had worked / had been working</td></tr>
<tr><td>Future (will / going to)</td><td>will work / am-is-are going to work</td></tr>
<tr><td>Future Continuous / Perfect</td><td>will be working / will have worked</td></tr>
</table>`,
    ex: [
      { t: 'gap', q: "I ___ (work) here for five years, and I still love it.", a: ["have worked", "have been working"], ex: "for + bis jetzt → Present Perfect." },
      { t: 'gap', q: "Yesterday I ___ (meet) an old friend in town.", a: ["met"], ex: "yesterday → Past Simple." },
      { t: 'gap', q: "Shh! The baby ___ (sleep).", a: ["is sleeping"], ex: "Gerade jetzt → Present Continuous." },
      { t: 'gap', q: "By the time the police arrived, the thief ___ (escape).", a: ["had escaped", "had already escaped"], ex: "by the time + Vergangenheit → Past Perfect." },
      { t: 'gap', q: "I promise I ___ (not/tell) anyone.", a: ["will not tell"], ex: "Versprechen → will." },
      { t: 'gap', q: "What ___ (you/do) when the lights went out?", a: ["were you doing"], ex: "Laufende Handlung, unterbrochen → Past Continuous." },
      { t: 'gap', q: "She ___ (go) to the gym three times a week.", a: ["goes"], ex: "Gewohnheit → Present Simple." },
      { t: 'gap', q: "I ___ (just/finish) my homework.", a: ["have just finished"], ex: "just → Present Perfect." },
      { t: 'gap', q: "We ___ (fly) to Rome next Friday. The tickets are booked.", a: ["are flying", "are going to fly"], ex: "Feste Pläne → Present Continuous." },
      { t: 'gap', q: "How long ___ (you/wait)? – About twenty minutes.", a: ["have you been waiting", "have you waited"], ex: "How long bis jetzt → Present Perfect Continuous." },
      { t: 'gap', q: "He ___ (live) in Berlin for ten years before he moved to Vienna.", a: ["had lived", "had been living", "lived"], ex: "Vor einem anderen vergangenen Ereignis → Past Perfect." },
      { t: 'tr', q: "Ich arbeite seit Januar in dieser Firma.", a: ["I have worked at this company since January.", "I have been working at this company since January.", "I have worked for this company since January.", "I have been working for this company since January.", "I have worked in this company since January.", "I have been working in this company since January.", "I have worked at this firm since January.", "I have been working at this firm since January.", "I have worked for this firm since January.", "I have been working for this firm since January."], ex: "seit + Präsens → Present Perfect." },
      { t: 'gap', q: "This time tomorrow we ___ (drive) to the airport.", a: ["will be driving"], ex: "Im Gange zu einem Zukunftszeitpunkt." },
      { t: 'gap', q: "When I was young, I ___ (not/like) vegetables.", a: ["did not like", "did not use to like"], ex: "like = Zustand → Past Simple." },
    ]
  },

  // ───────────────────────── STRUCTURES ─────────────────────────
  {
    id: 'conditionals', group: 'structures', title: 'If-Sätze (Conditionals)', level: 'B2',
    explain: `
<table>
<tr><th>Typ</th><th>if-Satz</th><th>Hauptsatz</th><th>Verwendung</th></tr>
<tr><td>0</td><td>Present</td><td>Present</td><td>Fakten: <i>If you <b>heat</b> ice, it <b>melts</b>.</i></td></tr>
<tr><td>1</td><td>Present</td><td>will</td><td>realistisch: <i>If it <b>rains</b>, I'<b>ll stay</b> home.</i></td></tr>
<tr><td>2</td><td>Past</td><td>would</td><td>hypothetisch/unwahrscheinlich: <i>If I <b>had</b> more time, I <b>would learn</b> Spanish.</i></td></tr>
<tr><td>3</td><td>Past Perfect</td><td>would have + 3. Form</td><td>Vergangenheit, nicht passiert: <i>If I <b>had known</b>, I <b>would have come</b>.</i></td></tr>
<tr><td>Mixed</td><td>Past Perfect</td><td>would</td><td>Vergangenheit → Folge jetzt: <i>If I <b>had taken</b> the job, I <b>would live</b> in NY now.</i></td></tr>
</table>
<h4>⚠️ Die wichtigste Regel: kein „would“ im if-Satz!</h4>
<p>Deutsch: „Wenn ich es wüsste / wissen <b>würde</b>“ → ✗ <i>If I would know</i> → ✓ <i>If I <b>knew</b></i></p>
<p><i>If I <b>were</b> you, …</i> (were ist korrekter, was ist umgangssprachlich okay)</p>
<p><b>unless</b> = if … not · <b>provided (that) / as long as</b> = vorausgesetzt · <b>even if</b> = selbst wenn</p>`,
    ex: [
      { t: 'gap', q: "If you heat ice, it ___ (melt).", a: ["melts"], ex: "Type 0: Fakt." },
      { t: 'gap', q: "If it ___ (rain) tomorrow, we'll cancel the picnic.", a: ["rains"], ex: "Type 1: if + Present." },
      { t: 'gap', q: "If I ___ (have) more time, I would learn Spanish.", a: ["had"], ex: "Type 2: if + Past." },
      { t: 'gap', q: "If I ___ (be) you, I'd apologise.", a: ["were", "was"], ex: "If I were you … (Ratschlag)." },
      { t: 'gap', q: "If we had left earlier, we ___ (not/miss) the train.", a: ["would not have missed"], ex: "Type 3: would have + 3. Form." },
      { t: 'fix', q: "If I would know the answer, I would tell you.", a: ["If I knew the answer, I would tell you."], ex: "Kein would im if-Satz." },
      { t: 'mc', q: "If she ___ harder, she would have passed the exam.", o: ["studied", "had studied", "would study"], c: 1, ex: "Type 3: if + Past Perfect." },
      { t: 'tr', q: "Wenn ich reich wäre, würde ich um die Welt reisen.", a: ["If I were rich, I would travel around the world.", "If I was rich, I would travel around the world.", "If I were rich, I would travel the world.", "If I was rich, I would travel the world.", "I would travel around the world if I were rich.", "I would travel the world if I were rich.", "I would travel around the world if I was rich.", "I would travel the world if I was rich."], ex: "Type 2." },
      { t: 'tr', q: "Wenn ich das gewusst hätte, wäre ich gekommen.", a: ["If I had known that, I would have come.", "If I had known, I would have come.", "Had I known that, I would have come.", "Had I known, I would have come.", "I would have come if I had known that.", "I would have come if I had known."], ex: "Type 3." },
      { t: 'mc', q: "If I had taken that job, I ___ in New York now.", o: ["will live", "would live", "would have lived"], c: 1, ex: "Mixed: Vergangenheit → Folge jetzt (now)." },
      { t: 'gap', q: "Unless you ___ (hurry), you'll be late.", a: ["hurry"], ex: "unless = if not, + Present." },
      { t: 'mc', q: "I'll lend you the money ___ you pay me back next week.", o: ["provided that", "unless", "even if"], c: 0, ex: "provided that = vorausgesetzt, dass." },
    ]
  },
  {
    id: 'wishes', group: 'structures', title: 'I wish / If only / should have', level: 'B2',
    explain: `
<table>
<tr><th>Struktur</th><th>Bedeutung</th><th>Beispiel</th></tr>
<tr><td>wish + <b>Past</b></td><td>Wunsch für die Gegenwart</td><td><i>I wish I <b>had</b> more time.</i> (Ich wünschte, ich hätte …)</td></tr>
<tr><td>wish + <b>Past Perfect</b></td><td>Bedauern über die Vergangenheit</td><td><i>I wish I <b>hadn't said</b> that.</i></td></tr>
<tr><td>wish + <b>would</b></td><td>Ärger über das Verhalten anderer</td><td><i>I wish you <b>would stop</b> shouting!</i></td></tr>
<tr><td>should have + 3. Form</td><td>Hätte sollen (Vorwurf/Bedauern)</td><td><i>You <b>should have told</b> me.</i></td></tr>
</table>
<p><b>If only</b> funktioniert genauso, ist aber stärker: <i>If only I <b>had</b> listened!</i></p>
<p>⚠️ Nicht: ✗ <i>I wish I would have …</i> für sich selbst → ✓ <i>I wish I <b>had</b> …</i></p>
<p><b>regret</b> + -ing: <i>I regret <b>not taking</b> the job.</i></p>`,
    ex: [
      { t: 'gap', q: "I wish I ___ (know) the answer.", a: ["knew"], ex: "Gegenwart → Past." },
      { t: 'gap', q: "I wish I ___ (not/eat) so much yesterday.", a: ["had not eaten"], ex: "Vergangenheit → Past Perfect." },
      { t: 'gap', q: "I wish you ___ (stop) interrupting me!", a: ["would stop"], ex: "Ärger über jemand anderen → would." },
      { t: 'mc', q: "If only I ___ more money right now!", o: ["have", "had", "would have"], c: 1, ex: "Gegenwart → Past." },
      { t: 'fix', q: "I wish I would have more time.", a: ["I wish I had more time."], ex: "Für sich selbst: wish + Past." },
      { t: 'tr', q: "Ich wünschte, ich wäre zur Party gegangen.", a: ["I wish I had gone to the party.", "If only I had gone to the party."], ex: "Bedauern Vergangenheit → had gone." },
      { t: 'tr', q: "Du hättest mich anrufen sollen.", a: ["You should have called me.", "You should have phoned me.", "You should have rung me.", "You ought to have called me."], ex: "should have + 3. Form." },
      { t: 'gap', q: "I wish it ___ (be) summer already.", a: ["were", "was"], ex: "Gegenwart → were/was." },
      { t: 'mc', q: "I failed the test. I ___ more.", o: ["should study", "should have studied", "must have studied"], c: 1, ex: "Bedauern Vergangenheit → should have." },
      { t: 'gap', q: "She regrets ___ (not/accept) the offer.", a: ["not accepting", "not having accepted"], ex: "regret + -ing." },
    ]
  },
  {
    id: 'passive', group: 'structures', title: 'Passiv (Passive Voice)', level: 'B2',
    explain: `
<p>Passiv = <b>be</b> + 3. Form. Die Zeitform steckt immer in „be“:</p>
<table>
<tr><th>Zeitform</th><th>Passiv</th></tr>
<tr><td>Present Simple</td><td>English <b>is spoken</b> here.</td></tr>
<tr><td>Present Continuous</td><td>The road <b>is being repaired</b>.</td></tr>
<tr><td>Past Simple</td><td>The bridge <b>was built</b> in 1890.</td></tr>
<tr><td>Present Perfect</td><td>The tickets <b>have been sold</b>.</td></tr>
<tr><td>Past Perfect</td><td>The car <b>had been stolen</b>.</td></tr>
<tr><td>Future</td><td>It <b>will be finished</b> soon.</td></tr>
<tr><td>Modalverb</td><td>It <b>must be done</b> today.</td></tr>
</table>
<p>⚠️ Deutsch „wurde“ = <b>was/were</b> (nicht „became“, nicht „will“)!</p>
<p><b>Es wird gesagt, dass …</b> → <i>It is said that he is rich. / He <b>is said to be</b> rich.</i></p>
<p><b>etwas machen lassen</b> → <i>have/get something done</i>: <i>I'm <b>having</b> my hair <b>cut</b>.</i></p>`,
    ex: [
      { t: 'gap', q: "This bridge ___ (build) in 1890.", a: ["was built"], ex: "Past Simple Passive." },
      { t: 'gap', q: "English ___ (speak) all over the world.", a: ["is spoken"], ex: "Present Simple Passive." },
      { t: 'gap', q: "The new hospital ___ (open) next year.", a: ["will be opened", "is going to be opened"], ex: "Future Passive." },
      { t: 'gap', q: "My car ___ (repair) at the moment, so I'm taking the bus.", a: ["is being repaired"], ex: "at the moment → Present Continuous Passive." },
      { t: 'gap', q: "All the tickets ___ (already/sell).", a: ["have already been sold"], ex: "Present Perfect Passive." },
      { t: 'fix', q: "The letter was wrote by my grandfather.", a: ["The letter was written by my grandfather."], ex: "be + 3. Form (written)." },
      { t: 'tr', q: "Das Haus wurde letztes Jahr verkauft.", a: ["The house was sold last year.", "Last year the house was sold."], ex: "wurde → was." },
      { t: 'tr', q: "Ich lasse mir morgen die Haare schneiden.", a: ["I am having my hair cut tomorrow.", "I am getting my hair cut tomorrow.", "I am going to have my hair cut tomorrow.", "I am going to get my hair cut tomorrow.", "I will have my hair cut tomorrow.", "I will get my hair cut tomorrow.", "Tomorrow I am having my hair cut.", "Tomorrow I am getting my hair cut."], ex: "have/get + Objekt + 3. Form." },
      { t: 'mc', q: "The meeting ___ because the manager was ill.", o: ["was cancelled", "has cancelled", "cancelled"], c: 0, ex: "Das Meeting wurde abgesagt → Passiv." },
      { t: 'mc', q: "He is said ___ very rich.", o: ["being", "to be", "that he is"], c: 1, ex: "be said + to-Infinitiv." },
      { t: 'gap', q: "The results ___ (not/announce) yet.", a: ["have not been announced"], ex: "yet → Present Perfect Passive." },
    ]
  },
  {
    id: 'reported', group: 'structures', title: 'Indirekte Rede (Reported Speech)', level: 'B2',
    explain: `
<p>Wenn das einleitende Verb in der Vergangenheit steht (<i>said, told, asked</i>), rückt die Zeit meist eine Stufe zurück (<b>backshift</b>):</p>
<table>
<tr><th>Direkt</th><th>Indirekt</th></tr>
<tr><td>am/is → was · do → did</td><td>"I'm tired." → She said she <b>was</b> tired.</td></tr>
<tr><td>did / have done → had done</td><td>"I've finished." → He said he <b>had</b> finished.</td></tr>
<tr><td>will → would · can → could</td><td>"I'll help." → He said he <b>would</b> help.</td></tr>
</table>
<p>Zeit/Ort: today → that day · tomorrow → the next day · yesterday → the day before · here → there</p>
<h4>say oder tell?</h4>
<p><b>say</b> (something) (to sb): <i>She <b>said</b> (to me) that …</i> · <b>tell</b> sb (something): <i>She <b>told me</b> that …</i></p>
<h4>Fragen & Aufforderungen</h4>
<p>Fragen: Wortstellung wie im Aussagesatz, kein do! <i>He asked me where I <b>lived</b>.</i> (✗ where did I live) · Ja/Nein-Fragen mit <b>if/whether</b>.</p>
<p>Aufforderungen: <i>She told me <b>to wait</b>. / She told me <b>not to touch</b> it.</i></p>`,
    ex: [
      { t: 'gap', q: 'She said, "I am tired." → She said she ___ tired.', a: ["was"], ex: "am → was." },
      { t: 'gap', q: '"I will help you," he said. → He said he ___ help me.', a: ["would"], ex: "will → would." },
      { t: 'gap', q: '"We have finished," they said. → They said they ___ finished.', a: ["had"], ex: "have → had." },
      { t: 'mc', q: "He ___ me that he was leaving.", o: ["said", "told", "spoke"], c: 1, ex: "tell + Person." },
      { t: 'mc', q: "She ___ that she was busy.", o: ["said", "told"], c: 0, ex: "say ohne Person." },
      { t: 'fix', q: "He asked me where do I live.", a: ["He asked me where I lived.", "He asked me where I live."], ex: "Indirekte Frage: Aussagesatz-Wortstellung." },
      { t: 'gap', q: '"Can you swim?" → She asked me ___ I could swim.', a: ["if", "whether"], ex: "Ja/Nein-Frage → if/whether." },
      { t: 'tr', q: "Er sagte mir, ich solle warten.", a: ["He told me to wait."], ex: "Aufforderung → tell sb to do." },
      { t: 'gap', q: '"Don\'t touch it!" → She told me ___ (not/touch) it.', a: ["not to touch"], ex: "Verbot → not to + Infinitiv." },
      { t: 'tr', q: "Sie fragte, ob ich Hunger hätte.", a: ["She asked if I was hungry.", "She asked whether I was hungry.", "She asked me if I was hungry.", "She asked me whether I was hungry."], ex: "ob → if/whether; Hunger haben → be hungry." },
      { t: 'mc', q: '"I saw him yesterday." → She said she had seen him ___.', o: ["yesterday", "the day before", "tomorrow"], c: 1, ex: "yesterday → the day before (the previous day)." },
    ]
  },
  {
    id: 'gerund-inf', group: 'structures', title: 'Gerund (-ing) vs. Infinitiv (to)', level: 'B2',
    explain: `
<table>
<tr><th>+ -ing</th><th>+ to-Infinitiv</th></tr>
<tr><td>enjoy, avoid, mind, suggest, finish, keep, consider, risk, can't stand, can't help, look forward to, be used to, it's worth</td><td>want, decide, hope, plan, agree, refuse, manage, afford, expect, promise, offer, would like, seem</td></tr>
<tr><td>Nach <b>Präpositionen</b> immer -ing:<br><i>I'm interested <b>in learning</b>. Thanks <b>for helping</b>.</i></td><td><b>make / let</b> + Infinitiv <b>ohne</b> to:<br><i>She <b>made me wait</b>. They <b>let me go</b>.</i></td></tr>
</table>
<h4>Bedeutung ändert sich</h4>
<ul>
<li><b>stop doing</b> = aufhören · <b>stop to do</b> = anhalten, um zu tun</li>
<li><b>remember doing</b> = sich erinnern (Vergangenheit) · <b>remember to do</b> = daran denken (Zukunft)</li>
<li><b>forget doing</b> = vergessen, dass man es getan hat · <b>forget to do</b> = vergessen, es zu tun</li>
<li><b>try doing</b> = ausprobieren · <b>try to do</b> = versuchen (schwierig)</li>
</ul>
<p>⚠️ <i>suggest</i>: ✗ <i>suggested to go</i> → ✓ <i>suggested <b>going</b></i> / <i>suggested that we go</i></p>`,
    ex: [
      { t: 'gap', q: "I enjoy ___ (cook) for friends.", a: ["cooking"], ex: "enjoy + -ing." },
      { t: 'gap', q: "She decided ___ (study) medicine.", a: ["to study"], ex: "decide + to." },
      { t: 'gap', q: "Would you mind ___ (open) the window?", a: ["opening"], ex: "mind + -ing." },
      { t: 'gap', q: "I'm looking forward to ___ (hear) from you.", a: ["hearing"], ex: "look forward to + -ing (to ist hier Präposition)." },
      { t: 'mc', q: "On the way home, he stopped ___ a cigarette. (Er hielt an, um zu rauchen.)", o: ["smoking", "to smoke"], c: 1, ex: "stop to do = anhalten, um zu tun." },
      { t: 'mc', q: "Remember ___ the door when you leave!", o: ["locking", "to lock"], c: 1, ex: "remember to do = daran denken (Zukunft)." },
      { t: 'fix', q: "She suggested to go to the cinema.", a: ["She suggested going to the cinema.", "She suggested that we go to the cinema.", "She suggested that we should go to the cinema.", "She suggested we go to the cinema."], ex: "suggest + -ing oder that-Satz." },
      { t: 'tr', q: "Ich kann es mir nicht leisten, ein neues Auto zu kaufen.", a: ["I can not afford to buy a new car.", "I can not afford a new car."], ex: "afford + to." },
      { t: 'gap', q: "My parents let me ___ (stay) up late.", a: ["stay"], ex: "let + Infinitiv ohne to." },
      { t: 'gap', q: "I'm interested in ___ (learn) more about it.", a: ["learning"], ex: "Präposition + -ing." },
      { t: 'mc', q: "I'll never forget ___ the Eiffel Tower for the first time.", o: ["seeing", "to see"], c: 0, ex: "forget doing = Erinnerung an Vergangenes." },
      { t: 'gap', q: "He refused ___ (answer) my question.", a: ["to answer"], ex: "refuse + to." },
    ]
  },
  {
    id: 'modals', group: 'structures', title: 'Modalverben (must, have to, might …)', level: 'B2',
    explain: `
<h4>⚠️ must not ≠ nicht müssen</h4>
<table>
<tr><th>Englisch</th><th>Deutsch</th></tr>
<tr><td><b>mustn't</b></td><td>darf nicht (Verbot)</td></tr>
<tr><td><b>don't have to / needn't</b></td><td>muss nicht (keine Pflicht)</td></tr>
<tr><td><b>must</b></td><td>muss (eigene Überzeugung)</td></tr>
<tr><td><b>have to</b></td><td>muss (äußere Regel/Pflicht)</td></tr>
</table>
<p><b>can / could / be able to:</b> Für eine einmalige Leistung in der Vergangenheit nimm <i>was able to / managed to</i>, nicht <i>could</i>: <i>After hours, we <b>were able to</b> find the hotel.</i></p>
<p><b>may / might / could</b> = vielleicht: <i>He <b>might</b> be right.</i></p>
<p><b>should</b> = sollte (Rat) – nie mit „to“: ✗ <i>should to see</i></p>
<h4>Modalverb + have + 3. Form (Vergangenheit)</h4>
<ul>
<li><b>must have</b> done = muss getan haben (sicher)</li>
<li><b>can't have</b> done = kann nicht getan haben</li>
<li><b>might/may have</b> done = könnte getan haben</li>
<li><b>should have</b> done = hätte tun sollen</li>
<li><b>could have</b> done = hätte tun können</li>
</ul>
<p>Angebote/Vorschläge: <i><b>Shall</b> I open the window?</i></p>`,
    ex: [
      { t: 'mc', q: "You ___ smoke here. It's forbidden.", o: ["mustn't", "don't have to"], c: 0, ex: "Verbot → mustn't." },
      { t: 'mc', q: "Tomorrow is Sunday, so I ___ get up early.", o: ["mustn't", "don't have to"], c: 1, ex: "Keine Pflicht → don't have to." },
      { t: 'tr', q: "Du musst nicht kommen, wenn du nicht willst.", a: ["You do not have to come if you do not want to.", "You do not have to come if you do not want.", "You need not come if you do not want to.", "You do not need to come if you do not want to.", "You do not need to come if you do not want."], ex: "nicht müssen → don't have to / needn't." },
      { t: 'gap', q: "The lights are off. They ___ (must/go) out.", a: ["must have gone"], ex: "Sichere Vermutung über die Vergangenheit." },
      { t: 'gap', q: "She ___ (can't/see) me – she didn't say hello.", a: ["can not have seen", "could not have seen"], ex: "Unmöglich in der Vergangenheit → can't have." },
      { t: 'mc', q: "I ___ swim when I was five.", o: ["could", "can", "was able"], c: 0, ex: "Allgemeine Fähigkeit in der Vergangenheit → could." },
      { t: 'mc', q: "After three hours of searching, we ___ find the hotel.", o: ["could", "were able to", "can"], c: 1, ex: "Einmalige Leistung → was/were able to." },
      { t: 'fix', q: "You should to see a doctor.", a: ["You should see a doctor."], ex: "should + Infinitiv ohne to." },
      { t: 'tr', q: "Er könnte recht haben.", a: ["He might be right.", "He may be right.", "He could be right."], ex: "Möglichkeit → might/may/could." },
      { t: 'gap', q: "You ___ (should/tell) me earlier! Now it's too late.", a: ["should have told"], ex: "Vorwurf über die Vergangenheit." },
      { t: 'mc', q: "___ I open the window? It's hot in here.", o: ["Shall", "Will", "Must"], c: 0, ex: "Angebot → Shall I …?" },
    ]
  },
  {
    id: 'relative', group: 'structures', title: 'Relativsätze (who, which, that)', level: 'B2',
    explain: `
<table>
<tr><th>Pronomen</th><th>für</th><th>Beispiel</th></tr>
<tr><td><b>who</b></td><td>Personen</td><td><i>The woman <b>who</b> lives next door …</i></td></tr>
<tr><td><b>which</b></td><td>Dinge, Tiere</td><td><i>The car <b>which</b> I bought …</i></td></tr>
<tr><td><b>that</b></td><td>beides (nur notwendige Relativsätze)</td><td><i>The book <b>that</b> I read …</i></td></tr>
<tr><td><b>whose</b></td><td>dessen/deren</td><td><i>The man <b>whose</b> car was stolen …</i></td></tr>
<tr><td><b>where / when</b></td><td>Ort / Zeit</td><td><i>The town <b>where</b> I grew up …</i></td></tr>
</table>
<h4>Notwendig (defining) vs. Zusatzinfo (non-defining)</h4>
<ul>
<li><b>Notwendig</b> – ohne Kommas. Ist das Pronomen <b>Objekt</b>, kann man es weglassen: <i>The film (that) I saw was great.</i></li>
<li><b>Zusatzinfo</b> – mit Kommas, <b>nie that</b>: <i>My sister, <b>who</b> lives in Paris, is visiting.</i></li>
</ul>
<p>⚠️ Englische Kommasetzung ist anders als die deutsche: Nicht vor jedem Relativsatz steht ein Komma!</p>
<p>„alles, was“ → <i>everything (that) / all (that)</i> – ✗ <i>all what</i></p>`,
    ex: [
      { t: 'mc', q: "The woman ___ lives next door is a doctor.", o: ["who", "which", "whose"], c: 0, ex: "Person → who." },
      { t: 'mc', q: "This is the book ___ I told you about.", o: ["who", "which", "whose"], c: 1, ex: "Ding → which (oder that)." },
      { t: 'mc', q: "That's the man ___ car was stolen.", o: ["who", "whose", "which"], c: 1, ex: "dessen → whose." },
      { t: 'mc', q: "My sister, ___ lives in Paris, is coming to visit.", o: ["that", "who", "which"], c: 1, ex: "Mit Kommas → kein that." },
      { t: 'gap', q: "Do you remember the day ___ we first met?", a: ["when", "that"], ex: "Zeit → when." },
      { t: 'gap', q: "This is the house ___ I grew up.", a: ["where"], ex: "Ort → where." },
      { t: 'fix', q: "My car, that I bought last year, has already broken down.", a: ["My car, which I bought last year, has already broken down."], ex: "Non-defining (Kommas) → which, nicht that." },
      { t: 'tr', q: "Das ist der Mann, dessen Hund mich gebissen hat.", a: ["That is the man whose dog bit me.", "This is the man whose dog bit me.", "That is the man whose dog has bitten me.", "This is the man whose dog has bitten me."], ex: "dessen → whose." },
      { t: 'mc', q: "In welchem Satz kann man das Relativpronomen weglassen?", o: ["The film that I saw was great.", "The man who called you is here.", "The dog that bit me ran away."], c: 0, ex: "Nur wenn das Pronomen Objekt ist (I saw the film)." },
      { t: 'tr', q: "Das ist alles, was ich weiß.", a: ["That is all I know.", "That is all that I know.", "That is everything I know.", "That is everything that I know."], ex: "Nicht „all what“." },
    ]
  },

  // ───────────────────────── PITFALLS ─────────────────────────
  {
    id: 'articles', group: 'pitfalls', title: 'Artikel (a, the, kein Artikel)', level: 'B1',
    explain: `
<p><b>Kein Artikel</b> bei allgemeinen Aussagen – auch wenn das Deutsche einen hat:</p>
<ul>
<li>„Das Leben ist schön.“ → <i><b>Life</b> is beautiful.</i></li>
<li>„Ich liebe die Natur.“ → <i>I love <b>nature</b>.</i></li>
<li>„Geld ist nicht alles.“ → <i><b>Money</b> isn't everything.</i></li>
<li>Mahlzeiten: <i>have breakfast/lunch/dinner</i></li>
<li>Verkehrsmittel: <i>by bus, by car, on foot</i></li>
<li>Feste Wendungen: <i>at home, go to bed, go to work, at school, in hospital (BrE)</i></li>
</ul>
<p><b>a/an bei Berufen</b> – anders als im Deutschen:<br>„Ich bin Lehrer.“ → <i>I'm <b>a</b> teacher.</i> · <b>an</b> vor Vokal<b>laut</b>: <i>an engineer, an hour, a university</i></p>
<p><b>the</b> bei: Instrumenten (<i>play the guitar</i>), Ländern mit Plural/Union (<i>the USA, the UK, the Netherlands</i>), Bestimmtem (<i>Pass me the salt.</i>)</p>
<p>Kein Artikel bei Sportarten: <i>play football</i>.</p>`,
    ex: [
      { t: 'mc', q: "She's ___ engineer.", o: ["a", "an", "– (kein Artikel)"], c: 1, ex: "Beruf + Vokal → an." },
      { t: 'mc', q: "___ life is too short to worry.", o: ["The", "– (kein Artikel)", "A"], c: 1, ex: "Allgemeine Aussage → kein Artikel." },
      { t: 'mc', q: "I usually go to work by ___ bus.", o: ["the", "a", "– (kein Artikel)"], c: 2, ex: "by + Verkehrsmittel ohne Artikel." },
      { t: 'fix', q: "My brother is teacher.", a: ["My brother is a teacher."], ex: "Beruf → a." },
      { t: 'tr', q: "Ich liebe die Natur.", a: ["I love nature."], ex: "nature ohne Artikel." },
      { t: 'mc', q: "Can you pass me ___ salt, please?", o: ["– (kein Artikel)", "a", "the"], c: 2, ex: "Bestimmtes Salz auf dem Tisch → the." },
      { t: 'mc', q: "We had ___ breakfast at 8.", o: ["the", "a", "– (kein Artikel)"], c: 2, ex: "Mahlzeiten ohne Artikel." },
      { t: 'tr', q: "Er ist im Krankenhaus. (als Patient)", a: ["He is in hospital.", "He is in the hospital."], ex: "BrE: in hospital, AmE: in the hospital." },
      { t: 'mc', q: "___ United Kingdom consists of four countries.", o: ["– (kein Artikel)", "The", "A"], c: 1, ex: "the UK, the USA …" },
      { t: 'fix', q: "The money isn't everything.", a: ["Money is not everything."], ex: "Allgemein → kein Artikel." },
      { t: 'mc', q: "I play ___ guitar in a band.", o: ["the", "– (kein Artikel)", "a"], c: 0, ex: "Instrumente mit the." },
    ]
  },
  {
    id: 'prepositions', group: 'pitfalls', title: 'Präpositionen (Zeit & Verben)', level: 'B1',
    explain: `
<table>
<tr><th>at</th><th>on</th><th>in</th></tr>
<tr><td>Uhrzeit: at 6 o'clock<br>at night, at the weekend (BrE)<br>at Christmas</td><td>Tage: on Monday<br>Datum: on 3 May<br>on my birthday</td><td>Monate, Jahre: in May, in 2020<br>Jahreszeiten: in summer<br>in the morning/evening</td></tr>
</table>
<h4>Typische Verwechslungen</h4>
<ul>
<li><b>by</b> = bis spätestens (Deadline) · <b>until</b> = bis (andauernd): <i>Send it <b>by</b> Friday. / Wait <b>until</b> I come.</i></li>
<li><b>during</b> + Nomen · <b>while</b> + Satz: <i><b>during</b> the film / <b>while</b> I was watching</i></li>
<li><b>ago</b> = vor (zeitlich): <i>two years <b>ago</b></i> (✗ before two years)</li>
<li><b>in</b> = in (Zukunft): <i>I'll be back <b>in</b> ten minutes.</i></li>
</ul>
<h4>Verb/Adjektiv + Präposition</h4>
<p>depend <b>on</b> · good <b>at</b> · interested <b>in</b> · afraid <b>of</b> · different <b>from</b> · wait <b>for</b> · listen <b>to</b> · married <b>to</b> · proud <b>of</b> · responsible <b>for</b></p>`,
    ex: [
      { t: 'mc', q: "The meeting is ___ Monday.", o: ["in", "on", "at"], c: 1, ex: "Tage → on." },
      { t: 'mc', q: "I was born ___ 1990.", o: ["in", "on", "at"], c: 0, ex: "Jahre → in." },
      { t: 'mc', q: "I'll see you ___ 6 o'clock.", o: ["in", "on", "at"], c: 2, ex: "Uhrzeit → at." },
      { t: 'mc', q: "Please send me the report ___ Friday at the latest.", o: ["until", "by"], c: 1, ex: "Deadline → by." },
      { t: 'mc', q: "I'll wait here ___ you come back.", o: ["until", "by"], c: 0, ex: "Andauernd bis → until." },
      { t: 'mc', q: "I fell asleep ___ the film.", o: ["while", "during"], c: 1, ex: "+ Nomen → during." },
      { t: 'gap', q: "I moved here three years ___.", a: ["ago"], ex: "vor drei Jahren → three years ago." },
      { t: 'fix', q: "I met her before two weeks.", a: ["I met her two weeks ago."], ex: "vor (zeitlich) → ago, nachgestellt." },
      { t: 'tr', q: "Ich bin in zehn Minuten zurück.", a: ["I will be back in ten minutes.", "I will be back in 10 minutes."], ex: "in + Zeitraum (Zukunft)." },
      { t: 'mc', q: "Everything depends ___ the weather.", o: ["from", "of", "on"], c: 2, ex: "depend on (nicht from!)." },
      { t: 'mc', q: "She's really good ___ maths.", o: ["in", "at", "on"], c: 1, ex: "good at." },
      { t: 'mc', q: "The city is very different ___ what I expected.", o: ["from", "of", "as"], c: 0, ex: "different from (AmE auch: than)." },
    ]
  },
  {
    id: 'word-order', group: 'pitfalls', title: 'Satzstellung & Fragen', level: 'B1',
    explain: `
<p>Englisch hat eine strenge Reihenfolge: <b>Subjekt – Verb – Objekt – Ort – Zeit</b></p>
<p>Keine Umstellung wie im Deutschen („Gestern <b>ging ich</b> …“):<br>✓ <i>Yesterday <b>I went</b> to the cinema.</i> / <i>I went to the cinema yesterday.</i></p>
<p>Verb und Objekt nicht trennen: ✗ <i>I drink every morning coffee.</i> → ✓ <i>I drink coffee every morning.</i></p>
<h4>Häufigkeitsadverbien (always, never, often …)</h4>
<ul><li><b>vor</b> dem Vollverb: <i>I <b>often</b> go there.</i></li>
<li><b>nach</b> be: <i>She is <b>always</b> late.</i></li>
<li><b>zwischen</b> Hilfsverb und Verb: <i>I have <b>never</b> been there.</i></li></ul>
<h4>Fragen</h4>
<ul><li>Mit <b>do/does/did</b>: <i>What <b>does</b> this word <b>mean</b>?</i> (✗ What means this word?)</li>
<li>Fragt man nach dem <b>Subjekt</b>, kein do: <i>Who <b>called</b> you?</i></li>
<li>Indirekte Fragen = Aussagesatz-Stellung: <i>Do you know where the station <b>is</b>?</i></li></ul>`,
    ex: [
      { t: 'fix', q: "Yesterday went I to the cinema.", a: ["Yesterday I went to the cinema.", "I went to the cinema yesterday."], ex: "Subjekt vor Verb – immer." },
      { t: 'fix', q: "I drink every morning coffee.", a: ["I drink coffee every morning.", "Every morning I drink coffee."], ex: "Verb + Objekt nicht trennen." },
      { t: 'mc', q: "Welcher Satz ist richtig?", o: ["She always is late.", "She is always late.", "Always she is late."], c: 1, ex: "Nach be." },
      { t: 'mc', q: "Welcher Satz ist richtig?", o: ["I never have been to Paris.", "I have never been to Paris.", "I have been never to Paris."], c: 1, ex: "Zwischen Hilfsverb und Verb." },
      { t: 'fix', q: "Can you tell me where is the station?", a: ["Can you tell me where the station is?", "Could you tell me where the station is?"], ex: "Indirekte Frage → Aussagesatz-Stellung." },
      { t: 'tr', q: "Was bedeutet dieses Wort?", a: ["What does this word mean?"], ex: "Frage mit does." },
      { t: 'fix', q: "What means this word?", a: ["What does this word mean?"], ex: "Hilfsverb does nötig." },
      { t: 'tr', q: "Ich weiß nicht, was er will.", a: ["I do not know what he wants."], ex: "Indirekter Fragesatz: what he wants." },
      { t: 'fix', q: "I like very much football.", a: ["I like football very much.", "I really like football."], ex: "very much ans Ende." },
      { t: 'tr', q: "Morgen fahre ich nach Wien.", a: ["I am going to Vienna tomorrow.", "Tomorrow I am going to Vienna.", "I am driving to Vienna tomorrow.", "Tomorrow I am driving to Vienna.", "I will go to Vienna tomorrow.", "Tomorrow I will go to Vienna.", "I am travelling to Vienna tomorrow.", "Tomorrow I am travelling to Vienna.", "I am going to go to Vienna tomorrow.", "I will drive to Vienna tomorrow."], ex: "Keine Inversion; Zukunftsform nötig." },
      { t: 'fix', q: "Who did call you?", a: ["Who called you?"], ex: "Subjektfrage → kein did." },
    ]
  },
  {
    id: 'common-mistakes', group: 'pitfalls', title: 'Typische Fehler von Deutschsprachigen', level: 'B2',
    explain: `
<ul>
<li><b>make</b> (herstellen, erschaffen): make a mistake, a decision, a suggestion, money, an effort<br><b>do</b> (Tätigkeit, Arbeit): do homework, a favour, the dishes, business, your best</li>
<li><b>much</b> + unzählbar (much money) · <b>many</b> + zählbar (many friends). In positiven Sätzen klingt <b>a lot of</b> natürlicher.</li>
<li><b>few</b> + zählbar · <b>little</b> + unzählbar</li>
<li>Unzählbar (kein Plural, kein a): <i>information, advice, news, furniture, luggage, homework, equipment</i></li>
<li><b>explain</b> sth <b>to</b> sb (✗ explain me) · <b>I agree</b> (✗ I am agree)</li>
<li>Steigerung: entweder -er <b>oder</b> more (✗ more taller)</li>
<li>Adverb nach Vollverb: <i>She works very <b>well</b>.</i> (✗ good)</li>
<li><b>leave</b> sth somewhere (✗ forget sth at home)</li>
<li><b>since/for</b> → Present Perfect (✗ I am here since …)</li>
</ul>`,
    ex: [
      { t: 'mc', q: "Can you ___ me a favour?", o: ["make", "do"], c: 1, ex: "do sb a favour." },
      { t: 'mc', q: "I need to ___ a decision by tomorrow.", o: ["make", "do"], c: 0, ex: "make a decision." },
      { t: 'mc', q: "How ___ money do you have?", o: ["much", "many"], c: 0, ex: "money ist unzählbar." },
      { t: 'mc', q: "There are only a ___ tickets left.", o: ["few", "little"], c: 0, ex: "tickets zählbar → few." },
      { t: 'fix', q: "I have much friends.", a: ["I have a lot of friends.", "I have many friends.", "I have lots of friends."], ex: "friends zählbar." },
      { t: 'fix', q: "Can you explain me this?", a: ["Can you explain this to me?", "Could you explain this to me?", "Can you explain it to me?"], ex: "explain sth to sb." },
      { t: 'fix', q: "I am agree with you.", a: ["I agree with you."], ex: "agree ist ein Verb." },
      { t: 'fix', q: "The informations are wrong.", a: ["The information is wrong."], ex: "information ist unzählbar." },
      { t: 'mc', q: "She gave me some good ___.", o: ["advice", "advices", "an advice"], c: 0, ex: "advice ist unzählbar." },
      { t: 'fix', q: "I am here since two hours.", a: ["I have been here for two hours.", "I have been here for 2 hours."], ex: "since/for → Present Perfect; Zeitraum → for." },
      { t: 'tr', q: "Es hängt vom Wetter ab.", a: ["It depends on the weather."], ex: "depend on." },
      { t: 'fix', q: "He is more taller than me.", a: ["He is taller than me.", "He is taller than I am.", "He is taller than I."], ex: "Nur -er." },
      { t: 'mc', q: "Oh no, I ___ my keys at home!", o: ["forgot", "left"], c: 1, ex: "Mit Ortsangabe → leave." },
      { t: 'fix', q: "She works very good.", a: ["She works very well."], ex: "Adverb: well." },
    ]
  },
];
