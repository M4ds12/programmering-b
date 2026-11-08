# 13. Data og algoritmer

Et spil starter ofte med **karakterer**. Her bygger I den skærm, hvor karaktererne vælges — og lader **mobiler styre** det, der sker på den fælles skærm.

**Kode / opgave:** [OPGAVE.md](OPGAVE.md)

Bygger videre på objekter og arrays fra 1. år, `fetch` fra blackjack, MQTT som **controller**, og dit personlige API (`shiftPage`, `showToast`, stylesheet).

---

## Hvad I bygger

**Fællesskærm** (computer / projektor) viser kataloget og de to spillere.  
**To mobiler** er controllere: spiller A og spiller B bladre, filtrerer og vælger.  
Valgene sendes med MQTT. Skærmen opdaterer objekterne og viser resultatet.

Det er ikke to personer, der sidder i hver sin browser og konfigurerer.  
Det er ét fælles interface — telefonerne er fjernbetjeninger.

---

## Trin 0. Tag API’et med

Kopiér `myApi.js` og `myApiStyles.css` ind i projektet.

```html
<link rel="stylesheet" href="./myApiStyles.css">
<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
<script src="./myApi.js"></script>
<script src="./index.js"></script>
```

Brug `shiftPage` og `showToast` med det samme. Ny fælles logik (`fetchJSON`, `filterBy`, `mqttPublish`) lægges **i API’et**, ikke i `index.js`.

---

## Trin 1. Ét objekt er én spiller

```js
let playerA = {
  name: 'Asta',
  slot: 'A'
}

let playerB = {
  name: 'Bo',
  slot: 'B'
}
```

Senere tilføjer I felter fra nettet: `image`, `species`, `status`.  
Objektet er **jeres**. API’et er et katalog, I plukker fra.

**Reference:** [MDN Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)

---

## Hvilket eksternt API?

Der findes flere, der virker i browseren **uden nøgle**:

| API | God til | Docs |
|---|---|---|
| **Rick and Morty** | Figurer med navn, status, race og **billede** i ét svar | [docs](https://rickandmortyapi.com/documentation) |
| PokéAPI | Væsner og stats — listen er kun navn+url, så I skal hente to gange | [docs](https://pokeapi.co/docs/v2) |
| D&D 5e | Klasser, racer, udstyr — færre færdige billeder | [docs](https://www.dnd5eapi.co/docs/) |
| SuperHero API | Superhelte — kræver (gratis) nøgle | [docs](https://superheroapi.com/) |

**I det her kapitel bruger vi Rick and Morty.**  
Én `fetch` giver en liste med både tekst og billeder. De andre må I skifte til senere, hvis I vil.

---

## Trin 2. Hent **én** figur

Åbn URL’en i browseren først, så I ser JSON’en:

`https://rickandmortyapi.com/api/character/1`

I koden:

```js
async function fetchJSON(url) {
  let response = await fetch(url)
  return await response.json()
}

async function loadOne() {
  let data = await fetchJSON('https://rickandmortyapi.com/api/character/1')
  showToast(data.name)
  select('#portrait').attribute('src', data.image)
}

loadOne()
```

`fetchJSON` hører hjemme i `myApi.js`.

**Reference:** [MDN fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

---

## Trin 3. Hent et **katalog** (en side)

`https://rickandmortyapi.com/api/character?page=1`

Svaret ser nogenlunde sådan ud:

```json
{
  "info": { "count": 826, "pages": 42 },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg"
    }
  ]
}
```

Det, I skal bruge, er `data.results` — et **array af objekter**.

```js
let catalog = []

async function loadCatalog() {
  let data = await fetchJSON('https://rickandmortyapi.com/api/character?page=1')
  catalog = data.results
  showToast('Hentet ' + catalog.length + ' figurer')
}
```

Vis listen på fællesskærmen (navn + billede). Start gerne med de første 5, så UI’en ikke eksploderer.

---

## Trin 4. Filtrer og sortér

Når I har listen, er algoritmen det, der gør den brugbar:

```js
function filterBy(list, key, value) {
  return list.filter(item => item[key] === value)
}

let humans = filterBy(catalog, 'species', 'Human')
let byName = catalog.slice().sort((a, b) => a.name.localeCompare(b.name))
```

`filter` laver en **ny** liste.  
`slice()` før `sort`, så originalen ikke bliver rodet.

På fællesskærmen: knapper eller et valg — “kun Human”, “kun Alien”, “A–Z”.  
Når filteret skifter, vises listen forfra. `showToast` kan sige hvor mange, der er tilbage.

`filterBy` (og evt. `sortBy`) lægges i API’et.

**Reference:** [MDN filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) · [MDN sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

---

## Trin 5. Berig jeres spiller-objekt

I kopierer **udvalgte** felter. I viser ikke hele API-objektet.

```js
function pickFor(player, character) {
  player.name = character.name
  player.image = character.image
  player.species = character.species
  player.status = character.status
  return player
}

pickFor(playerA, catalog[0])
```

Nu ejer `playerA` det, spillet skal bruge. Resten af JSON’en kan I ignorere.

---

## Trin 6. To apps: fællesskærm og controller

De to roller ligger i hver sin mappe. Begge bruger API-filerne fra roden:

| Mappe | Hvem | Job |
|---|---|---|
| `twoPlayerScreen/` | Computer / projektor | Viser katalog + spiller A og B |
| `controller/` | Mobil | Knapper: forrige / næste / vælg / filter |

Computer åbner `twoPlayerScreen/index.html` via Live Server.  
Telefonen åbner `controller/index.html` på **samme** Live Server — brug computerens IP, fx `http://192.168.x.x:5500/controller/`.

På controlleren: én tydelig knap “Jeg er A” / “Jeg er B”, så telefonen ved, hvilken slot den styrer.

---

## Trin 7. MQTT: telefonen sender, skærmen lytter

MQTT sender **strenge**. Objekter skal derfor frem og tilbage som JSON:

```js
function mqttPublish(topic, data) {
  client.publish(topic, JSON.stringify(data))
}

function handleBoardMessage(tekst) {
  let msg = JSON.parse(tekst)
  // msg.slot er "A" eller "B"
  // msg.action er fx "next", "filter", "pick"
  showToast(msg.slot + ': ' + msg.action)
}
```

Eksempel på en besked fra controlleren:

```js
mqttPublish('programmering/karakter', {
  slot: 'A',
  action: 'pick',
  id: 1
})
```

Fællesskærmen subscriber, finder figuren i `catalog` (fx med `find`), kalder `pickFor`, og opdaterer UI.

Brug et **eget topic** (klasse + gruppe), så I ikke får naboernes valg.

**Reference:** [MDN JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) · [MDN JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

---

## Trin 8. Sæt det sammen

1. Board henter kataloget og viser det  
2. To telefoner logger på som A og B  
3. A bladre i listen (`next` / `prev`) — board highlighter den aktuelle  
4. A trykker vælg — `playerA` beriges, toast, portræt på boardet  
5. B gør det samme  
6. Når begge er valgt: `shiftPage('#arena')` på fællesskærmen  

Hvis noget fejler: tjek først at `fetch` virker uden MQTT. Så at én knap på computeren kan vælge. Til sidst telefonen.

← [Forrige: Personligt API](../12_PERSONLIGT_API/README.md) · [Pensum](../PENSUM.md) · → [Næste: Rekursion](../14_REKURSION/README.md)
