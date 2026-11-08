# Karakter-konfigurator med controllere

**Programmering B — 2. år**  
**Udgangspunkt:** dette kapitel (`13_DATA_ALGORITMER`)  
**Bygger videre på:** dit personlige API, MQTT og `fetch`

---

## Opgaven

Lav et **fælles interface** til at vælge spillerkarakterer.

Computeren (eller projektoren) er **boardet**: her vises kataloget og de to spillere.  
To **mobiler** er controllere — én til spiller A, én til spiller B. De sender valg over MQTT.

Det er ikke to separate konfigurations-sider. Telefonen er en fjernbetjening til den fælles skærm.

Medbring `myApi.js` og `myApiStyles.css`. Nye, genbrugelige funktioner lægges i API’et.

---

## Krav

### 1. Board og controller

- En fællesskærm i `twoPlayerScreen/`, der viser katalog + slot A og slot B  
- En mobil-app i `controller/`: vælg A eller B, bladre, vælg, gerne ét filter  
- Live Server — telefonen rammer computerens IP, ikke `file://`

### 2. Jeres egne objekter

`playerA` og `playerB` er jeres objekter (navn, slot, …).  
Når nogen vælger en figur, **kopierer** I felter ind i objektet. I viser ikke hele API-svaret.

### 3. Rick and Morty som datakilde

Hent kataloget med `fetch` fra Rick and Morty (se README, trin 2–3).  
Berig spilleren med mindst `name` og `image` — gerne `species` eller `status` også.

### 4. En algoritme, man kan se

Filtrér **eller** sortér listen, og opdatér UI’en.  
Funktionen skal ligge i API’et, hvis den kan genbruges (`filterBy`, `sortBy`, `fetchJSON`).

### 5. API og stylesheet

- `shiftPage` mindst ét sted (fx katalog → arena, når begge er valgt)  
- `showToast` når kataloget er hentet, og når A eller B vælger  
- `mousePressed` til klik  
- `myApiStyles.css` indlæst på **begge** sider

### 6. MQTT som controller-ledning

Controlleren **publisher**. Boardet **subscriber** og reagerer.  
Send JSON (`JSON.stringify` / `JSON.parse`) med mindst `slot` og `action`.  
Eget topic.

---

## Tips

1. Få `fetch` + ét billede til at virke på boardet alene  
2. Vælg en figur med en knap **på computeren**  
3. Så MQTT fra computer til computer (samme mønster som kapitel 11)  
4. Til sidst controlleren på telefonen  
5. Aftal topic, før I tester to og to

---

## Du skal kunne forklare

- Hvorfor board og controller er to sider, ikke to kopier af samme konfigurator  
- Forskellen på jeres `playerA`-objekt og ét objekt i `catalog`  
- Hvad `filter` eller `sort` gør ved listen  
- Hvorfor MQTT sendes som streng  
- Hvilke funktioner der ligger i API’et i denne opgave

---

## Aflevering

- `twoPlayerScreen/` og `controller/`, begge med `index.html`, `index.js` og `index.css`  
- Fælles `myApi.js`, `myApiStyles.css` og `assets/` i projektets rod  
- To spillere valgt via controllere, synligt på fællesskærmen  
- Kort fremvisning: telefon vælger → boardet opdaterer
