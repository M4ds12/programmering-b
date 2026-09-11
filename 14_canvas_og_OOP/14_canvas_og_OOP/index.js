var gravity 
var friction  
var b

function setup() {
  createCanvas(windowWidth, windowHeight)
  gravity = createVector(0, 0.5)
  friction = 0.99

  b = new Ball(width/2, 0, 24, "orange", 12)
}

function draw() {
  background(100)
  b.update()
  b.constrain()
  b.show()
}

function keyPressed(){
  if(key == " "){
    b.jump()
  }
}

