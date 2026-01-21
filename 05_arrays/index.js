//Globale variabler
var currentPage = "#page3" //Hvilken side er aktiv
var listeInput, listeHeader, listeButton, listeContainer
var removeListe 
const fugle = [
  "solsort","musvit","blåmejse","skovspurv","gråspurv","bogfinke","grønirisk",
  "stillits","dompap","gærdesmutte","rødhals","sjagger","ringdue","bydue",
  "hættemåge","sildemåge","svartbag","stormmåge","gråkrage","råge","allike",
  "skade","husskade","nøddekrige","hærfugl","isfugl","svalehale","landsvale",
  "bysvale","digesvale","tornsanger","munk","gransanger","løvsanger",
  "rørsanger","sivsanger","havesanger","gulspurv","rørspurv","snespurv",
  "korttået lærke","sanglærke","toplærke","bomlærke","piber","engpiber",
  "skovpiber","bjergpiber","hvid vipstjert","gul vipstjert","citronvipstjert",
  "vintergærdesmutte","sortstrubet bynkefugl","stenskvæt","buskskvæt",
  "sortstrubet bynkefugl","nattergal","blåhals","rødstjert","husrødstjert",
  "broget fluesnapper","grå fluesnapper","lille fluesnapper",
  "sortmejse","topmejse","sortstrubet mejse","fyrremejse","sumpmejse",
  "skægmejse","halemejse","pirol","silkehale","tornirisk","bjergirisk",
  "lille korsnæb","stor korsnæb","hvidvinget korsnæb","kernebider",
  "spurvehøg","duehøg","musvåge","fjeldvåge","hvepsevåge","rørhøg",
  "blå kærhøg","rød glente","sort glente","havørn","kongeørn",
  "tårnfalk","lærkefalk","jagtfalk","vandrefalk","slørugle",
  "natugle","skovhornugle","hornugle","kirkeugle","spurveugle",
  "perleugle","hjejle","stor regnspove","lille regnspove","brushane",
  "rødben","sortklire","grønbenet rørhøne","hvidklire","mudderklire",
  "dobbeltbekkasin","enkeltbekkasin","tinksmed","klyde","præstekrave",
  "stor præstekrave","hjejle","strandskade","tejst","alk","lomvie",
  "søkonge","lunde","skarv","topskarv","silkehejre","fiskehejre",
  "rørdrum","sort stork","hvid stork","trane","blishøne","vandrikse",
  "rørhøne","knopsvane","sangsvane","pibesvane","gråand","krikand",
  "skeand","spidsand","atlingand","hvinand","troldand","toppet skallesluger",
  "lille skallesluger","stor skallesluger","ederfugl","havlit",
  "sortand","fløjlsand","bjergand","kongeederfugl","rødhalset lom",
  "sortstrubet lom","hvidnæbbet lom"
]


function preload(){
    
}


//P5 Setup() bliver kaldt EN gang før siden vises
function setup() {
    console.log("P5 setup kaldt")




    //Sæt menu op
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
    //vi opretter et array med firkantede parenteser
    var klassen2T = [ "Balder", "Asta", "Viggo", "Victor", "Silas", "Milas", "Selma", "Lisbet", "Ludvig", "Toke", "Nikolaj"
    ]


     //Hvor mange elementer i listen
     console.log(klassen2T.length)
     //Sådan bruger vi et
    console.log(klassen2T[0]), "er den første i listen"
    //Sådan lægger vi nye elementer til
    klassen2T.push("Mollie")

    console.log(klassen2T, klassen2T.length)
    klassen2T.map((e)=>{
        console.log("denne person hedder " + e)
    })
   
     //page 2 -liste basics
     //DOM BINDNGS
     listeButton = select("#listeButton")
     listeInput = select("#listeInput")
     listeHeader = select("#listeHeader")
     listeContainer = select("#listeContainer")
    //der er et input felt en container og en knap til at filføje nye elementer på siden
     createList(klassen2T, listeContainer)


     //page3
     //dom binding
     removeListe = select("#removeListe")
    //make a list
    var elements = ["hest", "dog","hamster", "php", "kangaroo", "fuck", "subway sandwich", "group rat", "bird"]
    //call the generic function thatr makes new html elements
    createList(elements, removeListe, "removeVictim", removeListItem)



    //page 4 - filter stuff (birds)
    //DOM BINDING
    var birdContainer = select("#birdContainer")
    var birdInp = select("#birdInp")
    createList(fugle, birdContainer, "bird")
    birdInp.input(()=>{
        //console.log(birdInp.value())
        var filterBirds = fugle.filter( f => {
            return f.includes(birdInp.value())
            //Er der inde i f (en eller anden fulg), det der er i input feltet????

        })
        //Nu er det nye array filterBirds fyldt med fugle der indeholder bogstaver fra input feltet
        createList(filterBirds, birdContainer, "bird")
        if(filterBirds.length > 0) {
            createList(filterBirds, birdContainer, "bird")}
            else{
            var feedback = createElement("h2", "bird not found!")
            birdContainer.html = ("")  
            birdContainer.child(feedback)
            }

    })
    


    //sørg for at indsætte nye elever, særligt astrid, når der trykkes på knappen
    listeButton.mousePressed(() => {
    if(listeInput.value() == ""){
    confirm("du er blevet til ingenting")
    }else{
         klassen2T.push(listeInput.value())
        createList(klassen2T, listeContainer)
        listeContainer.elt.scrollTop = listeContainer.elt.scrollHeight
    }
    listeInput.value("")
     })

     

    //skift til current page
    shiftPage(currentPage);

     allPages.map(
        page => {
            //Lav et nyt "a" element
            var menuItem = createElement("a")
            //Sæt a taggets html til sidens titel
            menuItem.html(page.attribute("title"))
            //sæt a tagget ind i sidebaren
            select(".sidebar").child(menuItem)
            //sæt event listener på a tagget
            menuItem.mousePressed(
                ()=>{
                    shiftPage("#" + page.attribute("id"))
                }
            )
        }
   )


    
}

function shiftPage(newPage){
    select(currentPage).removeClass("show")
    select(newPage).addClass("show")
    currentPage = newPage;
}
//tager to argumenter - hvilken liste den skal gøre noget med og hvor den skal gøre af resultatet.
function createList(list, dest, className, action){
   //Først søger vi for at der er tomt i kontaineren
    dest.html("")
    list.map( (e, index) => {
        var div = createDiv(e)
        div.addClass(className)
        //Hvis der er en action i argumenterne så gør noget
        if(action){
            div.mousePressed(()=>{
                action(div, index, list)
            })
        }
        
        
        dest.child(div)
     })
}

function removeListItem(who, index, list){
console.log("Remove item was called", who)
who.style("background-image", `url("./assets/consent.png")`)
who.style("background-size:cover",)
setTimeout(()=>{
list.splice(index, 1)
createList(list, removeListe, "removeVictim", removeListItem)
}, 800)

}