var currentPage = '#page4'
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

//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    console.log('P5 setup kaldt inshallah')
    
    //skift til current page 
    shiftPage(currentPage)

    //Vi opretter et array med firkantede paranteser
    var klassen2T = ["Balder", "Asta", "Viggo", "Bertram", "Tobias", "Selma", "Toke", "Victor"]
    

    //Hvor mange elementer?
    console.log(klassen2T.length, " elementer i listen")
    //Sådan bruger vi et element:
    console.log(klassen2T[0], ' er den første i listen') 
    //Sådan lægger vi nye elementer til 
    klassen2T.push("Mollie")
    klassen2T.push("Nikolaj")
    klassen2T.push("Mads")
    klassen2T.push("Lisbet")
    klassen2T.push("Asbjørn")
    klassen2T.push("Gilbert")
    klassen2T.push("Ludvig")
    klassen2T.push("John")
    klassen2T.push("Silas")
    klassen2T.push("Milas")
    klassen2T.push("Sebastian")
    klassen2T.push("Flóki")
    klassen2T.push("Amadeus")

    console.log(klassen2T, klassen2T.length)

    //Sådan looper vi igennem et array:
    klassen2T.map((e)=>{
        console.log('Denne person i klassen hedder ' + e)
    })


    //Page 2 - liste basics 
    //DOM BINDING 
    listeButton = select('#listeButton')
    listeHeader = select('#listeHeader')
    listeInput = select('#listeInput')
    listeContainer = select('#listeContainer')

    //der er et input felt en container og en knap til at tilføje nye elemnter på siden 
    createList(klassen2T, listeContainer, 'elev')

        //Sørg for at indsætte input value() når der trykkes på knappen
    listeButton.mousePressed( () => {
        if(listeInput.value() == ''){
            confirm('Du er blevet til ingenting')
        }else{
            klassen2T.push(listeInput.value())
            createList(klassen2T, listeContainer, 'elev')
            listeContainer.elt.scrollTop = listeContainer.elt.scrollHeight
        }
        listeInput.value('')
    })


    //Page 3 
    //DOM binding 
    removeListe = select('#removeListe')
    //make a list 
    var elements = ["hest", "dog", "hamster", "php", "cangaroo", "fuck", "subway sandwich", "group rat", "any bird"]
    //call the geneic function that makes new html elements 
    createList(elements, removeListe, 'removeVictim', removeListItem)




    //Page 4 - filter stuff (birds) 
    //DOM BINDING 
    var birdContainer = select('#birdContainer')
    var birdInp = select('#birdInp')
    createList(fugle, birdContainer, 'bird')
    birdInp.input(()=>{
        //console.log(birdInp.value())
        var filterBirds = fugle.filter( f => {
            return f.includes( birdInp.value() ) 
            //Er der inde i f (en eller anden fugl), det der er i input feltet?????
        } )
        //Nu er det nye array filterBirds fyldt med fugle der indeholder bogstaver fra input feltet
        if(filterBirds.length > 0){
            createList(filterBirds, birdContainer, 'bird')
        }else{
            var feedback = createElement('h2', "Bird not found")
            birdContainer.html("")
            birdContainer.child(feedback)
        }
    })

    
    //Sæt menu op
    //Hent alle sider som et array
    var allPages = selectAll('.page')
    //Løb listen igennem en for en 
    allPages.map(
       page => {
        //Lav et nyt <a> element 
        var menuItem = createElement('a')
        //Sæt a taggets html til sidens titel
        menuItem.html(page.attribute('title'))
        //sæt eventlistener på a tagget
        menuItem.mousePressed(
            () => shiftPage('#' + page.attribute('id'))
        )
        //sæt a tagget ind i sidebaren
        select('.sidebar').child(menuItem)
       }
    )

}

function shiftPage(newPage){
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}

//tager to argumenter - hvilken liste den skal gøre noget med og hvor den skal gøre af resultatet
function createList(list, dest, className, action){
    //Først søger vi for at der er tomt i containeren 
    dest.html('')
    list.map( (e, index) => {
        var div = createDiv(e)
        div.addClass(className)
        //Hvis der er en action i argrumenterne - så gør noget
        if(action){
            div.mousePressed(() => { 
                action(div, index, list)
            })
        }
        dest.child(div)

    })
}

function removeListItem(who, index, list){
    console.log('remove was called', who)
    who.style('background-image', `url("./assets/consent.jpg")`)
    setTimeout(()=>{
        list.splice(index, 1)
        createList(list, removeListe, 'removeVictim', removeListItem)
    }, 800)
}