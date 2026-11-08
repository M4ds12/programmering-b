// ------------------------------------------------------------------
// UNDERVISNINGS-MANUSKRIPT: ML & KNN (Chart.js Version)
// ------------------------------------------------------------------
// MÅL FOR TIMEN:
// 1. Indlæse data fra CSV
// 2. Rense data og konvertere til objekter
// 3. Visualisere data med Chart.js (Scatter plot)
// 4. Implementere KNN algoritmen (Afstand, Sortering, Afgørelse)
// ------------------------------------------------------------------

// -------------------------------------------------------------
// TRIN 1: GLOBALE VARIABLER OG INDSTILLINGER
// (Start her: Vi skal definere hvad vores program skal kunne huske)
// -------------------------------------------------------------
var table           // Her gemmer vi den rå CSV fil fra p5's loadTable
var data = []       // Her gemmer vi vores rensede data (objekter med x, y, label)
var myChart         // Her gemmer vi selve graf-objektet fra Chart.js

// INDSTILLINGER FOR DATA
var filename = 'assets/IRIS.csv'
var colX = 'petal_length'     // X-aksen: Variabel 1 (input)
var colY = 'petal_width'      // Y-aksen: Variabel 2 (input)
var colLabel = 'species' // Facit: Hvilken gruppe hører man til?

// GUI Overskrifter (Gør det pænt for brugeren)
var mainTitle = "Iris Species Predictor"
var sectionTitle1 = "1. Indtast dine tal"
var instructionText = "Angiv Bladets længde og bredde:"
var sectionTitle2 = "2. Se Resultat i Grafen"

// Farver til vores grupper (Labels) - Chart.js bruger disse
var colorList = ['red', 'rgb(55, 193, 47)', 'blue', 'orange', 'purple', 'cyan', 'magenta', 'teal']

function preload() {
    // Indlæs data fil før programmet starter
    table = loadTable(filename, 'csv', 'header')
}

function setup() {
    // 0. SÆT TITLER I HTML
    select('#main-header').html(mainTitle)
    select('#section-1-title').html(sectionTitle1)
    select('#instruction-text').html(instructionText)
    select('#section-2-title').html(sectionTitle2)
    select('#label-x').html(colX)
    select('#label-y').html(colY)

    // -------------------------------------------------------------
    // TRIN 2: RENS DATA
    // (Forklar: Vi konverterer tekst-rækker til rigtige Javascript-objekter)
    // -------------------------------------------------------------
    var rows = table.rows
    rows = shuffle(rows).slice(0, 150) // Vi begrænser til 150 punkter for hastighedens skyld
    // - at begrænse til 150 gør ikke noget i dette tilfælde, da jeg kun har 150 punkter

    data = rows.map(row => {
        // Hent værdier fra de kolonner vi valgte i toppen
        // HUSK: Alt fra CSV er tekst, så vi bruger Number() til tallene
        var x = Number(row.get(colX))
        var y = Number(row.get(colY))
        var label = row.get(colLabel)
        
        // Tjek om data er gyldig (ikke NaN og har en label)
        if (!isNaN(x) && !isNaN(y) && label) {
            return { x, y, label }
        }
    }).filter(p => p) // Fjern tomme pladser i arrayet

    console.log("Data klar:", data.length, "punkter")
    console.log(data, "her er det færdige array")

// -------------------------------------------------------------
// TRIN 3: FORBERED CHART.JS DATASETS
// (Forklar: Chart.js vil have data delt op i grupper baseret på label)
// -------------------------------------------------------------

    // Nu skal vi forberede data til at blive vist med chart.js
    // Vi skal have fat i de unikke labels for hver gruppe i data
    var uniqueLabels = []
    data.map( point => {
        //vi kigger på punktets label. HVIS vi ikke har set det label før, så må det være et UNIKT nyt et
        if(!uniqueLabels.includes(point.label)){
            uniqueLabels.push(point.label)
        }
    })
    console.log("vi kiggede alle punkter igennem og fandt disse labels", uniqueLabels)
    //Man kunne sortere labels alfabetisk
    //uniqueLabels.sort()

    //omdan data til grupper ud fra de forskellige labels
    var datasets = uniqueLabels.map( (label, index) => {
        //FILTER funktionen giver os en gruppe med et bestemt LABEL
        var groupData = data.filter( point => {
            return point.label == label
        })
        var col = colorList[index]

        //returner den FÆRDIGE gruppe med alle datapunkterne for hvert label til DATASETS
        return{
            label: label,
            data: groupData,
            backgroundColor: col,
            pointRadius : 5,
            pointHoverRadius: 8
        }
    } )

    //den starter med standartpunktet {0, 0}
    datasets.push({
        label: "Dit Gæt",
        data: [{ x: 0, y: 0}],
        pointStyle: "crossRot",
        pointRadius: 12,
        backgroundColor: "black",
        borderColor: "black",
        borderWidth: 4
    })

    console.log("Så fik vi lavet dataset grupperne", datasets)


    // -------------------------------------------------------------
    // TRIN 4: OPRET GRAFEN
    // (Forklar: Vi konverterer tekst-rækker til rigtige Javascript-objekter)
    // -------------------------------------------------------------
    //ctx (context) peger på <canvas id="chartCanvas"> i HTML
    //chart.js bruger dette canvas til at tegne alle punkter
    const ctx = document.getElementById("chartCanvas");

    // new Chart(...) opretter selve graf-objektet og gemmer det i myChart,
    // så vi senere kan opdatere grafen (fx når brugeren gætter).
    myChart = new Chart(ctx, {
        //type "scatter" = punktdiagram i 2D (x,y)
        type: "scatter",
        //datasets er de grupper vi byggede ovenfor (en pr. label + "Dit gæt")
        data: {datasets:datasets},
        options: {
            //scales styrer akserne (navne, visning, min/max mm.)
            scales: {
                //x-akse titel hentes dynamisk fra variablen colX
                x:{title:{display:true,text:colX}},
                //y-akse titel hentes dynamisk fra variablen colY
                y:{title:{display:true,text:colY}},
            }
        }
    });
    //start op GUI funktionalitet (knapper og sliders)
    setupControls()
}    

// -------------------------------------------------------------
// GUI OPSÆTNING (Ekstra / Hjælpefunktioner)
// -------------------------------------------------------------

function setupControls(){
    //1. find alle x- og y-værdier i datasættet
    //vi bruger dem til at beregne slidernes interval
    //det her betyder map data arrayet og returnerer alle point.x værdier
    var xValues = data.map(point => point.x)
    var yValues = data.map(point => point.y)

    //2. beregm mindste og største værdi på hver akse.
    var minX = Math.min(...xValues)
    var maxX = Math.max(...xValues)
    var minY = Math.min(...yValues)
    var maxY = Math.max(...yValues)

    //3. hent HITML-elementerne til x- og y-slider
    var xSlider = select("#input-x")
    var ySlider = select("#input-y")

    console.log("her er min og max værdi", minX, minY, maxX, maxY)

    //4. konfigurer x-slideren ud fra dataens min/max
    xSlider.attribute("min", Math.floor(minX))
    xSlider.attribute("max", Math.ceil(maxX))
    xSlider.attribute("step", (maxX - minX) / 100)
    xSlider.value((minX + maxX) / 2)

    //5. konfigurer y-slideren ud fra dataens min/max
    ySlider.attribute("min", Math.floor(minY))
    ySlider.attribute("max", Math.ceil(maxY))
    ySlider.attribute("step", (maxY - minY) / 100)
    ySlider.value((minY + maxY) / 2)

    //6. når x-slider flyttes, opdaterer teksten ved siden af slideren.
    xSlider.input( () => select("#val-x").html(xSlider.value() ))
    
    //7. når y-slider flyttes, opdaterer teksten ved siden af slideren.
    ySlider.input( () => select("#val-y").html(ySlider.value() ))

    //8. når K-slider flyttes, opdater visningen af k-værdien.
    var kSlider = select("#k-slider")
    kSlider.input(() => select("#k-value").html(select("#k-slider").value()))

    //9. når brugeren trykker på knappen, kører vi klassifikering.
    select("#predict-btn").mousePressed(classifyUnknown)

    //10. vis startværdien i UI med det samme.
    select("#val-x").html(xSlider.value())
    select("#val-y").html(ySlider.value())

}
// -------------------------------------------------------------
// TRIN 5: KNN ALGRORITMEN (Nearest Neighbour)
// (Dette sker når man trykker på knappen)
// -------------------------------------------------------------

function classifyUnknown(){ //klassificer ukendt data
    // 1. aflæs input fra sliderne
    var inputX = Number(select("#input-x").value())
    var inputY = Number(select("#input-y").value())

    //2. opdater grafen med det nye punkt
    // Det sidste dataset er "Dit Gæt"
    // indsæt punktet fra sliderne i grafen
    var guessDataset = myChart.data.datasets[myChart.data.datasets.length -1]
    guessDataset.data = [{x:inputX, y: inputY}]

    //3. beregn afstande fra input-punktet til ALLE punkter i data
    // løb data igennem - altså ALLE datapunkterne - og find hver og ens afstand til vores gæt
    //vi bruger map til at skabe en NY liste hvor hvert punkt har en .distance
    //parameteret "p" står for point
    data = data.map(p => {
        //pythagoras på 2D: dist(x1, y1, x1, y1)
        //dist ligger i p5.js og den laver pythagoras for os
        //inputX og inputY er det nye punkt, og p.x og p.y er de allerede punkter
        p.distance = dist(inputX, inputY, p.x, p.y)
        return p
    })

    //uni.log(data)

    //4. sorter data så de mindste afstande til  kommer først
    //den som vi returnerer først er den med korteste disance
    //sort (a,b) => tag hvert åunkt og sammenlign deres distance og sæt den mindste forrest
    data.sort((a, b) => a.distance - b.distance)

    //5. find de K nærmeste naboer
    //spørg [k] nærmeste hvilken gruppe de hører til
    var k = Number(select("#k-slider").value())
    //hvis k=11(vi vælger tætteste 11 naboer), tager den alle punkterne fra 0 -> 11
    //neighbours er nu de første k elementer i data arrayet
    var neighbors = data.slice(0, k)

    //6. Tæl stemmer (voting)
    //de stemmer om resultatet og vinderen er fundet
    //votes er et tomt objekt
    var votes = {}
    neighbors.map(n => {
        //Hvis vi IKKE har set denne label før, opretter vi den med 0 stemmer.
        //vi kigger nu på hvert punkts label
        //er det et nyt label for os, er vi nødt til at sætte dets værdi tul nul. Ellers kan vi ikke lægge point til bagefter
        if (votes[n.label] === undefined) {
            votes[n.label] = 0
        }
        //Læg én stemme til den label naboen tilhører
        votes[n.label] += 1
    })
    //7. Find vinderen (den label med flest stemmer)
    //vi laver først en liste over alle labels, der har fået stemmer.
    //Object.keys giver os navnene på nøjlerne i et objekt, i dette tilfælde er det jo vores label
    var allLabels = Object.keys(votes)

    console.log(votes)

    //Start med at antage at første label er vinderen.
    var winner = allLabels[0]

    // Gå gennem alle labels med map og find den med flest stemmer.
    // løb alle labelsne igennem og se hvem der så virkelig er vinderen
    // Det er helt fint at første label bliver sammenlignet med sig selv.
    allLabels.map( l => {   // "l" er vores currentLabel
        // Hvis currentLabel har flere stemmer end nuværende winner,
        // så bliver currentLabel den nye winner.
        if (votes[l] > votes[winner]) {
            winner = l
        }
    })
    
    //
        console.log("Stemmer:", votes, "Vinder:", winner)

    // 8. Vis resultatet til brugeren
    select('#winner').html(winner)

    // VIGTIGT: Opdater grafen for at vise det nye punkt
    myChart.update()
}


    