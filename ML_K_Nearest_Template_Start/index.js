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
var filename = 'assets/Algerian_forest_fires_dataset_CLEANED.csv'
var colX = 'Temperature'     // X-aksen: Variabel 1 (input)
var colY = 'RH'      // Y-aksen: Variabel 2 (input)
var colLabel = 'FWI' // Facit: Hvilken gruppe hører man til?

// GUI Overskrifter (Gør det pænt for brugeren)
var mainTitle = "Burnout Risk Predictor"
var sectionTitle1 = "1. Indtast dine tal"
var instructionText = "Angiv antal pauser og søvntimer:"
var sectionTitle2 = "2. Se Resultat i Grafen"

// Farver til vores grupper (Labels) - Chart.js bruger disse
var colorList = ['red', 'green', 'blue', 'orange', 'purple', 'cyan', 'magenta', 'teal']

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
    rows = shuffle(rows).slice(0, 1000) // Vi begrænser til 1000 punkter for hastighedens skyld

    data = rows.map(row => {
        // Hent værdier fra de kolonner vi valgte i toppen
        // HUSK: Alt fra CSV er tekst, så vi bruger Number() til tallene
              var x = Number(row.get(colX))
        var y = Number(row.get(colY))
        var label
        var FWI = row.get(colLabel)
        if(FWI == 0){
            label = "no-fire"
        }else if(FWI > 0 && FWI < 10 ){
            label = "low fire"
        }else if(FWI > 10 && FWI < 20 ){
            label = "medium fire"
        }else if(FWI > 20){
            label = "high fire"
        }
        
        // Tjek om data er gyldig (ikke NaN og har en label)
        if (!isNaN(x) && !isNaN(y) && label) {
            return { x, y, label }
        }
    }).filter(p => p) // Fjern tomme pladser i arrayet

    data = data.filter( p => p.x > 0 && p.y > 0)
    //data = data.filter(p => p.label !== "no fire")

    console.log("Data klar:", data.length, "punkter")


    var uniqueLabels = []
    data.map (point => {
        if (!uniqueLabels.includes(point.label)){
            uniqueLabels.push(point.label)
        }
    })
    console.log("vi kiggede alle disse punkter igennem og fandt unikke labels")
    //Man kunne også sortere labels alfabetisk
    //uniqueLabels.sort()
    var ønsketRækkefølge = ["no-fire", "low fire", "medium fire", "high fire"]
    uniqueLabels.sort((a, b) => ønsketRækkefølge.indexOf(a) - ønsketRækkefølge.indexOf(b))


    //omdan data til grupper ud fra de forskellige labels
    var datasets = uniqueLabels.map((label, index) =>{
        //Filter  funktionen giver os en gruppe med et bestemt label
        var groupData = data.filter( point => {
            point.label == label
            return point.label == label
        })
        var col = colorList[index]

        //returner den færdige gruppe med alle datapunkterne for hvert label til hvert dataset
        return{
            label:label, 
            data: groupData,
            backgroundColor: col,
            //Punkter laves af størrelsen 5
            pointRadius: 5,
            //punkt bliver større når man går over det, altså når man hover over det
            pointHoverRadius: 8
        }
    })

    //Nu indsætter vi et enkelt datasæt med brugerens gæt
    datasets.push({
        label: "Dit gæt",
        //data:[{x:0, y:0,}],
        data:[],
        //feature i chart.js bibliotek
        pointStyle:"crossRot",
        pointRadius: 12,
        backgroundColor: "black",
        borderColor: "black",
        borderWidth: 4

    })

    console.log("Så fik vi lavet dataset grupperne", datasets)
    /*
    hej Simon
    hej igen Simon
    */
    //Vi vil nu oprette grafen med chart.js
    const canvasChart = document.getElementById("chartCanvas")
    //Så bliver der skrevet noget objekt orienteret kodning
    myChart = new Chart(canvasChart, {
        //skatter er et punktdiagram i 2d (x,y)
        type: "scatter",
        data: { datasets:datasets },
        options:{
            //scales styrer hvad x og y akserne hedder
            scales:{
            x:{title:{display:true, text:colX}},
            y:{title:{display:true, text:colY}}
            }
        }
    })
    setupControls()
}

function setupControls(){
    //1) Find alle x og y værdierne i dataet
    //2) FORDI vi skal bruge dem til at bestemme hvad de der sliders skal gå fra og til
    //det her betyder map data arrayet og returner alle point.x værdier
    var xValues = data.map( point => point.x)
    var yValues = data.map( point => point.y)
    //Beregn mindste og største værdier
    var minX = Math.min(...xValues)
    var minY = Math.min(...yValues)
    var maxX = Math.max(...xValues)
    var maxY = Math.max(...yValues)
    console.log(minX, minY, maxX, maxY, "her er min og max for alt data. minX, minY, maxX, maxY")

    var xSlider = select("#input-x")
    var ySlider = select("#input-y")
    //attribute er en p5 funktion. Floor runder en værdi ned
    xSlider.attribute("min", Math.floor(minX))
    xSlider.attribute("max", Math.ceil(maxX))
    xSlider.value(minX + maxX /2)
    ySlider.attribute("min", Math.floor(minY))
    ySlider.attribute("max", Math.ceil(maxY))
    ySlider.value(minY + maxY /2)

    //Input er sliderens "on change" event, altså når den flyttes kaldes input funktionen
    xSlider.input( ()=> select("#val-x").html(xSlider.value())) 
    ySlider.input( ()=> select("#val-y").html(ySlider.value())) 

    select("#val-y").html(ySlider.value())
    select("#val-x").html(xSlider.value())
    //DOM Binding til k-slider
    var kSlider = select("#k-slider")
    kSlider.input(()=> select("#k-value").html (kSlider.value()))
    select("#predict-btn").mousePressed(classifyUnknown)

    console.log(data)
   
}

function classifyUnknown(){
    //vi har tænkt os at aflæse værdierne fra sliderne  og gem dem i 2 variabler
    //Indsæt punktet fra sliderne i grafen
    //Løb data igennem -altså ALLE datapunkterne, og find hver og ens afstand til vores gæt
    //Så sorterer vi dem så dem med mindst afstand til gættet kommer først
    //Spørg de forskellige [k] nærmeste hvilken gruppe de hører til 
    //De stemmer om resultatet og vinderen er fundet
    //Vis i resultat feltet hvilken klasse/label som gættet tilhører

}
