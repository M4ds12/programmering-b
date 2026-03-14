var currentPage = '#page1'

// Array med filnavne på vores billeder - hvert billede står der to gange så vi kan få par
var images = [
    "assets/bambirhino.jpg", "assets/cropcoptub.jpg", "assets/dogtiger.jpg", "assets/elephorse.jpg",
    "assets/foxmockingbird.jpg", "assets/hamsterfinger.jpg", "assets/owlbear.jpg", "assets/rhinelephant.jpg",
    "assets/sealhorse.jpg", "assets/zeacat.jpg",
    "assets/bambirhino.jpg", "assets/cropcoptub.jpg", "assets/dogtiger.jpg", "assets/elephorse.jpg",
    "assets/foxmockingbird.jpg", "assets/hamsterfinger.jpg", "assets/owlbear.jpg", "assets/rhinelephant.jpg",
    "assets/sealhorse.jpg", "assets/zeacat.jpg"
]
var wordList = [
    "Haack", "Rico", "Simon Moe", "Martin",
    "Programmering", "Kemi", "Idehistorie", "Teknologi",
    "Deadlock", "Overwatch", "Terraria", "Outlast",
    "Guldhammer", "Halloweenfest", "Fredagscafe", "Galla"
]
//KMG Lærere, B fag, Videospil, KMG Begivenheder
//Mine valgte ord. Skal genstarter efter 4 ord rammes
var pickedWords = []
//En liste af de 4 korrekte rækker med de fire korrekte ord
//Hvad vil jeg gøre med det  her objekt? Jeg vil gerne gøre så når en connection oprettes, sættes forbindelsen
//med den række af ord først. Her skal stå forbindelsen
var correctConnections = {
    firstConnection: {
        connectionTitle: "",
        connectionWords: []
    },
    secondConnection: {
        connectionTitle: "",
        connectionWords: []
    },
    thirdConnection: {
        connectionTitle: "",
        connectionWords: []
    },
    fourthConnection: {
        connectionTitle: "",
        connectionWords: []
    }
}
//Der skal også være et farve objekt under title og words. Gør det senere
var validConnections = [
    {
        connectionTitle: "Lærere på KMG",
        connectionWords: ["Haack", "Rico", "Martin", "Simon Moe"]
    },
    {
        connectionTitle: "B-Fag",
        connectionWords: ["Programmering", "Kemi", "Idehistorie", "Teknologi"]
    },
    {
        connectionTitle: "Videospil",
        connectionWords: ["Deadlock", "Overwatch", "Terraria", "Outlast",]
    },
    {
        connectionTitle: "Begivenheder på KMG",
        connectionWords: ["Guldhammer", "Halloweenfest", "Fredagscafe", "Galla"]
    }
]
connectionFarver = ["Green", "Purple", "Hotpink", "Yellow"]
var attempts = 5
//correctConnections[0].connectionTitle.push()

//Når en connection formes, skal 4 ord tilsvarende til den connection fjernes,
// og objektet med den connection skubbes forrest i listen

function setup() {
    noCanvas() // Vi bruger HTML elementer, så vi behøver ikke et canvas   
    shiftPage(currentPage) // Skift til startsiden
    select("#startGame").mousePressed(() => {
        setupGame()
    })
}




function setupGame() {
    var attemptsContainer = select("#attempts")
    for (var i = 0; i < attempts; i++) {
        var circle = createDiv()
        circle.addClass("circle")
        attemptsContainer.child(circle)
    }
    //Jeg blander ordene med shuffle
    wordList = shuffle(wordList)
    console.log(wordList, "ordliste")
    //DOM Binding til spilcontaineren
    var container = select("#gameContainer")
    //Action, det fjerde argument, skal være vores mousepressed handling.
    createList(wordList, container, "words", vælgOrd)
    shiftPage("#page2")






    function createList(list, dest, className, action) {
        //Først søger vi for at der er tomt i kontaineren
        dest.html("")

        Object.values(correctConnections).map((m, index) => {
        if (m.connectionWords.length > 0) {
            var box = createDiv()
            box.addClass("matchedKasse")
            box.style("background-color", connectionFarver[index])
            box.child(createElement("h3", m.connectionTitle))
            box.child(createElement("p", m.connectionWords.join(", ")))
            dest.child(box)
        }
    })
    

        list.map((e, index) => {
            var div = createDiv(e)
            div.addClass(className)
            //Hvis der er en action i argumenterne så gør noget
            if (action) {
                div.mousePressed(() => {
                    action(div, index, list)
                })
            }


            dest.child(div)

        })
    }

    /*
    function removeListItem(who, index, list){
        console.log('remove was called', who)
        who.style('background-image', `url("./assets/consent.jpg")`)
        setTimeout(()=>{
            list.splice(index, 1)
            createList(list, removeListe, 'removeVictim', removeListItem)
        }, 800)
    }
    */

    function vælgOrd(div, index, list) {
        if (pickedWords.includes(list[index])) {
            pickedWords = pickedWords.filter(e => e !== list[index])
            div.removeClass("highlighted")
        }

        else if (pickedWords.length < 4) {
            pickedWords.push(list[index])
            div.addClass("highlighted")
            console.log(pickedWords, "picked words")
        }
        if (pickedWords.length == 4) {
            var sortedPicked = [...pickedWords].sort()
            console.log(sortedPicked, "sorterede array")

            var match = validConnections.find((p) => {
                var sortedValid = [...p.connectionWords].sort()
                return JSON.stringify(sortedPicked) === JSON.stringify(sortedValid)

            })
            if (match) {
                var emptyKey = Object.keys(correctConnections).find(k => correctConnections[k].connectionWords.length === 0)
                correctConnections[emptyKey].connectionTitle = match.connectionTitle
                correctConnections[emptyKey].connectionWords = match.connectionWords
                console.log(pickedWords, "picked words er nået maks længde", "Gættet er korrekt")
                wordList = wordList.filter(e => {
                    return !sortedPicked.includes(e)
                })
                pickedWords = []
                console.log(wordList, "ordliste")
                createList(wordList, container, "words", vælgOrd)
                console.log(correctConnections, "correctConnections")
            } else {
                attempts -=1
                circles = selectAll(".circle")
                circles[attempts].remove()
                console.log(pickedWords, "Gættet er forkert", attempts, "forsøg tilbage")
                pickedWords = []
                match = false
                highlighted = selectAll(".highlighted")
                highlighted.map(p => {
                    p.removeClass("highlighted")
                })
                
            }
            if(wordList == 0 && attempts > 0 ){
                console.log("you win")
            }
            if (attempts == 0){
                console.log("You lose")
            }
        }
    }

}


// Funktion til at skifte mellem sider (skjuler den gamle, viser den nye)
function shiftPage(newPage) {
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}
/*function setupGame(){
    //Lad os blande kortene. Jeg bruger p5 funktionen shuffle, 
    //som tager fat i arrayet og blander det
    images = shuffle(images)
    //console.log(images)
    images.map( i => {
        //vi laver en DOM binding til spil containeren
        var container = select("#gameContainer")
        //opret spillekort
        var card = createElement("div").addClass("card").attribute("class", i).parent(container).child(createImg(i)).mousePressed(()=>{
            if (pickedWords.length < 4) {
            card.addClass("show")
            pickedWords.push(card)
            //hvis der er to kort i flippedCards, skal vi tjekke match
            if(pickedWords.length == 4){
                console.log(pickedWords)
                
                if(pickedWords[0].attribute("class") === pickedWords[1].attribute("class") === pickedWords[2].attribute("class") === pickedWords[3].attribute("class")){
                    //VI HAR ET MATCH
                pickedWords[0].addClass("checked")
                pickedWords[1].addClass("checked")
                }
                else{
                setTimeout(()=>{
                    pickedWords[0].removeClass("show")
                    pickedWords[1].removeClass("show")
                    pickedWords = []
                },2000)
                
                }
            }
             }
        })
    })
    shiftPage("#page2")
}*/
