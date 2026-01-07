var gameContainer = document.querySelector("#gameContainer")

function killAsta(asta) {
    gameContainer.removeChild(asta)
}


setInterval(() => {
    var newAsta = document.createElement("img")
    newAsta.src = "assets/asta.png"
    newAsta.className = "asta"
    gameContainer.appendChild(newAsta)
    newAsta.addEventListener("click", () => { killAsta(newAsta)
    })
}, 1250)