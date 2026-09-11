class Ball {
  constructor(x, y, r, col, jump){ 
    this.radius = r
    this.col = col
    this.velocity = createVector(0, 0)
    this.position = createVector(x, y)
    this.jumpForce = jump
  }
  update(){
    this.velocity.add(gravity)
    this.velocity.y *= friction 
    this.position.add(this.velocity)
  }
  constrain(){
    if(this.position.y > height - this.radius/2){
      this.position.y = height - this.radius/2
      this.velocity.y *= -1
    }
  }
  jump(){
    this.velocity.y -= this.jumpForce
  }
  
  show(){
    fill(this.col)
    circle(this.position.x, this.position.y, this.radius)
  }
}