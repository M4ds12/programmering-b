// ============================================
// STATES
// ============================================
var currentPage = '#start'
var gameState = 0
var timerInterval = null
var seconds = 0
var buttonState = 0


// inventory og items
var invCrowbar = document.getElementById("invCrowbar")
var invKnife = document.getElementById("invKnife")

//laver to "events". Hvis man får crowbar, bliver crowbar = true. Heraf kan der ske specifikke funktioner hvis crowbar = true
var crowbar = false
var kniv = false
var knivSlibet = false

// Rum 1: antal fundne symboler
var doorsFound = 0
var crowbarsFound = 0

// Rum 1.2: rigtig rækkefølge og tæller
//rækkdefølgen af låse in order
var låsAnswer = ['lås1', 'lås3', 'lås2']
var låsStep = 0

// Rum 2: Ovn
// det button som har imput felt hvor man finder kniv
// ja, ovnen var en del af baggrundsbilleded.
const ovn = document.getElementById("ovn")

// Rum 3: stue
var crushed = false

// Rum 4: skuret
var symbolsFound = 0

// Rum 5: køleskabet - mingame
var game_container = null
var points_display = null
var time_display = null
var points = 0
var time_left = 10


// Firestore reference
var scoresRef = db.collection('highscores')

// ============================================
// SETUP — kaldes én gang af p5.js
// ============================================
function setup() {

    noCanvas()
    shiftPage('#start')
    loadHighScores()

    //vi skjuler crowbar og knife ikonerne
    invCrowbar.hidden = true
    invKnife.hidden = true



    // ============================================
    // BUTTONS — de forskellige knapper til shiftpage, gåder og andre funktioner
    // ============================================

    // ---- STARTSIDE ----
    select('#btn-start').mousePressed(() => {
        if(confirm("HAR DU LÆST FORKLARINGERNE MED RØD SKRIFT?")){
            startGame()
        }else{
            return
        }
    })

    // ---- RUM 1: Kælder med boxes ----
    //3 låse på døren, tryk i rigtig rækkefølge
    select('#room1 #woodenBox').mousePressed(() => {
        findCrowbar('#room1 #woodenBox')
        crowbar = true//crowbar er fundet, nye funktioner kan nu bruges
        invCrowbar.hidden = false //crowbar vises i invetaret
    })

    select('#room1 #symbolDoor').mousePressed(() => {
        if(crowbar == true){//hvis man har fundet crowbar
            findDoor('#room1 #symbolDoor')//tryk på dør
            setTimeout(() => {
                shiftPage("#room1Door")
            }, 500);
        }
    })

    // RUM 1 - kælderen
    //dørs låse
    select('#room1Door #lås1').mousePressed(() => clickLås('lås1'))
    select('#room1Door #lås2').mousePressed(() => clickLås('lås2'))
    select('#room1Door #lås3').mousePressed(() => clickLås('lås3'))
    // ---- buttons - shiftpage ---- 

    select('#room1 #køkkenBtn1').mousePressed(() => { shiftPage("#room2") })
    select('#room1 #symbolDoorOpen').mousePressed(() => { shiftPage("#room2") })

    
    // RUM 2 - køkkenet
    //Ovn gåde
    select('#room2 #ovnBtn').mousePressed(() => { //tryk på ovn
        if(buttonState < 1){ //hvis buttonState er under 1, return. Hvis buttonState > 1, kør kode
            return
        }
        select('#room2 #room2-code').addClass('show')
    })
    //ovn gåden, submit answer
    select('#room2 #room2-submit').mousePressed(() => { checkRoom2Answer() })

    // ---- buttons - shiftpage ----
    select('#kælderBtn2').mousePressed(() => { //går fra køkken til stuen
        shiftPage("#room1")
        //når vi går fra køkken tilbage til kælder, vises et nyt button.
        //dette button kan gå fra kælder ti køkken, da døren teknsik sert er åben.

        select('#room1 #køkkenBtn1').addClass("visible")
        select('#room1 #køkkenBtn1').removeClass("hidden")
        select('#room1 #symbolDoorOpen').addClass("visible")
        select('#room1 #symbolDoorOpen').removeClass("hidden")
        select('#room1 #symbolDoorOpenBg').addClass("visible")
        select('#room1 #symbolDoorOpenBg').removeClass("hidden")
        
    })
    select('#stueBtn2').mousePressed(() => { //går fra køkken til stuen
        shiftPage("#room3")
        if (kniv == true) {//hvis kniv er fundet
            select('#room3 #room3-hint1').removeClass("visible")
            select('#room3 #room3-hint1').addClass("hidden")
            select('#room3 #room3-hint2').removeClass("hidden")
            select('#room3 #room3-hint2').addClass("visible")

        }
    })
    

    // RUM 3 - Stuen

    select('#monster').mousePressed(() => { 
        //her kan selve id="#monster" div'en trykkes på uden brug af button(i modsætning til ovnen i room2)
        //da en div kan have "hitbox" på samme måde som et button.
        if(knivSlibet != true){ // hvis buttonState ikke er 1, eller er under, vil resten af funktionen ikke køre.
            return
        }
        select('#room3 #room3-hint3').removeClass("visible")
        select('#room3 #room3-hint3').addClass("hidden")
        select('#room3 #room3-hint4').removeClass("hidden")
        select('#room3 #room3-hint4').addClass("visible")
        //monster skifter farve fra sort til hvid
        select('#room3 #monsterDrinkSort').removeClass("visible")
        select('#room3 #monsterDrinkSort').addClass("hidden")
        select('#room3 #monsterDrinkHvid').removeClass("hidden")
        select('#room3 #monsterDrinkHvid').addClass("visible")

        setTimeout(()=>{ //crazyy transition hvor monster dør
            //monster skifter sprite fra hvid til crushed
            select('#room3 #monsterDrinkHvid').removeClass("visible")
            select('#room3 #monsterDrinkHvid').addClass("hidden")
            select('#room3 #monsterDrinkCrushed').removeClass("hidden")
            select('#room3 #monsterDrinkCrushed').addClass("visible")
            //køleskabet åbner sig
            select('#room3 #køleskab').removeClass("visible")
            select('#room3 #køleskab').addClass("hidden")
            select('#room3 #køleskabÅben').removeClass("hidden")
            select('#room3 #køleskabÅben').addClass("visible")
        }, 2000)
    })
    // ---- buttons - shiftpage ---- 
    select('#køkkenBtn3').mousePressed(() => { //går fra stue til køkken.
        shiftPage("#room2")
        buttonState = 1 //buttonstate bliver 1. Dette gør, at visse funktioner kun kan virker EFTER knap er trykket.
        if (kniv == true) {// kniven er fundet — behold hint3.
            return //altså forbliver hint3 uanset om hvis vi skifter frem og tilbage igen.
        }
        //hints ændres fra hint1 til hint2 via. ændring af class=""
        select('#room2 #room2-hint1').removeClass('visible')
        select('#room2 #room2-hint1').addClass('hidden')
        select('#room2 #room2-hint2').removeClass('hidden')
        select('#room2 #room2-hint2').addClass('visible')
    })//går fra stue til skur.

    select('#stueBtn4').mousePressed(() => { shiftPage("#room3") })
    select('#skurBtn3').mousePressed(() => { shiftPage("#room4") })
    

    // RUM 4 - Skuret
    //buttons
    select('#stueBtn4').mousePressed(() => {
        shiftPage("#room3")
        if (knivSlibet == true) {
            // kniven er fundet — behold hint3.
            return
        }
    })
    select('#room4 #slibestenBtn').mousePressed(() => { //tryk på slibesten
        if(kniv == true && knivSlibet != true){
            select('#room4 #slibestenGåde').removeClass('hidden')//gåden om slibestenen vises på skærmen (kniven og symbolerne vises)
            select('#room4 #slibestenGåde').addClass('visible')
            knivSlibet = true //kniven er slibet
        }
    })
    // ---- RUM 4: Slib Kniven ---- 
    //når man trykker på symbolerne bliver findSymbol funtkionen kaldt.
    select('#room4 #symbol1').mousePressed(() => findSymbol('#room4 #symbol1'))
    select('#room4 #symbol2').mousePressed(() => findSymbol('#room4 #symbol2'))
    select('#room4 #symbol3').mousePressed(() => findSymbol('#room4 #symbol3'))
    select('#room4 #symbol4').mousePressed(() => findSymbol('#room4 #symbol4'))


    // ---- RUM 5: Køleskab minigame? ----
    select('#køleskabÅben').mousePressed(() => { 
        shiftPage("#room5") 
        startBeerGame() 
    })
    
    // ---- SLUTSIDE ----
    select('#btn-save').mousePressed(() => {
        saveHighScore()
    })
    select('#btn-restart').mousePressed(() => {
        resetGame()
    })
}

console.log(crowbar)

// ============================================
// SHIFTPAGE — skifter mellem rum/sider
// ============================================

//shiftpage er en funktion som bruges til at sdkifter mellem sider ved at bruge klassenavne
function shiftPage(newPage) {
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}

// ============================================
// TIMER — tæller 1 op hvert sekund
// ============================================
function startTimer() {
    seconds = 0
    timerInterval = setInterval(() => {
        seconds++
        select('#timer').html(seconds + ' sek') //gør så timer-elementet tæller sekunder op, ved at indsætte et variabel som hele tiden skifter værdier, ind i tekstindholdet
    }, 1000)
}

function stopTimer() {
    clearInterval(timerInterval)//stop timeren
}

// ============================================
// START SPIL
// ============================================
function startGame() { //i denne funktion sætter vi gåderne til nul, så de er kalr til nlæste spil.
    gameState = 0
    symbolsFound = 0
    låsStep = 0
    startTimer()
    shiftPage('#room1')
}

// ============================================
// RUM 1: FIND SYMBOLER I KÆLDEREN, FIND CROWBAR
// ============================================
function findDoor(id) {
    select(id).hide() //når vi trykker på døren, bliver elementet med det angiven id usynligt. Døren forsvinder
    doorsFound++
}
function findCrowbar(id){
    select(id).hide() //det samme sker her, men med crowbar istedet
    crowbarsFound++
}

// ============================================
// RUM 1 DØR: KLIK LÅSE I RÆKKEFØLGE
// ============================================
function clickLås(id) {
    if (id === låsAnswer[låsStep]) { //hvis låse trykkes på i den rigtige rækkefølge som angivet i [låsStep] array
        låsStep++
    } else { // hvis der fejl-tykkes, skal man starte forfra igen
        låsStep = 0
    }

    if (låsStep === låsAnswer.length) {
        select('#room1Door #kælderdør').mousePressed(() => {
            if (låsStep === låsAnswer.length){
                shiftPage('#room2')
            }else{
                return
            }
        })
    }
}

// ============================================
// RUM 2 OVN OG KNIV: FÅ ITEM VIA GÅDE
// ============================================
function checkRoom2Answer() {
    var answer = select('#room2 #room2-answer').value().toLowerCase()
    if (answer.includes('kniv')) { //hvis man skriver "kniv" i inputfeltet
        invKnife.hidden = false //kniv billede vises i inventory
        gameState = 2 //gamestate opdateres
        kniv = true //kniven er blevet fundet!!


        //her skiftes hints fra hint2 til hint3
        select('#room2 #room2-hint2').removeClass('visible')
        select('#room2 #room2-hint2').addClass('hidden')
        select('#room2 #room2-hint3').removeClass('hidden')
        select('#room2 #room2-hint3').addClass('visible')
        

        select('#room2 #room2-code').removeClass('show')
        return
    } else { //hvis ma ikke skriver "kniv" i inputfeltet
        select('#room2 #room2-error').html('Ikke helt - prøv igen!')
    }
}

// ============================================
// RUM 4: FIND SYMBOLER I SKURET, SLIB KNIVEN
// ============================================

//gør så div'en med kniv og symboler i får class="hidden" efter symboler er fundet

function findSymbol(id) {
    select(id).hide()
    symbolsFound++
    
    if (symbolsFound === 4) {
        gameState = 4
        //gåden om slibestenen forsvinder igen
        select('#room4 #slibestenGåde').removeClass('visible')
        select('#room4 #slibestenGåde').addClass('hidden')
        //hints skiftes
        select('#room4 #room4-hint1').removeClass("visible")
        select('#room4 #room4-hint1').addClass("hidden")
        select('#room4 #room4-hint2').removeClass("hidden")
        select('#room4 #room4-hint2').addClass("visible")
        //hints skiftes
        select('#room3 #room3-hint2').removeClass("visible")
        select('#room3 #room3-hint2').addClass("hidden")
        select('#room3 #room3-hint3').removeClass("hidden")
        select('#room3 #room3-hint3').addClass("visible")
    }
}

// ============================================
// RUM 5: KLIK PÅ ØL SOM SPAWNER TILFÆLDIGT
// ============================================

var beerInterval = null  // tilføj øverst i STATE sektionen

function startBeerGame() {
    // Stop evt. gammelt interval før nyt startes
    if (beerInterval) {
        clearInterval(beerInterval)
        beerInterval = null
    }

    game_container = document.querySelector('#game-container')//vi laver et variabel "game_container" og binder det til vores HTML game-container                      //vi laver et variabel "game_container" og binder det til "game-container" id'et og laver game-container til game_container så game-container nu kan bruges som en game container-... GAME CONTAINERRRR?!? RAAHHH!!!!!!
    game_container.innerHTML = '' //vi rydder game container fra gamle øl

    points_display = document.querySelector('#points-display') //vi vælger element via. id så vi kan ændre det's tekstindhold
    time_display = document.querySelector('#time-display') //samme her, men med andet id

    time_left = 10 //tid tæller ned fra 10 sekunder
    points = 0 //point starter ved 0 (ingen tyvestart!!!)
    points_display.textContent = points //her ændrer vi elementets tekstindhold til at være antal points
    time_display.textContent = time_left //samme her, men med andet id
    spawnBeer() //vi kører spawnBeer funktionen

    beerInterval = setInterval(() => {
        time_left -= 0.1
        time_display.textContent = Math.round(time_left * 10) / 10
        if (time_left <= 0) {
            clearInterval(beerInterval)
            beerInterval = null
            confirm(`Du fik ${points} point!`) //confirm-boks i toppen af skærmen
            shiftPage('#complete') //efter at have trykket ok/annuler på boksen, skiftes til slutside
            stopTimer() //timer stoppen
            select('#timer').html(seconds + ' sekunder  - ' + points + ' points =\n' + (seconds-points) + ' score') //hvordan tekst skal se ud på timer i slutning
            //-da der skal vises 1. tid minus point, 2. final score efter udregning
        }
    }, 100)
}
//setinterval runs a function every x interval
//ÆNDR LILLE s TIL sTORT
function spawnBeer() {
    var new_beer = document.createElement('img') //vi opretter et img-element, kaldet new_beer
    var top = Math.random() * 91
    var left = Math.random() * 91
    new_beer.style = `left: ${left}%; top: ${top}%;`
    new_beer.src = 'assets/øl.png' //vi angiver den et billede af en øl
    new_beer.className = 'øl' //vi giver den en klasse kaldet "øl"
    game_container.appendChild(new_beer) //opretter new_beer som child-element under game_container objektet
    new_beer.addEventListener('click', () => { KillBeer(new_beer) }) //vi laver eventlistener så den forsvinder når bvitrykker på den
    setTimeout(() => { TimeoutBeer(new_beer) }, 2000) //kort tidsinterval mellem spawn af øl
}

function KillBeer(beer) {
    game_container.removeChild(beer) //efter vi har oprettet en øl som child-element, skal der FJERNES efter tid hvis ikke trykket på. "let's remove the child!"
    points += 1.5 //man får point for at klikke på øl
    points_display.textContent = points //points fra øl plusses sammen med point
    spawnBeer() //flere øl!!
}
function TimeoutBeer(beer) {
    if (game_container.contains(beer)) {
        game_container.removeChild(beer)
        points_display.textContent = points
        spawnBeer()
    }
}

// ============================================
// HIGH SCORE (Firestore)
// ============================================
function loadHighScores() {
    scoresRef.orderBy('seconds', 'asc').limit(10).onSnapshot(snap => {
        select('#score-list').html('')
        snap.forEach(doc => {
            var d = doc.data()
            var li = createElement('li')
            li.child(createElement('span', d.name))
            li.child(createElement('span', d.seconds + ' sek'))
            select('#score-list').child(li)
        })
    })
}

function saveHighScore() {
    var name = select('#player-name').value().trim()
    if (name === '') {
        select('#player-name').attribute('placeholder', 'Skriv dit navn først!')
        return
    }
    console.log('Du trykkede Gem! Navn:', name, '— Tid:', seconds - points, 'sek')
    console.log('TODO: Åbn firebase.js og indsæt jeres Firebase-config. Derefter virker scoresRef.add() og gemmer data i Firestore.')

    // Udkommenter linjen herunder når firebase.js er sat op:
    scoresRef.add({ name: name, seconds: seconds-points }).then(() => {
        select('#btn-save').attribute('disabled', true)
        select('#btn-save').html('Gemt!')
    })
}

// ============================================
// RESET
// ============================================

function resetGame() {
    // Nulstil timer og states
    seconds = 0
    select('#timer').html('0 sek')
    buttonState = 0
    crowbar = false
    kniv = false
    knivSlibet = false
    symbolsFound = 0
    låsStep = 0
    points = 0

    // Nulstil inventory
    invCrowbar.hidden = true
    invKnife.hidden = true

    // Nulstil rum 1
    select('#room1 #woodenBox').show()
    select('#room1 #symbolDoor').show()
    select('#room1 #køkkenBtn1').removeClass('visible')
    select('#room1 #køkkenBtn1').addClass('hidden')
    select('#room1 #symbolDoorOpen').removeClass('visible')
    select('#room1 #symbolDoorOpen').addClass('hidden')
    select('#room1 #symbolDoorOpenBg').removeClass('visible')
    select('#room1 #symbolDoorOpenBg').addClass('hidden')

    // Nulstil rum 2
    select('#room2 #room2-code').removeClass('show')
    select('#room2 #room2-answer').value('')
    select('#room2 #room2-error').html('')
    select('#room2 #room2-hint1').removeClass('hidden')
    select('#room2 #room2-hint1').addClass('visible')
    select('#room2 #room2-hint2').removeClass('visible')
    select('#room2 #room2-hint2').addClass('hidden')
    select('#room2 #room2-hint3').removeClass('visible')
    select('#room2 #room2-hint3').addClass('hidden')

    // Nulstil rum 3
    select('#room3 #room3-hint1').removeClass('hidden')
    select('#room3 #room3-hint1').addClass('visible')
    select('#room3 #room3-hint2').removeClass('visible')
    select('#room3 #room3-hint2').addClass('hidden')
    select('#room3 #room3-hint3').removeClass('visible')
    select('#room3 #room3-hint3').addClass('hidden')
    select('#room3 #room3-hint4').removeClass('visible')
    select('#room3 #room3-hint4').addClass('hidden')
    select('#room3 #monsterDrinkSort').removeClass('hidden')
    select('#room3 #monsterDrinkSort').addClass('visible')
    select('#room3 #monsterDrinkHvid').removeClass('visible')
    select('#room3 #monsterDrinkHvid').addClass('hidden')
    select('#room3 #monsterDrinkCrushed').removeClass('visible')
    select('#room3 #monsterDrinkCrushed').addClass('hidden')
    select('#room3 #køleskab').removeClass('hidden')
    select('#room3 #køleskab').addClass('visible')
    select('#room3 #køleskabÅben').removeClass('visible')
    select('#room3 #køleskabÅben').addClass('hidden')

    // Nulstil rum 4
    select('#room4 #room4-hint1').removeClass('hidden')
    select('#room4 #room4-hint1').addClass('visible')
    select('#room4 #room4-hint2').removeClass('visible')
    select('#room4 #room4-hint2').addClass('hidden')
    select('#room4 #slibestenGåde').removeClass('visible')
    select('#room4 #slibestenGåde').addClass('hidden')
    select('#room4 #symbol1').show()
    select('#room4 #symbol2').show()
    select('#room4 #symbol3').show()
    select('#room4 #symbol4').show()

    // Nulstil slutside
    select('#btn-save').removeAttribute('disabled')
    select('#btn-save').html('Gem high score')
    select('#player-name').value('')

    shiftPage('#start')
}

//hvis jeg havde mere tid, ville jeg gerne have opimized min kode. TRUST ME jeg ville BETALE for at kunne gøre det