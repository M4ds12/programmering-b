//Globale variabler
var currentPage = "#page3" //Hvilken side er aktiv
var listeInput, listeHeader, listeButton, listeContainer
var removeListe 

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
    createList(elements, removeListe, "rapeVictim", rape)

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
    list.map( e => {
        var div = createDiv(e)
        div.addClass(className)
        //Hvis der er en action i argumenterne så gør noget
        if(action){
            div.mousePressed(()=>{
                action(div)
            })
        }
        
        
        dest.child(div)
     })
}

function rape(who){
console.log("Sebastian was raped", who)
who.style("background-image", `url("./assets/consent.png")`)
who.style("background-size:cover",)
}