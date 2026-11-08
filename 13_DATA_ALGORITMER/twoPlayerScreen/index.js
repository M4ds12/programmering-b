//array med alle rick and morty karaktererne
var characters = []
//mqtt "walkie talkie" kalder vi for client 
var client
//topic er det mqtt emne vi skal bruge
var topic = "karaktervalg"

//to globale variable der holder styr på hvilken karakter billede spillerne har valgt
var playerAIndex = 0
var playerBIndex = 0
var playerALocked = false
var playerBLocked = false
var currentIndex


function setup() {
    // Hent kataloget, lyt på MQTT og opdatér fællesskærmen her.
    getCharacters()
    //init mqtt
    client = mqtt.connect('wss://mqtt.nextservices.dk')
    client.on('connect', () => {
        showToast('Forbundet til MQTT')
        client.subscribe(topic)
    })
    client.on('message', (topic, ms) => {
        //showToast(`Modtog besked: ${ms.toString()}`)
        var msObject = JSON.parse(ms.toString())
        console.log(msObject.name)

        if (msObject.action == "choose character") {
            select(`#player${msObject.name}`).addClass("selected")

        }


        if (msObject.action == "select") {
            if (msObject.name == "A") {
                playerALocked = true
                currentIndex = playerAIndex
            } else if (msObject.name == "B") {
                playerBLocked = true
                currentIndex = playerBIndex
            }

            var chosenCharacter = characters[currentIndex]
            showToast(`Spiller ${msObject.name} har valgt ${chosenCharacter.name} <img src="${chosenCharacter.image}" width="50">`, 3000)
            console.log("TOAST!!!")
        }


        if (msObject.action == "unselect") {
            if (msObject.name == "A") {
                playerALocked = false
            } else if (msObject.name == "B") {
                playerBLocked = false
            }

            showToast(`Spiller ${msObject.name} har fortrudt sit valg`, 3000)
        }


        if (msObject.action == "forward") {
            if (playerALocked == true) {
                console.log("Du kan ikke gå videre")
            }
            if (msObject.name == "A" && playerALocked) return
            if (msObject.name == "B" && playerBLocked) return
            console.log("du kom videre")
            if (msObject.name == "A" && playerAIndex >= characters.length - 1) return
            if (msObject.name == "B" && playerBIndex >= characters.length - 1) return


            var i = eval(`++player${msObject.name}Index`)

            select(`#player${msObject.name} img`).attribute("src", characters[i].image)
            select(`#player${msObject.name} h2`).html(characters[i].name)


            if (msObject.name == "A") {
                currentIndex = playerAIndex
            } else {
                currentIndex = playerBIndex
            }


        }

        if (msObject.action == "back") {

            if (msObject.name == "A") {
                currentIndex = playerAIndex
            } else {
                currentIndex = playerBIndex
            }

            if (currentIndex <= 0) return


            if (msObject.name == "A" && playerALocked) return
            if (msObject.name == "B" && playerBLocked) return
            var i = eval(`--player${msObject.name}Index`)
            select(`#player${msObject.name} img`).attribute("src", characters[i].image)
            select(`#player${msObject.name} h2`).html(characters[i].name)
        }



    })

}

async function getCharacters() {
    //Vi starter med at hente karakterne i Rick Morty API
    characters = await getJSON('https://rickandmortyapi.com/api/character?page=1')
    characters = characters.results
    select('#playerA img').attribute("src", characters[0].image)
    select('#playerA h2').html(characters[0].name)
    select('#playerB img').attribute("src", characters[0].image)
    select('#playerB h2').html(characters[0].name)
    showCharacters(characters)





}

function showCharacters(characters) {
    characters.map(c => {
        var card = createCard(c.name, c.species, c.image)
        select('#characters').child(card)
    })
}