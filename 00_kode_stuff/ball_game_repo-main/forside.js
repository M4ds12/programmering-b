var state
var points = 0
var timer = 0
var player = {
    name: "",
    highscoreFlappy: 0,
    highscorePool: 0,
    highscoreRicochet: 0,

}
var player
var currentPage = "#page0"
var other
var playerFlappy
var canvas

//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    state = "setup"
    gravity = createVector(0, 0.5)
    friction = 0.99
    //Sæt draw loop op

    
    setTimeout(()=>{
      shiftPage('#page1')
    },2000)
    // startFlappyBirds()
    select('#flappyBirdButton').mousePressed(() => {
      startFlappyBirds()
    })
    

    flappyCanvas = createCanvas(windowWidth, windowHeight)
    flappyCanvas.parent("#page2")
}

function draw(){
    if (state == "flappy") {
        background("hotpink")
        playerFlappy.show()
        playerFlappy.update()
        playerFlappy.constrain()
        playerFlappy.bounce(other)
        //countHit(playerFlappy, other)
        //showOther()
        console.log(playerFlappy.position.x)
        other.show()



        /*  
        background('lightpink')
        jump.update()
        jump.constrain()
        countHit(jump, other)
        jump.bounce(other)
        jump.show()
        showOther()*/
    }
}


function startFlappyBirds(){
    state = "flappy"
    points = 0
    timer = 20
    shiftPage('#page2')
    playerFlappy = new JumpingBall(/*x*/100, /*y*/100, /*r*/25, /*img*/null, /*jump*/14, /*col*/"#ffd700", /*bounds*/[true, true, true, true])
    other = new Ball(230,130,100, null, "rgb(117, 21, 186)", 0, 0, [true, true, true, true])

    /* 
    class JumpingBall extends Ball{
  constructor(x, y, r, img, jump, col, bounds){
    super(x, y, r, img, col, 0, 0, bounds || [false, false, false, true])
    this.jumpForce = jump
  }
  update(){
    this.velocity.add(gravity)
    this.velocity.y *= friction
    super.update()
  }
  jump(){
    this.velocity.y -= this.jumpForce
  }
}
*/
}

function keyPressed(){
    if(state == 'flappy' && key == ' ') playerFlappy.jump()
    //if(currentPage == '#page5' && key == ' ') shoot.shoot()
    //if(keyCode == UP_ARROW || keyCode == DOWN_ARROW || keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) return false
}

/* function countHit(a, b){
    var h = a.hit(b)
    if(h && !a.wasHit){
        hits++
        select('#g-points').html(hits)
    }
    a.wasHit = h
} */