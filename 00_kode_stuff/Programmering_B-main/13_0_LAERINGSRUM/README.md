# 11.0 Læringsrum — VS Code + Cursor

Du arbejder i **to vinduer** med hver sin opgave.

| Vindue | Job |
|---|---|
| **VS Code** | Du skriver og retter kode. Ingen AI-forslag. |
| **Cursor** | Du spørger — som du ville spørge en lærer. |

Målet er ikke “få det til at virke hurtigst muligt”.  
Målet er, at **du** forstår og kan forklare det, du bygger.

**Regel til Cursor:** [cursor-laerer-regel.md](cursor-laerer-regel.md)

---

## 1. Sæt VS Code op (uden AI)

1. Åbn **Visual Studio Code**
2. Åbn din projektmappe (`File → Open Folder…`)
3. Tjek Extensions (`Cmd+Shift+X`):
   - **Slå fra / afinstaller** ting som GitHub Copilot, Copilot Chat, Codeium, Tabnine, o.l.
   - Behold gerne: Live Server, evt. relevante sprog-hjælpere
4. Åbn en fil og tjek, at der **ikke** dukker grå AI-forslag op, mens du skriver

Hvis noget stadig foreslår kode af sig selv: find extensionen og disable den for denne mappe.

---

## 2. Sæt Cursor op (som lærer)

1. Åbn **Cursor**
2. Åbn **samme** projektmappe
3. Læg de to vinduer side om side (VS Code til venstre, Cursor til højre — eller omvendt)
4. Tilføj lærings-reglen (én gang):

**Customize** (i sidebaren) → **Rules** → tilføj som **User Rule**  
(eller som Project Rule, hvis den kun skal gælde ét projekt)

Kopiér teksten fra [`cursor-laerer-regel.md`](cursor-laerer-regel.md) ind dér.

Nu er Cursor indstillet til at forklare, stille spørgsmål og pege — ikke til at smide færdige løsninger ind i filerne.

---

## 3. GitHub — så Cursor kan se dit repo

Cursor behøver ikke “magisk GitHub” for at hjælpe dig — den skal bare have **mappen åben**.  
Men GitHub-login er smart, så du nemt kan hente og arbejde i dine egne repos.

### Engang for alle

1. Hav et GitHub-login (skole/egen)
2. I **Cursor**: log ind / connect GitHub, hvis den spørger (eller under account/integrations)
3. Clone dit projekt **én gang** til computeren (Cursor, GitHub Desktop eller `git clone`)
4. Åbn den **samme lokale mappe** i både VS Code og Cursor

### Hvad er nok?

| Du skal | Du behøver ikke |
|---|---|
| Lokal mappe åben i Cursor | At Cursor pusher kode for dig |
| Adgang til dit repo (clone) | At Agent retter filer automatisk |
| Gerne GitHub forbundet i Cursor | At AI skriver commits/PR’er |

**Aftale:** commits og push laver du selv (typisk fra VS Code / terminal).  
Cursor må læse repoet for at forklare — ikke overtage git-arbejdet.

---

## 4. Spilleregler (skarp adskillelse)

### I VS Code gør du

- Skriver koden selv
- Retter fejl selv (så langt du kan)
- Tester i browseren
- Læser fejlmeddelelser og pensum

### I Cursor spørger du — som til en lærer

Brug Cursor, når du er **stuck i forståelsen**, ikke når du er utålmodig.

**Gode spørgsmål**
- “Hvorfor får jeg den her fejl?” *(indsæt fejltekst)*
- “Hvad gør `shiftPage` linje for linje?”
- “Hvad er forskellen på parameter og argument her?”
- “Jeg tror X — passer det?”
- “Giv mig ét næste skridt, ikke hele løsningen.”

**Dårlige vaner**
- “Skriv hele funktionen for mig”
- “Ret hele filen”
- “Gør det bare”

Hvis Cursor begynder at tilbyde stor færdig kode: stop den.  
Sig: *“Forklar i stedet — jeg skriver selv i VS Code.”*

---

## 5. En simpel arbejdsrytme

1. Læs opgaven / pensum
2. Skriv eller ret i **VS Code**
3. Test
4. Sidder du fast i *hvorfor*? → spørg **Cursor**
5. Gå tilbage til VS Code og skriv selv
6. Kan du forklare det højt uden at kigge? Så er du videre

---

## 6. Gør det personligt

Udfyld med dig selv (2 minutter). Gem gerne i din logbog eller i en fil `mit-laeringsrum.md` i projektet.

**Mit læringsrum**
- Jeg åbner altid: _______________________
- Jeg spørger Cursor, når: _______________________
- Jeg spørger *ikke* Cursor, når: _______________________
- Et godt spørgsmål for mig lyder sådan: _______________________
- Efter hjælp skal jeg kunne: _______________________

---

## 7. Hurtig check før du går videre

- [ ] VS Code har ingen AI-extensions tændt
- [ ] Cursor har lærings-reglen under **Customize → Rules**
- [ ] Dit repo er cloned, og **samme mappe** er åben i begge
- [ ] Du kan pege på, hvilken kode **du** har skrevet i dag
- [ ] Du kan forklare mindst én ting, Cursor hjalp dig med at forstå

---

← [Forrige: Årsprøve](../10_AARSPROVE/README.md) · [Pensum](../PENSUM.md) · → [Næste: MQTT send & skift](../11_AAR_2_START/README.md)
