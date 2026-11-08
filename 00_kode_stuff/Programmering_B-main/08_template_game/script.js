
//we select the id='game-container' from html - and save it in a var called game_container
var game_container = document.querySelector('#game-container')
var points_display = document.querySelector('#points-display')
var time_display = document.querySelector('#time-display')
var timeout = 2000
var points = 0
var time_left = 10

function KillAsta(asta) {
    game_container.removeChild(asta)
    points += 5
    points_display.textContent = points
    spawnAsta()
}
function TimeoutAsta(asta) {
    if (game_container.contains(asta)){
        game_container.removeChild(asta)
        points -= 2
        points_display.textContent = points
        spawnAsta()
    }
}
//setinterval runs a function every x interval
//ÆNDR LILLE s TIL sTORT
function spawnAsta() {
    var new_asta = document.createElement('img')
    var top = Math.random() * 91
    var left = Math.random() * 91
    new_asta.style = `left: ${left}%; top: ${top}%;`
    new_asta.src = 'assets/mads.gif'
    //we add a classname to it so we can style it in css
    new_asta.className = 'asta'
    //we put a new img element insside the game container
    game_container.appendChild(new_asta)
    //when we click the new img element, we call the KillAsta function which removess it
    new_asta.addEventListener('click', () => {KillAsta(new_asta) })
    setTimeout(() => {
        TimeoutAsta(new_asta)
    }, timeout)
}

setInterval(() => {
    time_left -= 0.1
    time_display.textContent = Math.round(time_left * 10) / 10
    if (time_left <= 0){
        confirm(`You got ${points} points!`)
        location.reload()
    }
}, 100)

time_display.textContent = time_left

spawnAsta()


