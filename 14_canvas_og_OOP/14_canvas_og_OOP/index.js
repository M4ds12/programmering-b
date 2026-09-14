var gravity
var friction
var b
var points = 10
var bSound
var gameOver = false
var timerInterval = null
var seconds = 0
var floatingBalls = []
var spawnInterval = 90
var frameCounter = 0



async function setup() {
    bSound = await loadSound("/api_lib/sounds/beep.mp3")
    var c = createCanvas(windowWidth, windowHeight)
    select('#page2').child(c)
    select('#startButton').mousePressed(() => {
        getAudioContext().resume()
        shiftPage('#page2')
        startTimer()
    })


    gravity = createVector(0, 0.5)
    friction = 0.99

    select('#infoPoints').html(points)

    b = new Ball(windowWidth / 2, 0, 100, "orange", 12)
    //f = new FloatingBall(100, 100, 50, "lightblue", 0, 12)


    select('#restartButton').mousePressed(() => {
        points = 10
        gameOver = false
        b.position = createVector(windowWidth / 2, 0)
        b.velocity = createVector(0, 0)
        shiftPage('#page2')
        startTimer()
    })

}

function draw() {
    if (gameOver) return
    background(100)

    b.update()
    b.constrain()
    b.show()

   /* if (b.hit(f)) {
        if (!b.wasHit) {
            points--
            try {
                bSound.play()
            } catch (e) {
                console.log("sound not ready yet:", e)
            }
            b.wasHit = true
        }
    } else {
        b.wasHit = false
    } */

    select('#infoPoints').html(points)

    //f.update()
    //f.constrain()
    //f.show()

    frameCounter++
if(frameCounter >= spawnInterval){
  spawnFloatingBall()
  frameCounter = 0
  spawnInterval = random(60, 150)
}

for(var i = floatingBalls.length - 1; i >= 0; i--){
  var fb = floatingBalls[i]
  fb.update()
  fb.show()

  if(b.hit(fb)){
    if(!fb.wasHit){
      points--
      try {
        bSound.play()
      } catch(e) {
        console.log("sound skipped:", e.message)
      }
      fb.wasHit = true
    }
  }

  if(fb.isOffScreen()){
    floatingBalls.splice(i, 1)
  }
}



    if (points <= 0) {
        gameOver = true
        stopTimer()
        shiftPage('#page3')
        select("#stats").html("Du varede " + seconds + " sekunder")
        
    }

}

function keyPressed() {
    if (key == " ") {
        b.jump()
        //f.jump()
    }
}


function startTimer() {
    seconds = 0
    timerInterval = setInterval(() => {
        seconds++
        select('#timer').html(seconds + ' sek')
    }, 1000)
}

function stopTimer() {
    clearInterval(timerInterval)
}

function spawnFloatingBall(){
  var r = random(30, 150)
  var y = random(r, height - r)
  var speed = random(8, 30)

  var fromLeft = random() < 0.5
  var x = fromLeft ? -r : windowWidth + r
  var vel = fromLeft ? speed : -speed

  var newBall = new SideBall(x, y, r, "lightblue", 0, vel)
  floatingBalls.push(newBall)
}