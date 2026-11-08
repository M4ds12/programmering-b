# 12. Personligt API

Når den samme kode går igen i flere projekter, kan vi samle den i **genbrugelige funktioner**.

**Kode / opgave:** [OPGAVE.md](OPGAVE.md)

---

## Hvad betyder “API” her?

Et API er i denne sammenhæng en **lille værktøjskasse af funktioner**, du selv har lavet.

Du kalder dem med et klart navn — uden at skulle huske hele den indre kode hver gang:

```js
startTimer(10, '#timer')
showToast('Forbundet til MQTT')
showMessage('Du vandt!', '#result')
shiftPage('#page2')
```

Funktionerne gemmes typisk i en fil for sig, fx `myApi.js`. CSS der hører til (`.show`, `#toast` osv.) kan ligge i `myApiStyles.css`.

**Reference:** [MDN Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

---

## Parametre gør koden generel

Uden parametre er funktionen låst til én værdi:

```js
function startTimer() {
  let seconds = 10 // altid 10
}
```

Med parametre kan den bruges på mange måder:

```js
function startTimer(seconds) {
  // seconds kan være 10, 30, 60 ...
}

startTimer(10)
startTimer(30)
```

Parameter = input til funktionen.  
Det er sådan, vi **generaliserer** en kodestump.

**Reference:** [MDN Function parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#function_parameters)

---

## Flere parametre

Det der kan skifte, skal ind som parametre — både **indhold** og **mål**:

```js
function showMessage(text, divId) {
  select(divId).html(text)
}

showMessage('Du vandt!', '#result')
showMessage('Prøv igen', '#hint')
```

Samme funktion — forskellig tekst og forskelligt element.

---

## Default-værdier for parametre

I JavaScript laver man **ikke** flere versioner af samme funktion med forskelligt antal parametre (som i nogle andre sprog).  
I stedet kan en parameter have en **default-værdi**, hvis den ikke bliver sendt med:

```js
function showToast(text, ms = 2500) {
  select('#toast').html(text)
  select('#toast').addClass('show')

  setTimeout(() => {
    select('#toast').removeClass('show')
  }, ms)
}

showToast('Hej')          // bruger 2500 ms
showToast('Hej', 5000)    // bruger 5000 ms
```

`ms = 2500` betyder: “hvis du ikke siger andet, så vent 2,5 sekunder”.

Det kræver et HTML-element, fx:

```html
<div id="toast"></div>
```

…og CSS der gør `#toast` til en kort notifikation øverst til højre (som I så i MQTT-startforløbet).

**Reference:** [MDN Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)

---

## `return` giver noget tilbage

```js
function double(n) {
  return n * 2
}

let resultat = double(5) // 10
```

`return` sender en værdi **ud** af funktionen, så du kan gemme eller bruge den videre.

**Reference:** [MDN return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return)

---

## Callback: en funktion som parameter

Indtil nu har parametre været ting som tekst, tal eller id’er.  
En parameter kan også være **en hel funktion**.

Det kaldes en **callback**: “her er en funktion — kald den, når noget sker”.

Det kender I allerede fra p5: [`mousePressed`](https://p5js.org/reference/p5.Element/mousePressed/) tager en funktion, der skal køres ved klik.

```js
function startSpil() {
  showToast('Spillet starter')
  shiftPage('#page2')
}

select('#startBtn').mousePressed(startSpil)
```

Du skriver ikke `startSpil()` med parentes her — du giver selve funktionen videre. p5 kalder den, når der klikkes.

Samme idé kan I pakke ind i jeres eget API, fx `mqttListen(topic, handleMqttMessage)`.

**Reference:** [MDN Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)

---

## Saml funktionerne i en fil

`myApi.js`:

```js
function shuffle(list) {
  // ...
}

function showToast(text, ms = 2500) {
  // ...
}
```

`index.html` (stylesheet + API **før** den kode, der bruger det):

```html
<link rel="stylesheet" href="./myApiStyles.css">
<script src="./myApi.js"></script>
<script src="./index.js"></script>
```

`myApiStyles.css` er det, der får funktionerne til at *se* rigtige ud: klassen `.show` til sider, layout til `#toast`, og hvad I ellers generaliserer. Så flytter I både JS og CSS med over i næste projekt.

**Reference:** [MDN Script loading](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

---

## Eksempel: `shiftPage` med default-parametre

I 1. år kaldte I `shiftPage('#page2')` — først den side, I vil **hen til**. Det bevarer vi.  
De ekstra parametre har defaults, så den gamle måde stadig virker, og den nye er valgfri:

```js
let currentPage = '#page1'

function shiftPage(newId, fromId = currentPage, className = 'show') {
  let fromEl = select(fromId)
  let toEl = select(newId)
  if (!toEl) return
  if (fromEl) fromEl.removeClass(className)
  toEl.addClass(className)
  currentPage = newId
}

shiftPage('#page2')                       // som i 1. år
shiftPage('#page2', '#page1')             // sig selv, hvorfra
shiftPage('#gameplay', '#intro', 'active') // anden CSS-klasse
```

`select()` returnerer `null`, hvis elementet ikke findes. Uden tjekket crasher `removeClass`, fx hvis defaulten `'#page1'` slet ikke er på siden. Findes fra-siden ikke, springer vi den over og viser alligevel den nye.

- `newId` — siden der skal vises  
- `fromId` — siden der skal skjules (default: den nuværende)  
- `className` — CSS-klassen der styrer synlighed (default: `show`)  

Klassen `show` ligger i `myApiStyles.css`, så I ikke skal huske at kopiere den hver gang.

**Reference:** [p5 select](https://p5js.org/reference/p5/select/) · [p5 addClass](https://p5js.org/reference/p5.Element/addClass/) · [p5 removeClass](https://p5js.org/reference/p5.Element/removeClass/)

---

## Eksempel: MQTT-helper

MQTT-koden fra startforløbet kan også pakkes ind.  
Idéen: du giver **topic** og en **funktion**, der skal kaldes, når der kommer en besked.

```js
function mqttListen(topic, onMessage) {
  let client = mqtt.connect('wss://mqtt.nextservices.dk')

  client.on('connect', () => {
    client.subscribe(topic)
  })

  client.on('message', (t, message) => {
    onMessage(message.toString())
  })

  return client
}

// Din egen funktion — den kaldes automatisk, når der kommer en besked
function handleMqttMessage(tekst) {
  showToast(tekst)
  // eller: skift side, hvis tekst er "1", "2", "3"
}

// brug:
mqttListen('programmering', handleMqttMessage)
```

Her er `handleMqttMessage` igen en **callback** — præcis som `startSpil` i `mousePressed`.  
Forskellen er bare, *hvornår* den kaldes: ved MQTT-besked i stedet for ved klik.

Husk MQTT-scriptet i HTML:

```html
<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
```

**Reference:** [mqtt.js](https://github.com/mqttjs/MQTT.js) · [MDN Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)

← [Forrige: MQTT send & skift](../11_AAR_2_START/README.md) · [Pensum](../PENSUM.md) · → [Næste: Data og algoritmer](../13_DATA_ALGORITMER/README.md)
