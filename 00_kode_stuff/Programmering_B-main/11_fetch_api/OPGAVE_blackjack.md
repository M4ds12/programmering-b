1. Gør `playerLose` færdig

Når spilleren går over 21, skal spillet skifte til resultatsiden og vise en ordentlig besked.



Pseudokode:



- hvis spillerens sum er over 21

- sæt resultattekst

- skift til side 2

2. Gør `Stand` og dealerens tur færdig

Når spilleren trykker `Stand`, skal dealerens skjulte kort vises, og dealerens tur skal starte.



Pseudokode:



- vis dealerens skjulte kort

- så længe dealer har under 17

- træk et nyt kort

- opdater dealerens sum

3. Afgør vinderen

Når dealerens tur er slut, skal spillet afgøre hvem der har vundet.



Pseudokode:



- hvis dealer er over 21, vinder spiller

- ellers hvis spiller > dealer, vinder spiller

- ellers hvis dealer > spiller, vinder dealer

- ellers er det uafgjort

4. Ret es-logikken

Et es skal kunne tælle som 11 eller 1, så en hånd ikke unødigt går bust.



Pseudokode:



- regn først alle es som 11

- mens summen er over 21 og der findes es

- træk 10 fra summen

- stop når summen er 21 eller mindre, eller der ikke er flere es

5. Gør resultatsiden færdig

Resultatsiden skal bruges både ved spillersejr, dealersejr og uafgjort.



Pseudokode:



- find resultattekst

- skriv teksten i `#result`

- skift til side 2



## Nice To Have



- vis spillerens aktuelle sum på skærmen

- vis dealerens synlige sum under spillet

- lav en tæller for wins, losses og draws

- tilføj animation når nye kort kommer ind

- gør designet mere casino-agtigt

- tilføj en regel for naturlig blackjack fra start



## Brug pseudokode aktivt



Når I sidder fast, så gør sådan her ved hvert punkt:



1. Skriv problemet i almindeligt sprog

Eksempel: "Dealeren skal trække kort indtil 17 eller mere."

2. Del det op i små trin

Eksempel:



- vis skjult kort

- regn total ud

- hvis under 17, træk igen

- ellers afslut turen

3. Oversæt ét trin ad gangen til JavaScript

Skriv ikke hele løsningen på én gang.

4. Test efter hvert lille trin

Brug `console.log()` til at tjekke `state`, `player.total`, `dealer.total` og indholdet af `player.cards` og `dealer.cards`.

5. Flyt gentaget logik til hjælpefunktioner

Hvis I opdager at I regner håndens værdi flere steder, så lav en funktion til det.