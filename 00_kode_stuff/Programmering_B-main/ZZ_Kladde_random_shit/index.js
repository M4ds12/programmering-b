var currentPage = '#page1'
var deck

var player = {
    cards: [],
    total: 0
}

var dealer = {
    cards: [],
    total: 0
}

var state = "begin"

//P5 setup() bliver kaldt EN gang før siden vises 
function setup() {
    //console.log('P5 setup kaldt inshallah')

    //skift til current page 
    shiftPage(currentPage)

    getDeck()

    select('#playerDrawBtn').mousePressed(() => {
        if (state !== "player") return;
        drawCard("player");
    })
    select('#playerStandBtn').mousePressed(() => {
        drawCard("dealer")
        //console.log(state)
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
    console.log(player.total)
}
//Async står for asyncronous - vi ved ikke præcis hvor længe det tager at køre funktionen  
async function getDeck() {
    try {
        //fetch kan hente data fra en server ude i byen 
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        //Repsonse objektet kommer tilbage fr serveren - og HVIS response.ok er true, kan vi hente data
        //console.log("Response objektet:", response)
        if (response.ok) {
            const data = await response.json()
            console.log("Data vi får tilbage: ", data)
            deck = data
            drawCard()

        }
    } catch (error) {
        console.log(error)
    }
}

async function drawCard(newState) {

    if (newState) {
        state = newState
    }
   // console.log("drawcard kaldt", state, dealer.total)

    if (state == "dealer") {
        //Reveal kortene
        dealer.cards[0].hidden = false
        showCards()
        //Regn total af dealer ud
        if (dealer.total < 17) {
            var newCard = await getOneCard()
            dealer.cards.push(newCard)
            showCards()
             dealer.total += Number(returnCardValue(newCard))
             if(dealer.total < 17){
                drawCard()
             }
             else if(dealer.total > 21){
                shiftPage("#page3")
                
             }
           console.log("dealer total hej",dealer.total);
        }else{

            if(player.total == dealer.total){
                shiftPage('#page2')
             
            }
            else if(player.total > dealer.total){
                 shiftPage('#page3')
                
            }
            else{
                shiftPage('#page2')
                 
            }
            console.log("dealer total > 17")
             return
        }
        
        showCards()
        //Træk kort indtil, hvis total => 17 eller player, stop og check om spileleren har vundet.
    }

    if (state == "playerLose") {
        //Gå ti game end page, hvor det er tydligt at spilleren har tabt.
        shiftPage('#page2')
        //Vis en restart knap.
        gameRestarts()
        //Ved tryk på en knap nulstil plaer og dealer objerkterne.
        //Sæt state = begin
        //Kald getDeck()
    }
    if (state == "playerWin") {
        //Gå ti game end page, hvor det er tydligt at spilleren har tabt.
        shiftPage('#page3')
        //Vis en restart knap.
        gameRestarts()
        //Ved tryk på en knap nulstil plaer og dealer objerkterne.
        //Sæt state = begin
        //Kald getDeck()
    }
    function gameRestarts(){
        shiftPage('#page2')
        //Vis en restart knap.
        select('#restartBtn').mousePressed(() => {
            player = {
                cards: [],
                total: 0
            }
            dealer = {
                cards: [],
                total: 0
            }
            state = "begin"
            getDeck()
            shiftPage("#page1")
        })
    }

    if (state == "player") {
        //console.log('Showtime - implementer denne funktion til næste gang vi har programmering')
        var newCard = await getOneCard()
        player.cards.push(newCard)
        showCards()
        player.total += Number(returnCardValue(newCard))
        console.log("nej",player.total)
        if (player.total < 21) {
            return
        }
        if (player.total == 21) {
            state = "dealer"
            drawCard()
        }
        if (player.total > 21) {
            player.cards.map(c => {
                if (c.value == "ACE") {
                    c.value = 'ACE-used'
                    player.total -= 10
                    if (player.total < 21) {
                        return
                    }
                    if (player.total == 21) {
                        state = "dealer"
                        drawCard()
                    }
                }
            })
            if (player.total > 21) {
                state = "playerLose"
                drawCard()
            }
            console.log("Player total: ", player.total)
        }
        //Træk et kort med funktionen getOneCard()
        //Plus kortet til total
        //push det nye kort i player.cards
        //hvis spilleren har under 21, return
        //hvis spilleren har 21, skift state til dealer og kald drawCard()
        //tjek om total er over 21
        //tjek for es'er ved at mappe player.cards og -10 for hvert es indtil total er under 21
        //Hvis resultatet er under 21, return
        //Hvis resultatet stadig er over 21, sæt state = "playerLose" og kald drawCard()
    }
    if (state == "begin") {


        var cardOne = await getOneCard()
        //først ligger vi kortetenes værdi oven i spiller variablen (uden hensyn til es)
        player.cards.push(cardOne)
        var cardTwo = await getOneCard()
        player.cards.push(cardTwo)

        player.total += Number(returnCardValue(cardOne))
        player.total += Number(returnCardValue(cardTwo))
        console.log("hej",player.total)

        //nu er vi en situation hvor spillere faktisk kunne have vundet, kunne have 22(to es'er), eller bare kunne have fået et eller andet tal under 21. 
        if (player.total == 22) {
            player.total = 12
        }

        //Dealeres FØRSTE kort skal være skjult
        var dealerCardOne = await getOneCard()
        dealerCardOne.hidden = true
        dealer.cards.push(dealerCardOne)
        var dealerCardTwo = await getOneCard()
        dealer.cards.push(dealerCardTwo)

        //Regn dealerens kort ud for at se om de har blackjack
        dealer.total += returnCardValue(dealerCardOne)
        dealer.total += returnCardValue(dealerCardTwo)

        if (dealer.total == 22) {
            dealer.total = 12
        }


        if (dealer.total == 21 && player.total == 21) {
            select('#result').html("It's a draw")
            setTimeout(restart, 3000)
        }
        if (dealer.total == 21 && player.total != 21) {
            select('#result').html("Dealer Won")
            setTimeout(restart, 3000)
        }

        showCards()
        state = "player"
    }

}

function restart() {
    select('#result').html('')
    player.cards = []
    player.total = 0
    dealer.cards = []
    dealer.total = 0
    state = "begin"
    drawCard()
}

function showCards() {
   //console.log("ShowCards er klar med: ", player.cards, dealer.cards)
    select('#player .cards').html('')
    player.cards.map((c, i) => {
        var img = createImg(c.image)
        img.style('transform', `translate(${i * 40}px, ${i * 40}px)`)
        select('#player .cards').child(img)
    })
    select('#dealer .cards').html('')
    dealer.cards.map((c, i) => {
        var img
        if (c.hidden) {
            img = createImg('https://deckofcardsapi.com/static/img/back.png')
        } else {
            img = createImg(c.image)
        }

        img.style('transform', `translate(${i * 40}px, ${i * 40}px)`)
        select('#dealer .cards').child(img)
    })
}

function returnCardValue(card) {
    if (isNaN(card.value)) {
        if (card.value == "ACE") {
            return 11
        } else {
            return 10
        }
    } else {
        return Number(card.value)
    }
}

async function getOneCard() {
    //Hent et kort 
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`)
        const data = await response.json()
        console.log("DrawCard kommer tilbage med et nyt kort:", data)
        return data.cards[0]
    } catch (error) {
        console.log("Error catched", error)
    }

}

function shiftPage(newPage) {
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}