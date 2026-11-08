// Globale variabler
var player
var playerImg
var bullets = []
var bulletImg
var enemies = []
var enemyImg = []
var enemyMinSize = 30
var enemyMaxSize = 80
var fb



//musik og lyd
var bgMusic
var deathSound
var bSound


var playing = false
var gameOver = false
var timerInterval = null
var seconds = 0

// Liv og din score
var maxHealth = 10
var health = maxHealth
var kills = 0
var healPerRound = 1 // sæt til 0 hvis du ikke vil have liv tilføjet til dig (dvs healing) mellem runder

// Runder
var round = 0
var enemiesToSpawn = 0
var enemySpeed = 1.5
var spawnDelay = 60
var spawnTimer = 0
var roundPause = 0 // Antallet af frames hvor det kæmpe "Runde (insert antal runder)" banner vises. Her spawnes der ikke fjender og det fader ud

// Shooting
var shootCooldown = 0
var shootDelay = 12 // frames mellem skud (hold musen nede for at skyde)
var bulletSpeed = 12


async function setup() {
    playerImg = await loadImage('./assets/verity.png')
    bulletImg = await loadImage('./assets/verity.png')
    enemyImg = [
        await loadImage('./assets/falsity.png'),
        await loadImage('./assets/lovity.png'),
        await loadImage('./assets/cruelty.png'),
        await loadImage('./assets/curiosity.png'),
        await loadImage('./assets/eclipsity.png')
    ]

    bgMusic = new Audio('./assets/verityBGM.mp3')
    bgMusic.loop = true
    bgMusic.volume = 0.25

    bSound = await loadSound("../../api_lib/sounds/beep.mp3")
    deathSound = await loadSound("./assets/deathSound.mp3")
    var c = createCanvas(windowWidth, windowHeight)
    select('#page2').child(c)

    select('#startButton').mousePressed(() => {
        getAudioContext().resume()
        startGame()
        shiftPage('#page2')
    })

    select('#restartButton').mousePressed(() => {
        startGame()
        shiftPage('#page2')
    })

    player = new Player(width / 2, height / 2, 60, "orange", playerImg)

    // Highscore-liste (højeste point først)
    fb = new Firebase("veritySpil")
    fb.listen(updateHighscore, 10, "points", "desc")

    select('#btn-save').mousePressed(() => {
        saveHighScore()
    })
}



function startGame() {
    bgMusic.pause()
    bgMusic.currentTime = 0
    if (bgMusic.paused) bgMusic.play()
    health = maxHealth
    kills = 0
    round = 0
    bullets = []
    enemies = []
    gameOver = false
    playing = true
    player.position = createVector(width / 2, height / 2)
    startRound()
    startTimer()
}

function startRound() {
    round++
    enemiesToSpawn = 4 + round * 3                    // flere fjender hver runde
    enemySpeed = min(1.5 + round * 0.2, 5)            // og de bliver hurtigere
    spawnDelay = max(15, 60 - round * 4)              // og spawner tættere
    spawnTimer = 0

    roundPause = 120     //2 gange 60, roundPause går ned med 1 per frame og draw kører 60 frames i sekundet. Så 2 sekunder

    if (round > 1) {
        health = min(maxHealth, health + healPerRound)
    }
}

function endGame() {
    playing = false
    gameOver = true
    stopTimer()
    bgMusic.pause()
    bgMusic.currentTime = 0
    deathSound.play()

    // Nulstil gem-knappen til næste spil
    select('#btn-save').html('Gem high score')
    select('#btn-save').removeAttribute('disabled')
    select('#player-name').value('')

    shiftPage('#page3')
    select("#stats").html(
        "Du nåede runde " + round + ", dræbte " + kills +
        " Verities og varede " + seconds + " sekunder"
    )
}


function draw() {
    clear()
    if (!playing) return

    //Skyd
    if (shootCooldown > 0) shootCooldown--
    if (mouseIsPressed && shootCooldown === 0) {
        shoot()
    }

    //Spawn fjender
    if (roundPause > 0) {
        roundPause--
    } else if (enemiesToSpawn > 0) {
        spawnTimer++
        if (spawnTimer >= spawnDelay) {
            spawnEnemy()
            enemiesToSpawn--
            spawnTimer = 0
        }
    }

    // Ny runde når alt er dræbt
    if (roundPause == 0 && enemiesToSpawn == 0 && enemies.length == 0) {
        startRound()
    }

    //Patroner
    for (var i = bullets.length - 1; i >= 0; i--) {
        var bl = bullets[i]
        bl.update()
        bl.show()

        var bulletUsed = false
        for (var j = enemies.length - 1; j >= 0; j--) {
            var en = enemies[j]
            if (bl.hit(en)) {
                en.hp--
                en.flash = 5
                bulletUsed = true
                if (en.hp <= 0) {
                    enemies.splice(j, 1)
                    kills++
                    bSound.play()
                }
                break
            }
        }

        if (bulletUsed || bl.isOffScreen()) {
            bullets.splice(i, 1)
        }
    }


    for (var k = enemies.length - 1; k >= 0; k--) {
        var e = enemies[k]
        e.update()
        e.show()

        if (player.hit(e)) {
            health--
            player.flash = 8
            enemies.splice(k, 1)
           bSound.play()
        }
    }


    player.show()

    
    drawHUD()

    if (health <= 0) {
        endGame()
    }
}

function drawHUD() {
    // Health bar
    var barWidth = 200
    noStroke()
    fill(40)
    rect(20, 20, barWidth, 20, 4)
    fill(220, 60, 60)
    rect(20, 20, barWidth * (max(health, 0) / maxHealth), 20, 4)

    // Tekst
    fill(255)
    textSize(18)
    textAlign(LEFT, TOP)
    text("Runde " + round + "   Kills: " + kills, 20, 50)

    // Runde-banner
    if (roundPause > 0) {
        textAlign(CENTER, CENTER)
        textSize(64)
        fill(255, 255, 255, min(255, roundPause * 4))
        text("Runde " + round, width / 2, height / 3)
    }
}



//
function keyPressed() {
    if (key == " " && playing && shootCooldown === 0) {
        shoot()
    }
}

function shoot() {
    var angle = atan2(mouseY - player.position.y, mouseX - player.position.x)
    bullets.push(new Bullet(player.position.x, player.position.y, angle, bulletImg))
    shootCooldown = shootDelay
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    if (player) player.position = createVector(width / 2, height / 2)
}


//Spawn halløjsa
function spawnEnemy() {
    var r = random(enemyMinSize, enemyMaxSize)

    var bigChance = min(0.08 * round, 0.8)
    if (random() < bigChance) {
        var range = enemyMaxSize - enemyMinSize
        r = random(enemyMinSize + range * 0.6, enemyMaxSize)
    }

    var x, y
    var side = floor(random(4))

    if (side === 0) {          // top
        x = random(width); y = -r
    } else if (side === 1) {   // højre
        x = width + r; y = random(height)
    } else if (side === 2) {   // bund
        x = random(width); y = height + r
    } else {                   // venstre
        x = -r; y = random(height)
    }

    enemies.push(new Enemy(x, y, r, enemySpeed, enemyImg))
}


function startTimer() {
    clearInterval(timerInterval)
    seconds = 0
    select('#timer').html(seconds + ' sek')
    timerInterval = setInterval(() => {
        seconds++
        select('#timer').html(seconds + ' sek')
    }, 1000)
}

function stopTimer() {
    clearInterval(timerInterval)
}


function updateHighscore(scores) {
    select('#score-list').html('')
    scores.map(p => {
        var li = createElement('li')
        li.child(createElement('span', "Navn: " + p.name))
        li.child(createElement('span', "Kills: " + p.points))

        // 
        if (p.round) {
            li.child(createElement('span', 'Runde: ' + p.round))
        }
        if (p.seconds) {
            li.child(createElement('span', "Sekunder: " + p.seconds))
        }

        select('#score-list').child(li)
    })
}

function saveHighScore() {
    var name = select('#player-name').value().trim()
    if (name === '') {
        showToast("Du skal skrive et navn først!", 2000, "warning")
        return
    }
    fb.save(name, kills, { round: round, seconds: seconds })
    select('#btn-save').html('Gemt!')
    select('#btn-save').attribute('disabled', true)
}