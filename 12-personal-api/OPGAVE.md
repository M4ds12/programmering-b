# Mit personlige API

**Programmering B — 2. år**  
**Udgangspunkt:** dette kapitel (`12_PERSONLIGT_API`)  
**Bygger videre på:** MQTT-startforløbet og teknikker fra 1. år

---

## Opgaven

Lav dit eget lille **API**: en fil med genbrugelige funktioner, du selv har generaliseret.

Filen skal hedde noget i stil med:

- `myApi.js`, eller  
- `ditnavnApi.js`

Du skal også have et lille projekt (`index.html` + `index.js` + stylesheet), der **viser**, at API’et virker. CSS der hører til API’et (fx `.show` og `#toast`) kan ligge i `myApiStyles.css`.

---

## Krav til API’et

Dit API skal indeholde mindst **4 funktioner** med parametre.  
Funktionerne skal være **generelle**: det der kan skifte fra projekt til projekt, skal ind som parametre (fx hvilket element, hvilken klasse, hvilken tekst).

Vælg selv — her er forslag:

| Funktion | Hvad den gør |
|---|---|
| `shiftPage(newId, fromId = currentPage, className = 'show')` | Skjuler den gamle side og viser den nye. Virker med ét argument (som i 1. år) |
| `showToast(text, ms = 2500)` | Viser en kort notifikation, der forsvinder igen |
| `showMessage(text, divId)` | Skriver en besked ind i et bestemt HTML-element |
| `setText(id, text)` | Sætter teksten i et element (titel, score, hint osv.) |
| `show(id)` / `hide(id)` | Viser eller skjuler et element |
| `startTimer(seconds, displayId)` | Tæller ned/op og opdaterer tiden i et element på siden |
| `playSound(path)` | Afspiller en lydfil fra en sti |
| `createList(list, containerId, className)` | Laver HTML-elementer ud fra et array |
| `shuffle(list)` | Blander et array og returnerer det |
| `randomFrom(list)` | Returnerer et tilfældigt element fra et array |
| `mqttListen(topic, onMessage)` | Forbinder til MQTT, subscriber, kalder din funktion med tekst |

### Om `showToast` og default-parametre

`showToast` er den Mac-agtige notifikation fra MQTT-startforløbet.

```js
function showToast(text, ms = 2500) { /* ... */ }

showToast('Gemt!')        // forsvinder efter 2,5 sek
showToast('Fejl!', 4000)  // forsvinder efter 4 sek
```

`ms = 2500` er en **default-værdi**: parameteren er valgfri.  
I JavaScript laver vi ikke flere funktioner med samme navn og forskelligt antal parametre — vi bruger defaults i stedet.

Husk HTML + CSS til `#toast` (ét fast element). Det CSS kan ligge i `myApiStyles.css`.

### Om `shiftPage`

I 1. år kaldte I `shiftPage('#page2')` — destinationen først. Det skal stadig virke.  
De to næste parametre har **defaults**, så I kan kalde den på tre måder:

```js
shiftPage('#page2')                        // som i 1. år
shiftPage('#page2', '#page1')              // sig selv, hvorfra
shiftPage('#gameplay', '#intro', 'active') // anden synligheds-klasse
```

Klassen `show` er underforstået, medmindre I sender noget andet med.

Tjek at siderne findes, før I kalder `removeClass` / `addClass` — `select()` giver `null`, hvis id’et mangler:

```js
let fromEl = select(fromId)
let toEl = select(newId)
if (!toEl) return
if (fromEl) fromEl.removeClass(className)
```

Så crasher den ikke, hvis defaulten `'#page1'` ikke er på siden.

### Om `startTimer`

Den er til spil og tests, hvor tiden skal vises undervejs — fx countdown i et escape room, eller “klik så mange gange du kan på 10 sekunder”.

```js
startTimer(10, '#timer')
// viser fx: 10, 9, 8 ... i elementet med id="timer"
```

`seconds` = hvor lang tid.  
`displayId` = hvilket element på siden der skal opdateres.

### Om callbacks

En **callback** er en funktion, du giver videre som parameter til en anden funktion.  
Den anden funktion kalder den automatisk, når noget sker.

```js
function startSpil() {
  showToast('Spillet starter')
  shiftPage('#page2')
}

select('#startBtn').mousePressed(startSpil)
```

Her er `startSpil` callback’en. p5’s `mousePressed` kalder den, når knappen klikkes.

### Om `mqttListen`

Pakker connect + subscribe + message ind i én helper.  
Du vælger topic og en callback til beskedteksten:

```js
function handleMqttMessage(tekst) {
  showToast(tekst)
}

mqttListen('programmering', handleMqttMessage)
```

Samme callback-idé som `mousePressed` — bare ved MQTT i stedet for klik.  
Kræver MQTT-scriptet i HTML (som i MQTT-startforløbet).

### Krav til funktionerne

- Mindst én funktion skal bruge `return`
- Mindst én funktion skal bruge en **default-parameter** (fx `showToast(text, ms = 2500)`)
- Mindst én funktion skal bruge en **callback** (fx `mqttListen`, eller en helper der tager en funktion som parameter)

---

## Krav til demo-projektet

Lav en lille side (eller et par sider), der kalder dine API-funktioner.

Det kan fx være:

- en mini-udgave af dit MQTT send/skift-projekt
- en klik-test med timer
- en “random fact”-side
- noget helt eget

Det vigtige er ikke det store produkt — det er, at API’et bliver brugt.

I `index.html` skal API’ets CSS og JS indlæses **før** `index.js`:

```html
<link rel="stylesheet" href="./myApiStyles.css">
<script src="./myApi.js"></script>
<script src="./index.js"></script>
```

---

## Du skal kunne forklare

- Hvad en parameter er, og hvorfor den gør funktionen mere generel
- Hvad en default-parameter er, og hvornår den bruges
- Hvad en **callback** er, og hvornår den kaldes
- Hvad `return` gør i mindst én af dine funktioner
- Hvorfor det er smart at samle genbrugelig kode i en separat fil
- Hvordan dit demo-projekt kalder API’et

---

## Aflevering

- `myApi.js` (eller tilsvarende) med mindst 4 funktioner
- `myApiStyles.css` (eller tilsvarende) med det CSS, funktionerne forventer
- Et lille demo-projekt der bruger dem
- Kort fremvisning: vis én funktion i API’et og ét sted, den bliver kaldt
