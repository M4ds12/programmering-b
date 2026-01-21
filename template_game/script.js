var gameContainer = document.querySelector("#gameContainer")
var pointsDisplay = document.querySelector("#pointsDisplay")
var timeleftDisplay = document.querySelector("#timeleftDisplay")
var timeout = 1000
var points = 0
var timeleft = 10

function killAsta(asta) {
    gameContainer.removeChild(asta)
    points += 5
    pointsDisplay.textContent = points
    spawnAsta()
}

function timeoutAsta(asta){
    if(gameContainer.contains(asta)) {
    gameContainer.removeChild(asta)
    points -=2   
    pointsDisplay.textContent = points 
    spawnAsta()
    }
    
}


function spawnAsta() {
    var newAsta = document.createElement("img")
    var astaTop = Math.random() * 90
    var astaLeft = Math.random() * 90
    newAsta.style = `left: ${astaLeft}%; top: ${astaTop}%;`
    newAsta.src = "assets/asta.png"
    newAsta.className = "asta"
    gameContainer.appendChild(newAsta)
    newAsta.addEventListener("click", () => { killAsta(newAsta) })
    setTimeout(() => { timeoutAsta(newAsta) }, timeout)
    
}

setInterval(() => {
    timeleft -= 1
    timeleftDisplay.textContent = timeleft
    if (timeleft == 0) {
        confirm(`You got ${points} points!`)
        location.reload()
}
}, 1000)

timeleftDisplay.textContent = timeleft
pointsDisplay.textContent = points

spawnAsta()