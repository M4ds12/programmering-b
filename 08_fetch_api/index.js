var currentPage = '#page1'
var deck
var score = 0
var dealerScore = 0
var dealerReactionImg
var dealerCardOne
var dealerCardTwo
var losses = 0
var wins = 0
var draws = 0
var blackjacks = 0
var player = {
    cards: [],
    total: 0
}
var gameOver = false
var dealer = {
    cards: [],
    total: 0
}

var state = "begin"

//P5 setup() bliver kaldt EN gang før siden vises 
function setup() {
    console.log('P5 setup kaldt inshallah')

    //skift til current page 
    shiftPage(currentPage)
    capture = createCapture(VIDEO)
    dealerReactionImg = createImg('./assets/dealerNeutral.png')
    capture.size('100%', '100%')
    select('#top').child(capture)
    dealerReactionImg.attribute('src', './assets/dealerNeutral.png')
    var playerBar = createElement('div', 'LIVE PLAYER REACTION')
    var dealerBar = createElement('div', 'LIVE DEALER REACTION')
    playerBar.addClass('live-bar')
    dealerBar.addClass('live-bar')
    select('#top').child(playerBar)
    select('#dealerReaction').child(dealerReactionImg)
    select('#dealerReaction').child(dealerBar)
    dealerReactionImg.size('100%', '100%')

    getDeck()
    visualiseScore()

    select('#playerDrawBtn').mousePressed(() => {
        if (state !== "player") return;
        drawCard("player");
    })
    select('#playerStandBtn').mousePressed(() => {
        drawCard("dealer")
    })
    select('#restartBtn').mousePressed(restart)



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
//Async står for asyncronous - vi ved ikke præcis hvor længe det tager at køre funktionen  
async function getDeck() {
    try {
        //fetch kan hente data fra en server ude i byen 
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        //Repsonse objektet kommer tilbage fr serveren - og HVIS response.ok er true, kan vi hente data
        console.log("Response objektet:", response)
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

    console.log('Drawcard kaldt med state', state)

    if (state == "dealer") {
        select("#playerDrawBtn").hide()
        select("#playerStandBtn").hide()
        dealer.cards[0].hidden = false

        visualiseScore()
        showCards()
        if (dealer.total < 17) {
            var newCard = await getOneCard()
            dealer.total += returnCardValue(newCard.value)
            dealer.cards.push(newCard)
            drawCard()
        } else {

            if (dealer.total > 21) {
                if (player.total == 21) {
                    state = "playerBlackjack"
                }
                else {
                    state = "playerWin"
                }
            }

            else if (player.total == dealer.total) {
                //Its a draw
                state = "playerDraw"
            }
            else if (player.total > dealer.total && player.total < 21) {
                //Player won
                state = "playerWin"
            }
            else if (player.total > dealer.total && player.total == 21) {
                //spilleren fik blackjack!!!!!
                state = "playerBlackjack"
            }
            else if (player.total < dealer.total) {
                //Dealer won
                state = "playerLose"
            }
        }
    }

    if (state == "playerLose") {
        dealerReactionImg.attribute('src', './assets/dealerWin.png')
        //Gå til game end page shiftPage('#page2'), hvor det skal være  tydeligt at spilleren har tabt
        select('#result').html("Du tabte")
        if (gameOver) return
        gameOver = true
        losses += 1
        updatePlayerStats()
        setTimeout(() => shiftPage("#page2"), 2000)
        //Ved tryk på den knap
        // Nulstil player og dealer objekterne 
        //Sæt state = begin 
        // kald getDeck()

    }

    if (state == "player") {
        console.log('Showtime - implementer denne funktion til næste gang vi har programmering')
        //Træk et kort med funktionen get one card
        var newCard = await getOneCard()
        //Læg det nye kort til player.cards
        player.cards.push(newCard)
        //Vis kortene med showcards() 
        showCards()
        //Læg spillerens total sammen (husk at bruge returnCardValue)  
        player.total += Number(returnCardValue(newCard))

        score = player.total
        dealerScore = dealer.total
        visualiseScore()

        //Hvis spilleren har under 21, return
        if (player.total < 21) {
            return
        }
        //Hvis spilleren HAR 21, set state = "dealer" og kald drawCard()
        if (player.total == 21) {
            state = "dealer"
            drawCard()
        }
        //Hvis spilleren har over 21: 
        //Tjek for es'er ved at løbe player.cards igennem - hver gang der kommer et es, træk 10 fra total - og se om resultatet stadig er over 21. 
        if (player.total > 21) {
            player.cards.map(c => {
                if (c.value == "ACE") {
                    c.value = "ACE-USED"
                    player.total -= 10
                    score = player.total
                    visualiseScore()
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
        }
        //Men sørg for ikke at trække 10 fra DEN RIGTIGE player.total - brug en idlertidig variabel til at se om spillerens VIRKELIGE sum er udner 21 (med es'er) 
        //Hvis nu resultatet pludselig er 21 - så skal det være dealerens tur
        //Hvis resultatet nu er under 21, er det spillerens tur igen 
        //MEN hvis resultatet STADIG er over 21, sæt state = "playerLose" og kald drawCard()      
    }

    if (state == "playerWin") {
        dealerReactionImg.attribute('src', './assets/dealerLose.png')
        if (gameOver) return
        gameOver = true
        wins += 1
        updatePlayerStats()
        select('#result').html("Du Vandt")
        setTimeout(() => shiftPage("#page2"), 2000)
    }

    if (state == "playerBlackjack") {
        dealerReactionImg.attribute('src', './assets/dealerLose.png')
        if (gameOver) return
        gameOver = true
        blackjacks += 1
        wins += 1
        updatePlayerStats()
        select('#result').html("Du fik blackjack!!!!")
        setTimeout(() => shiftPage("#page2"), 2000)
    }

    if (state == "playerDraw") {
        if (gameOver) return
        gameOver = true
        draws += 1
        updatePlayerStats()
        select('#result').html("DRAW")
        setTimeout(() => shiftPage("#page2"), 2000)
    }


    if (state == "begin") {
        select("#playerDrawBtn").show()
        select("#playerStandBtn").show()
        var cardOne = await getOneCard()
        //Først lægger vi kortenes værdi oven i spiller variablen (uden hensyn til ES)
        player.cards.push(cardOne)
        var cardTwo = await getOneCard()
        player.cards.push(cardTwo)

        player.total += returnCardValue(cardOne)
        player.total += returnCardValue(cardTwo)

        //Nu er vi en situation hvor spillere faktisk kunne have vundet, kunne have 22 (to es'er), eller bare har fået et eller andet tal under 21 - OG DET ER HELT FINT 
        if (player.total == 22) {
            player.total = 12
        }
        if (dealer.total == 22) {
            dealer.total = 12
        }
        //


        //Dealeres FØRSTE kort skal være skjult
        dealerCardOne = await getOneCard()
        dealerCardOne.hidden = true
        dealer.cards.push(dealerCardOne)
        dealerCardTwo = await getOneCard()
        dealer.cards.push(dealerCardTwo)

        //Regn dealerens kort ud for at se om de har blackjack 
        dealer.total += returnCardValue(dealerCardOne)
        dealer.total += returnCardValue(dealerCardTwo)

        //scenaerie et: begge har 21  
        if (dealer.total == 21 && player.total == 21) {
            select('#result').html("It's a draw")
            setTimeout(() => restart(), 3000)
        }
        if (dealer.total == 21 && player.total != 21) {
            select('#result').html("Dealer won")
            setTimeout(() => restart(), 3000)
        }
        if (dealer.total != 21 && player.total == 21) {
            drawCard("dealer")
        }

        state = "player"
        score = player.total
        visualiseScore()
        showCards()
    }



}

function restart() {
    console.log('restart')
    select('#result').html('')
    player.cards = []
    player.total = 0
    dealer.cards = []
    dealer.total = 0
    score = 0
    dealerScore = 0
    visualiseScore()
    dealerReactionImg.attribute('src', './assets/dealerNeutral.png')
    state = "begin"
    getDeck()
    shiftPage('#page1')
    gameOver = false
}

function showCards() {
    //console.log("ShowCards er klar med: ", "Player:", player.cards, "Dealer: ", dealer.cards)
    select('#player .cards').html('')
    player.cards.map((c, i) => {
        var img = createImg(c.image)
        img.style('transform', `translate(${i * 40}px, ${i * 40}px)`)
        var cardTransform = `translate(${i * 40}px, ${i * 40}px)`
        img.mouseOver(() => {
            img.style('transform', `translate(${i * 40}px, ${i * 40 - 20}px)`)
        })
        img.mouseOut(() => {
            console.log("mouseOut")
            img.style('transform', cardTransform)
        })


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
        //console.log("getOneCard kommer tilbage med et nyt kort:", data)
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

function visualiseScore() {
    select("#playerScore").html(score)
    if (dealerCardOne && dealer.cards[0] && dealer.cards[0].hidden == true) {
        dealerScore = returnCardValue(dealerCardTwo) + " + ????"
    } else {
        dealerScore = dealer.total
    }
    select("#dealerScore").html(dealerScore)
}


function updatePlayerStats() {
    select("#lossStat").html("tab: " + losses)
    select("#winStat").html("wins: " + wins)
    select("#drawStat").html("draws: " + draws)
    select("#blackjackStat").html("blackjacks: " + blackjacks)
}