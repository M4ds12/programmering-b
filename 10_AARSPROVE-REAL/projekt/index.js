// ============================================
// STATE
// ============================================
var currentPage = '#arkadeRum'
var gameState = 0
var timerInterval = null
var seconds = 0
var attempts = 3
var maxAttempts = 3

// Rum 1: antal fundne symboler
var symbolsFound = 0
var elementsFound = 0

// Rum 2: rigtig rækkefølge og tæller
var cloudAnswer = ['cloud1', 'cloud3', 'cloud2']
var cloudStep = 0


//rum 3: haack spil dimmedutter
var gameContainer
var pointsDisplay
var timeleftDisplay
var gamePoints = 0
var gameTimeleft = 30
var gameTimer
var holePositions = [
    { top: "22%", left: "29%" },
    { top: "22%", left: "71%" },
    { top: "33%", left: "42%" },
    { top: "33%", left: "58%" },
    { top: "44%", left: "33%" },
    { top: "44%", left: "65%" },
    { top: "52%", left: "46%" },
    { top: "52%", left: "57%" },
    { top: "63%", left: "29%" },
    { top: "63%", left: "48%" },
    { top: "63%", left: "68%" },
]


// Rum 4: Periodisk System variabler
var kemiTargets = ["carbon", "hydrogen", "oxygen"]
var kemiHints = [
    "Find grundstofferne i et alkohol",
    "Find stoffet der viser sølv",
    "Find stoffet der viser kobber"
]
var kemiTask = 0



// ---- OPPDATERET QUIZ DATA (4 SVARMULIGHEDER) ----
// svar er angivet som et indeks-nummer (0, 1, 2 eller 3)
const questions = [
    {
        "spørgsmål": "Hvad står DOM-Binding for?",
        "muligheder": ["Dominerende Binding", "Document Object Model Binding", "Dokumenterende Bindestreg", "Det ved jeg sgu ik"],
        "svar": 1
    },
    {
        "spørgsmål": "Hvilke af disse funktioner bruges til at løbe et array igennem i javascript?.",
        "muligheder": [".filter()", ".loop()", ".map()", ".run"],
        "svar": 2
    },
    {
        "spørgsmål": "Hvilke af disse funktioner bruges til at filtrere et array ved at danne et nyt array af de filtrede items?.",
        "muligheder": [".filter()", ".sort()", ".categorise()", ".newArray()"],
        "svar": 0
    },
    {
        "spørgsmål": "Hvad står KNN for?.",
        "muligheder": ["Kinesisk Negle Nabo", "K-Nearest Neighbor", "Kæmpe Nej Nej", "K-Nearest Kelvin"],
        "svar": 1
    },
    {
        "spørgsmål": "Hvad står DDU for?",
        "muligheder": ["Digital Design og Udvikling", "Digital Design og Undersøgelse", "Digital Designering og Udforsking", "Digital Dannelse og Udvikling"],
        "svar": 0
    },
    {
        "spørgsmål": "Hvilke af disse fag er jeg underviser i?",
        "muligheder": ["Kun programmering", "Kun informatik", "Kun DDU", "Allesammen"],
        "svar": 3
    },
    {
        "spørgsmål": "Hvad bruges Firebase stil?",
        "muligheder": ["At starte en ildebrand", "At være database", "At 3D modellere", "at 3D printe"],
        "svar": 1
    },
    {
        "spørgsmål": "I en hjemmeside med HTML, CSS, og Javascript, hvilken rolle har HTML delen her?.",
        "muligheder": ["At være udseendet", "At være funktionaliteten", "At være indeholdet", "Det er ubrugeligt"],
        "svar": 2
    },
    {
        "spørgsmål": "I en hjemmeside med HTML, CSS, og Javascript, hvilken rolle har CSS delen her?",
        "muligheder": ["At være funktionaliteten", "At være udseendet", "At være indeholdet", "Det er ubrugeligt"],
        "svar": 1
    },
    {
        "spørgsmål": "I en hjemmeside med HTML, CSS, og Javascript, hvilken rolle har Javascript delen her?",
        "muligheder": ["At være funktionaliteten", "At være udseendet", "At være indeholdet", "Det er ubrugeligt"],
        "svar": 0
    }
]
const sidsteSpørgsmål = {
    "spørgsmål": "Hvad hedder vores klasselærer? Hvis du svarer forkert, dumper du med det samme!!!!!!",
    "muligheder": ["Simon Moe", "Søren Dahlstrøm", "Sofie Rahbek", "Daniel Withenstein"],
    "svar": 2
}


var q = 0
var score = 0



var kemiRoomPermission = false
var arkadeRoomPermission = false
var johnRoomPermission = false
var simonTronRoomPermission = false






// ============================================
// SETUP — kaldes én gang af p5.js
// ============================================
function setup() {
    var allPages = selectAll(".page")
    var lockedSound = createAudio('./assets/lockedDoor.mp3')
    var attemptsContainer = select("#kemi-attempts")
    for (var i = 0; i < maxAttempts; i++) {
        var circle = createDiv()
        circle.addClass("circle")
        attemptsContainer.child(circle)
    }

    //Textboxe
    var introText
    var introButton

    var arcadeStartBtn = select("#arcadeMachine")
    var leaveRoom3Button = select("#arcadeDoorOpen")

    noCanvas()
    shiftPage('#kemiLokale')

    //lav introbox
    introText = [
        "Velkommen til spillet",
        "Lærene på KMG har fanget dig i KMGs kemi lokale på fjerde sal, efter at du dumpede din matematik årsprøve. Dit mål er at løse alle lærenes gåder, og flygte fra skolen",
        "Din første udfordring: Martin vil gerne have at du trykker på de 3 rigtige elementer på det periodiske system",
        "Efter du klikker på det periodiske system, starter tiden."
    ]
    var introTæller = 0

    introbox = createDiv(introText[0])
    introbox.addClass("textbox")
    introButton = createButton("Start")
    introbox.child(introButton)
    select("#kemiLokale").child(introbox)

    introButton.mousePressed(() => {
        if (introTæller < introText.length - 1) {
            introTæller++
            introbox.html(introText[introTæller])
            introbox.child(introButton)
        } else {
            introbox.hide()
        }
    })

    select('#periodicTable').mousePressed(() => {
        console.log('Periodisk system klikket!')
        shiftPage("#periodiskSystem")
        startTimer()
        select("#kemi-hint").html(kemiHints[0])



    })

    //Forlad rummene
    leaveRoom3Button.mousePressed(() => {
        if (arkadeRoomPermission == true) {
            shiftPage("#tredjeSalGang")
        } else {
            lockedSound.play()
            select('#locked-message').style('display', 'block')
            setTimeout(() => {
                select('#locked-message').style('display', 'none')
            }, 2000)
        }

    })

    // ---- STARTSIDE ----
    select('#btn-start').mousePressed(() => {
        startGame()
    })

    // ---- RUM 1: Hotspots ----
    select('#room1 #symbol1').mousePressed(() => findSymbol('#room1 #symbol1'))
    select('#room1 #symbol2').mousePressed(() => findSymbol('#room1 #symbol2'))
    select('#room1 #symbol3').mousePressed(() => findSymbol('#room1 #symbol3'))


    //etage 4 elementer
    select('#periodiskSystem #symbol4').mousePressed(() => kemiOpgave("carbon", "#periodiskSystem #symbol4"))
    select('#periodiskSystem #symbol3').mousePressed(() => kemiOpgave("oxygen", "#periodiskSystem #symbol3"))
    select("#periodiskSystem #symbol5").mousePressed(() => kemiOpgave("hydrogen", "#periodiskSystem #symbol5"))
    select("#periodiskSystem #symbol15").mousePressed(() => kemiOpgave("silver", "#periodiskSystem #symbol15"))
    select("#periodiskSystem #symbol12").mousePressed(() => kemiOpgave("copper", "#periodiskSystem #symbol12"))
    var wrongSymbols = ["#symbol1", "#symbol2", "#symbol6", "#symbol7", "#symbol8", "#symbol9", "#symbol10", "#symbol11", "#symbol13", "#symbol14", "#symbol16"]
    wrongSymbols.map(id => {
        select("#periodiskSystem " + id).mousePressed(() => kemiOpgave("wrong", "#periodiskSystem " + id))
    })

    select('#btn-fail-restart').mousePressed(() => {
        restartGame()
    })



    select("#leaveKemi").mousePressed(() => {
        if (kemiRoomPermission == true) {
            shiftPage("#fjerdeSalGang")

        } else {
            lockedSound.play()
            select('#kemiLokale').child(lockedSound)
            select('#locked-message').style('display', 'block')
            setTimeout(() => {
                select('#locked-message').style('display', 'none')
            }, 2000)
        }
    })


    select('#nextFloorBtn1').mousePressed(() => {
        shiftPage('#arkadeRum')
    })

    setInterval(() => moveBtn('#nextFloorBtn1'), 800)







    arcadeStartBtn.mousePressed(() => {
        startArcadeGame()
        shiftPage("#arkadeSpil")
    })


    select('#tryAgainHaack').mousePressed(() => {
        select('#tryAgainHaack').style('display', 'none')
        startArcadeGame()
    })





    select('#johnKMG').mousePressed(() => {
        select('#johnDialogue').addClass('show')
    })

    select('#johnClose').mousePressed(() => {
        select('#johnDialogue').removeClass('show')
        select('#johnAnswer').value('')
        select('#johnError').html('')
    })

    select('#johnSubmit').mousePressed(() => {
        var answer = select('#johnAnswer').value().toLowerCase()
        if (answer.includes('dit svar her')) {
            select('#johnDialogue').removeClass('show')
            johnRoomPermission = true


            select('#johnKMG').style('transition', 'all 1s ease-in-out')
            select('#johnKMG').style('left', '30%')

            select('#leaveJohnKMG').style('display', 'block')
        } else {
            select('#johnError').html('Forkert! Prøv igen.')
        }
    })

    select('#leaveJohnKMG').mousePressed(() => {
        if (johnRoomPermission == true) {
            shiftPage('#andenSalGang')
        } else {
            lockedSound.play()
            select('#locked-message').style('display', 'block')
            setTimeout(() => {
                select('#locked-message').style('display', 'none')
            }, 2000)
        }
    })



    select('#simonTron').mousePressed(() => {
        select('#simonTronDialogue').addClass('show')
    })


    var simonDialogueStep = 0;
    select('#simonTronSubmit').mousePressed(() => {
        if (simonDialogueStep === 0) {
            select("#simonTronQuestion").html("Du skal nu deltage i min quiz, hvis du vil videre");
            select("#simonTronSubmit").html("Lad mig prøve")
            simonDialogueStep++;
        } else if (simonDialogueStep === 1) {
            simonDialogueStep++;
            select('#simonTronDialogue').removeClass('show');
            shiftPage("#quiz");
            // Nulstil quiz tilstand og kør første spørgsmål
            q = 0;
            score = 0;
            showQ();
        }
        else if (simonDialogueStep == 2) {
            select('#simonTronDialogue').removeClass('show');
            select("#simonTronSubmit").html("Vi ses")
            shiftPage("#førsteSalGang")
        }
    })

    // ---- EVENT LISTENERS TIL DE 4 SVARKNAPPER I QUIZZEN ----
    // Sørg for at dine knapper i din HTML har id="btn0", id="btn1" osv.
    select("#btn0").mousePressed(() => checkAnswer(0));
    select("#btn1").mousePressed(() => checkAnswer(1));
    select("#btn2").mousePressed(() => checkAnswer(2));
    select("#btn3").mousePressed(() => checkAnswer(3));



    // ---- RUM 2: Skyer ----
    select('#room2 #cloud1').mousePressed(() => clickCloud('cloud1'))
    select('#room2 #cloud2').mousePressed(() => clickCloud('cloud2'))
    select('#room2 #cloud3').mousePressed(() => clickCloud('cloud3'))

    select('#room2 #room2-submit').mousePressed(() => {
        checkRoom2Answer()
    })

    // ---- SLUTSIDE ----
    select('#btn-save').mousePressed(() => {
        saveHighScore()
    })

    select('#btn-restart').mousePressed(() => {
        resetGame()
    })

    allPages.map(
        page => {
            var menuItem = createElement("a")
            menuItem.html(page.attribute("title"))
            select(".sidebar").child(menuItem)
            menuItem.mousePressed(
                () => {
                    shiftPage("#" + page.attribute("id"))
                }
            )
        }
    )



    select('#nextFloorBtn2').mousePressed(() => {
        shiftPage('#andenSalLokale')
    })

    setInterval(() => moveBtn('#nextFloorBtn2'), 700)

    select('#nextFloorBtn3').mousePressed(() => {
        shiftPage('#førsteSalLokale')
    })




    setInterval(() => moveBtn('#nextFloorBtn3'), 500)


   select('#nextFloorBtn4').mousePressed(() => {
    shiftPage('#exit')
    select('#sidsteQuestion').html(sidsteSpørgsmål.spørgsmål)
    select('#sidsteSvar0').html(sidsteSpørgsmål.muligheder[0])
    select('#sidsteSvar1').html(sidsteSpørgsmål.muligheder[1])
    select('#sidsteSvar2').html(sidsteSpørgsmål.muligheder[2])
    select('#sidsteSvar3').html(sidsteSpørgsmål.muligheder[3])
    select('#sidsteDialogue').addClass('show')
})
    setInterval(() => moveBtn('#nextFloorBtn4'), 400)


    select('#sidsteSpørgsmålBtn').mousePressed(() => {
        select('#sidsteQuestion').html(sidsteSpørgsmål.spørgsmål)
        select('#sidsteSvar0').html(sidsteSpørgsmål.muligheder[0])
        select('#sidsteSvar1').html(sidsteSpørgsmål.muligheder[1])
        select('#sidsteSvar2').html(sidsteSpørgsmål.muligheder[2])
        select('#sidsteSvar3').html(sidsteSpørgsmål.muligheder[3])
        select('#sidsteDialogue').addClass('show')
    })

    select('#sidsteSvar0').mousePressed(() => checkSidste(0))
    select('#sidsteSvar1').mousePressed(() => checkSidste(1))
    select('#sidsteSvar2').mousePressed(() => checkSidste(2))
    select('#sidsteSvar3').mousePressed(() => checkSidste(3))



}



// ============================================
// SHIFTPAGE — skifter mellem rum/sider
// ============================================
function shiftPage(newPage) {
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}

// ============================================
// TIMER
// ============================================
function startTimer() {
    seconds = 0
    timerInterval = setInterval(() => {
        seconds++
        select('#timer').html(seconds + ' sek')
    }, 1000)
}

// ============================================
// OPPDATERET QUIZ LOGIK (4 SVARMULIGHEDER)
// ============================================
function showQ() {
    // Opdaterer spørgsmålsteksten
    select("#question").html(questions[q].spørgsmål);

    // Indsætter tekst på de 4 svarknapper ud fra det aktuelle array
    select("#btn0").html(questions[q].muligheder[0]);
    select("#btn1").html(questions[q].muligheder[1]);
    select("#btn2").html(questions[q].muligheder[2]);
    select("#btn3").html(questions[q].muligheder[3]);
}

function checkAnswer(valgtIndex) {
    if (questions[q].svar === valgtIndex) {
        score++;
        q++;


        if (q >= questions.length) {
            simonTronRoomPermission = true
            // Send dem tilbage til etagen
            shiftPage('#førsteSalLokale')
            simonDialogueStep = 2
            select("#simonTronQuestion").html("Du kan nu gå videre");
            select('#simonTronDialogue').addClass('show');

        } else {
            showQ();
        }
    }
    // Hvis svaret er forkert
    else {
        attempts--;


        var circles = selectAll("#kemi-attempts .circle");
        var lastCircle = circles[circles.length - 1];
        if (lastCircle) lastCircle.elt.remove();


        if (attempts <= 0) {
            shiftPage("#failScreen");
        } else {

            select('#wrongAnswer').style('display', 'block');
            setTimeout(() => {
                select('#wrongAnswer').style('display', 'none');
            }, 1500);
        }
    }








}

// ============================================
// START SPIL
// ============================================
function startGame() {
    gameState = 0
    symbolsFound = 0
    cloudStep = 0
    startTimer()
    shiftPage('#room1')
}

// ============================================
// RUM 1 & 2 LOGIK
// ============================================
function findSymbol(id) {
    select(id).hide()
    symbolsFound++
    select('#room1-found').html('Fundet: ' + symbolsFound + ' / 3')

    if (symbolsFound === 3) {
        gameState = 1
        shiftPage('#room2')
    }
}

function clickCloud(id) {
    if (id === cloudAnswer[cloudStep]) {
        cloudStep++
    } else {
        cloudStep = 0
    }

    if (cloudStep === cloudAnswer.length) {
        select('#room2 #room2-code').addClass('show')
    }
}

function checkRoom2Answer() {
    var answer = select('#room2 #room2-answer').value().toLowerCase()
    if (answer.includes('kort')) {
        gameState = 2
        stopTimer()
        select('#final-time').html('Din tid: ' + seconds + ' sekunder')
        shiftPage('#complete')
    } else {
        select('#room2 #room2-error').html('Ikke helt - prøv igen!')
    }
}

// ============================================
// HIGH SCORE & RESET
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
    scoresRef.add({
        name: name,
        seconds: seconds,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        select('#btn-save').html('Gemt!')
        select('#btn-save').attribute('disabled', true)
        loadHighScores()
    })
}



function stopTimer() {
    clearInterval(timerInterval)
}

function resetGame() {
    select('#timer').html('0 sek')
    select('#room1-found').html('Fundet: 0 / 3')
    select('#room1 #symbol1').show()
    select('#room1 #symbol2').show()
    select('#room1 #symbol3').show()
    select('#room2 #room2-code').removeClass('show')
    select('#room2 #room2-answer').value('')
    select('#room2 #room2-error').html('')
    select('#btn-save').removeAttribute('disabled')
    select('#btn-save').html('Gem high score')
    select('#player-name').value('')
    shiftPage('#start')
}

function restartGame() {
    attempts = maxAttempts
    select('#kemi-attempts').html('')
    for (var i = 0; i < maxAttempts; i++) {
        var circle = createDiv()
        circle.addClass("circle")
        select('#kemi-attempts').child(circle)
    }
    kemiTask = 0
    elementsFound = 0
    kemiTargets = ["carbon", "hydrogen", "oxygen"]
    selectAll('#periodiskSystem .elementHotspot').map(el => el.show())
    shiftPage('#kemiLokale')

}





function kemiOpgave(clickedElement, elementId) {
    if (kemiTargets.includes(clickedElement)) {
        select(elementId).hide()
        elementsFound++
        kemiTargets = kemiTargets.filter(t => t !== clickedElement) // fjern det klikkede element
        if (kemiTask === 0 && elementsFound === 3) {
            kemiTask = 1
            elementsFound = 0
            kemiTargets = ["silver"]
            select("#kemi-hint").html(kemiHints[1])

        } else if (kemiTask === 1 && elementsFound === 1) {
            kemiTask = 2
            elementsFound = 0
            kemiTargets = ["copper"]
            select("#kemi-hint").html(kemiHints[2])

        } else if (kemiTask === 2 && elementsFound === 1) {
            select("#kemi-hint").html("Du fandt alle stofferne, du må nu gå ud!")
            kemiRoomPermission = true
            shiftPage("#kemiLokale")
        }


    } else {
        attempts--
        var circles = selectAll("#kemi-attempts .circle")
        var lastCircle = circles[circles.length - 1]
        if (lastCircle) lastCircle.elt.remove()

        if (attempts <= 0) {
            shiftPage("#failScreen")
        } else {
            select('#wrongAnswer').style('display', 'block')
            setTimeout(() => {
                select('#wrongAnswer').style('display', 'none')
            }, 2000)
        }
    }
}


function moveBtn(button) {
    var positions = [
        { top: "20%", left: "10%" },
        { top: "20%", left: "80%" },
        { top: "50%", left: "20%" },
        { top: "50%", left: "70%" },
        { top: "70%", left: "40%" },
        { top: "70%", left: "10%" },
        { top: "30%", left: "50%" },
        { top: "80%", left: "70%" },
    ]
    var newPos = positions[Math.floor(random(positions.length))]
    select(button).style('top', newPos.top)
    select(button).style('left', newPos.left)
}


function killHaack(Haack) {
    Haack.remove()
    gamePoints += 5
    pointsDisplay.html(gamePoints)
    if (gamePoints >= 100) {
        clearInterval(gameTimer)
        gameContainer.html('')
        arkadeRoomPermission = true
        select("#gameGoal").html("Du vandt")
        shiftPage('#arkadeRum')
        return
    }
    spawnHaack()
}

function timeoutHaack(haack) {
    if (gameContainer.elt.contains(haack.elt)) {
        haack.remove()
        gamePoints -= 2
        if (gamePoints < 0) gamePoints = 0
        pointsDisplay.html(gamePoints)
        spawnHaack()
    }
}

function spawnHaack() {
    var pos = holePositions[floor(random(holePositions.length))]
    var newHaack = createImg("./assets/haack.png")
    newHaack.addClass("haack")
    newHaack.style("top", pos.top)
    newHaack.style("left", pos.left)
    gameContainer.child(newHaack)
    newHaack.mousePressed(() => { killHaack(newHaack) })
    setTimeout(() => { timeoutHaack(newHaack) }, 1500)
}

function startArcadeGame() {
    clearInterval(gameTimer)
    gameContainer = select("#gameContainer")
    pointsDisplay = select("#pointsDisplay")
    timeleftDisplay = select("#timeleftDisplay")
    gamePoints = 0
    gameTimeleft = 30

    gameContainer.html('')
    pointsDisplay.html(gamePoints)
    timeleftDisplay.html(gameTimeleft)

    gameTimer = setInterval(() => {
        gameTimeleft -= 1
        timeleftDisplay.html(gameTimeleft)
        if (gameTimeleft <= 0) {
            clearInterval(gameTimer)
            gameContainer.html('')
            alert("Du fik " + gamePoints + " point!")
            if (gamePoints >= 100) {
                arkadeRoomPermission = true
                shiftPage('#arkadeRum')
            }
            else {
                attempts--
                var circles = selectAll("#kemi-attempts .circle")
                var lastCircle = circles[circles.length - 1]
                if (lastCircle) lastCircle.elt.remove()
                select('#tryAgainHaack').style('display', 'block')
            }
            if (attempts <= 0) {
                shiftPage("#failScreen")
            }


        }
    }, 1000)

    spawnHaack()
}


function restartQuiz() {
    q = 0;
    score = 0;
    showQ();

}




function checkSidste(valgtIndex) {
    if (sidsteSpørgsmål.svar === valgtIndex) {
        select('#sidsteDialogue').removeClass('show')
        stopTimer()
        select('#final-time').html('Din tid: ' + seconds + ' sekunder')
        loadHighScores()
        shiftPage('#complete')
    } else {
        select('#sidsteDialogue').removeClass('show')
        var circles = selectAll("#kemi-attempts .circle")
        circles.map(circle => circle.elt.remove())
        attempts = 0
        shiftPage("#failScreen")
    }
}