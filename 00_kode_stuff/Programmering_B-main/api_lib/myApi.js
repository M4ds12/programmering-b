// Dine genbrugelige API-funktioner kommer her.

function setup(){
    console.log('connection til myApi.js')
}


// ============================================
// TOAST — show toast message
// ============================================
//Demands an HTML element with id="toast"
//txt : the text toast will display
//timeout : how long the toast will stay on screen
//type : choose between notify and warning
//disse værdier som er angivet hos parameterene(linjen under denne) er default, altså kan de ændres til anden
function showToast(toastDiv='#toast', text, timeout=2000, type="notify"){
    try {
        var toast = select('#toast')
    }catch(err){
        console.log("couldn't select element with the ID: ", toastDiv)
        return
    }
    toast.html(text)
    toast.addClass('toastShow')
    toast.addClass(type)
    setTimeout(()=>{
        toast.removeClass('toastShow')
    }, timeout)
}


// ============================================
// shiftPage — skift side
// ============================================
/*
function setup(){
    shiftPage('currentPage')
}
*/
var currentPage = "#page1"
var readyToShift = true
function shiftPage(newPage){
    if(readyToShift){
        if(!select(newPage)) return
        select(currentPage).removeClass('show')
        currentPage = newPage
        select(currentPage).addClass('show')
        readyToShift = false
        setTimeout(() => readyToShift = true, 50);
    }
}
/*
function shiftPage(newPageId){
    if(select('#currentPage')) select('#currentPage').removeClass('show')
        select('currentPage').addClass('show')
    currentPage = newPageId
}

function createMenu(menuDivId){
    var allPages = selectAll('.page')
    allPages.map( p ={
        var a = creatElement()
    })
*/

// ============================================
// TIMER — tæller 1 op hvert sekund
// ============================================
// indsæt <div id="timer">0 sek</div> i html
function startTimer(seconds=0, interval=1000) {
    seconds = 0
    timerInterval = setInterval(() => {
        seconds++
        select('#timer').html(seconds + ' sek') //gør så timer-elementet tæller sekunder op, ved at indsætte et variabel som hele tiden skifter værdier, ind i tekstindholdet
    }, interval)
}
function stopTimer() {
    clearInterval(timerInterval)//stop timeren
}

// ============================================
// visible/hidden klasser — disable ALL functions, in an INSTANT
// ============================================
//select('#').addClass("visible")
//select('#').removeClass("hidden")


// ============================================
// createCard — opretter cards
// ============================================
/*function createCard(text, img, destId){
    console.log(img)
    var containerDiv = createDiv().addClass('cardContainer')
    var topDiv = createDiv().addClass('top')
    var img = createImg(img)
    topDiv.child(img)
    var bottomDiv = createDiv(text).addClass('bottom')
    containerDiv.child(topDiv)
    containerDiv.child(bottomDiv)
    select(destId).child(containerDiv)
}*/

function createCard(title="", text="", image=""){
    var card = createDiv().addClass('card')
    card.child( createImg(image))
    card.child(createElement('h2', title))
    card.child(createElement('p', text))
    return card

    // return `<div class="card">
    //         <img> src='${image}</img>
    //         <h2>${title}</h2>
    //         <p>${text}</p>
    //     </div>`
}
// createCard('besked', 'billede-url', '#card-id')
// Eksempel: createCard('Her er billedet', 'https://media.tenor.com/5x7yNPBj5HcAAAAm/happy.webp', '#cards')



async function getJSON( endpoint ){
    // Vi starter med at kontakte severen
    var res
    try{
        var res = await fetch( endpoint )
    }catch(err){
        console.log(err)
    }
    //Hvis response er ok, henter vi json data
    var json = await res.json()
    console.log(`Hentede poster fra fetchJSON`, json)
    return json


    chars.map(char => {
        var img = char.image
        img = createImg(img)
        select('#characters').child(img)
    })
}