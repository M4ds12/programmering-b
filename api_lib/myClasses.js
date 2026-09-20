
class Ball {
    constructor(x, y, r, col, jump, img) {
        this.diam = r
        this.col = col
        this.img = img
        this.velocity = createVector(0, 0)
        this.position = createVector(x, y)
        this.jumpForce = jump
        this.wasHit = false
    }
    update() {
        this.velocity.add(gravity)
        this.velocity.y *= friction
        this.position.add(this.velocity)
    }
    constrain() {
        if (this.position.y > height - this.diam / 2) {
            this.position.y = height - this.diam / 2
            this.velocity.y *= -1
        }

        //Sørg for at bolden kun går halvt ud af skærmen på toppen
        if (this.position.y < this.diam / 2) {
            this.position.y = this.diam / 2
            this.velocity.y *= -1
        }

    }
    jump() {
        this.velocity.y -= this.jumpForce
    }

    show() {
        if (this.img) {
            imageMode(CENTER)
            image(this.img, this.position.x, this.position.y, this.diam, this.diam)
        } else {
            fill(this.col)
            circle(this.position.x, this.position.y, this.diam)
        }

    }
    hit(anotherBall) {
        var b = anotherBall
        var totalR = (this.diam + b.diam) / 2
        var d = dist(this.position.x, this.position.y, b.position.x, b.position.y)

        if (d <= totalR) {
            return true
        } else {
            return false
        }
    }
}

class FloatingBall extends Ball {
    constructor(x, y, r, col, jump, speed, img) {
        //super betyder at vi overtager disse argumenter fra "super" klassen (Ball)
        super(x, y, r, col, jump, img)
        //vi overskriver velocity vektoren med en lokal der flytter sig på x aksen 
        this.velocity = createVector(speed, 0)
    }
    update() {
        this.position.add(this.velocity)
    }

    constrain() {
        //sørg for at floatingball bouncer på siderne
        this.position.x = constrain(this.position.x, this.diam / 2, windowWidth - this.diam / 2)

        if (this.position.x <= this.diam / 2 || this.position.x >= windowWidth - this.diam / 2) {
            this.velocity.mult(-1)
        }

    }

}


class SideBall extends Ball {
    constructor(x, y, r, col, jump, speed, img) {
        super(x, y, r, col, jump, img)
        this.velocity = createVector(speed, 0)
    }
    update() {
        this.position.add(this.velocity)
    }
    isOffScreen() {
        return this.position.x < -this.diam || this.position.x > windowWidth + this.diam
    }
}


class Firebase {
    constructor(collection) {
        this.ref = db.collection(collection)
    }

    save(name, points, more = {}) {
        var data =({
            name: name,
            points: points,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

       for (var key in more) {
        if (more[key] !== undefined) {
            data[key] = more[key]
        }
    }

    this.ref.add(data)

    }

    listen(onUpdate, limit, sort, dir = 'desc') {
        this.ref.orderBy(sort, dir).limit(limit).onSnapshot(snap => {
            var list = []
            snap.forEach(doc => list.push(doc.data()))
            onUpdate(list)
        })
    }
}



class Player extends Ball {
    constructor(x, y, r, col, img) {
        super(x, y, r, col)
        this.img = img
        this.flash = 0
    }

    show() {

        var angle = atan2(mouseY - this.position.y, mouseX - this.position.x)
        stroke("hotpink")
        strokeWeight(10)
        line(
            this.position.x, this.position.y,
            this.position.x + cos(angle) * this.diam * 1.9,
            this.position.y + sin(angle) * this.diam * 1.9
        )

        //Når du rammes "flasher" (du bliver hvid) hvis. Draw kører 60 gange i sekundet, med 60 frames.
        //Hvert nummer flash er på er 1 frame du flasher i. Dvs hvis flash er sat til 10, er din spiller en anden farve i 10 frames.
        if (this.img) {
            // Billede: tint det rødt når man bliver ramt
            if (this.flash > 0) {
                tint(255, 80, 80)
                this.flash--
            }
            imageMode(CENTER)
            image(this.img, this.position.x, this.position.y, this.diam, this.diam)
            noTint()
        } else {
            // Ingen billede: blink hvid som før
            if (this.flash > 0) {
                fill(255)
                this.flash--
            } else {
                fill(this.col)
            }
            stroke(0)
            strokeWeight(2)
            circle(this.position.x, this.position.y, this.diam)
        }
    }
}

class Bullet extends Ball {
    constructor(x, y, angle, img) {
        super(x, y, 20, "yellow", 0, img)
        this.velocity = createVector(cos(angle), sin(angle)).mult(bulletSpeed)
    }

    update() {
        this.position.add(this.velocity)
    }

    show() {
        if (this.img) {
            imageMode(CENTER)
            image(this.img, this.position.x, this.position.y, this.diam, this.diam)
        } else {
            fill(this.col)
            noStroke()
            circle(this.position.x, this.position.y, this.diam)
        }

    }

    isOffScreen() {
        return (
            this.position.x < -this.diam || this.position.x > width + this.diam ||
            this.position.y < -this.diam || this.position.y > height + this.diam
        )
    }
}

class Enemy extends Ball {
    constructor(x, y, r, speed, imgs) {
        super(x, y, r, "lightblue", 0)


        this.imgs = imgs
        if (imgs) {
            this.tiers = imgs.length
        } else {
            this.tiers = 3
        }

        this.hp = floor(map(r, enemyMinSize, enemyMaxSize, 1, this.tiers + 1))
        this.hp = constrain(this.hp, 1, this.tiers)

        this.speed = speed * map(r, enemyMinSize, enemyMaxSize, 1.2, 0.7)
        this.flash = 0

    }

    update() {
        // Gå direkte mod spilleren
        var dir = createVector(player.position.x - this.position.x,
            player.position.y - this.position.y)
        dir.setMag(this.speed)
        this.velocity = dir
        this.position.add(this.velocity)
    }

    show() {
        // 0 = svageste niveau, 1 = stærkeste niveau
        var progress = (this.hp - 1) / max(this.tiers - 1, 1)

        var img = null
        if (this.imgs) {
            img = this.imgs[this.hp - 1]
        }

        if (img) {
            // Billedet bliver større jo mere liv fjenden har
            var imgSize = this.diam * map(progress, 0, 1, 0.8, 1.5)

            if (this.flash > 0) {
                tint(255, 80, 80)
                this.flash--
            }
            imageMode(CENTER)
            image(img, this.position.x, this.position.y, imgSize, imgSize)
            noTint()
        } else {
            // Ingen billeder, så farven glider fra lyseblå til rød
            if (this.flash > 0) {
                fill(255)
                this.flash--
            } else {
                var red = map(progress, 0, 1, 173, 255)
                var green = map(progress, 0, 1, 216, 99)
                var blue = map(progress, 0, 1, 230, 71)
                fill(red, green, blue)
            }
            noStroke()
            circle(this.position.x, this.position.y, this.diam)
        }
    }


}