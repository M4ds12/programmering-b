//array med alle rick and morty karaktererne
var characters = []
//mqtt "walkie talkie" kalder vi for client 
var client 
//topic er det mqtt emne vi skal bruge
var topic = "viggoKaraktervalg"

//to globale variable der holder styr på hvilken karakter billede spillrne har valgt
var playerAIndex = 0 
var playerBIndex = 0
var playerALocked = false
var playerBLocked = false

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
        showToast(`Modtog besked: ${ms.toString()}`)    
        var msObject = JSON.parse(ms.toString())
        console.log(msObject.name)
        if(msObject.action == "choose character"){
            if(select(`#player${msObject.name}`)){
                select(`#player${msObject.name}`).addClass('selected')
            }
        }
        if(msObject.action == "forward"){
            //hent variablen emd det rigtige index til den her spiller 
            //tæl den op 
            var i = eval(`player${msObject.name}Index++`)
            //skift billede
            select(`#player${msObject.name} img`).attribute("src", characters[i].image)
            select(`#player${msObject.name} h2`).html(characters[i].name)
        }
        if(msObject.action == "backward"){
            //hent variablen emd det rigtige index til den her spiller 
            //tæl den ned
            var i = eval(`player${msObject.name}Index--`)
            //skift billede
            select(`#player${msObject.name} img`).attribute("src", characters[i].image)
            select(`#player${msObject.name} h2`).html(characters[i].name)
        }
        if(msObject.action == "selected"){
            //lås karakter - gør index urokkeligt
            //tæl den ned
            
        }
    } )

}

async function getCharacters(){
    //Vi starter med at hente karakterne i Rick Morty API
    characters = await getJSON('https://rickandmortyapi.com/api/character?page=1')
    //sæt den globale variabel characters til at være arrayet med karakterer 
    characters = characters.results
    select('#playerA img').attribute("src", characters[0].image)
    select('#playerA h2').html(characters[0].name)
    select('#playerB img').attribute("src", characters[0].image)
    select('#playerB h2').html(characters[0].name)
    showCharacters(characters)
}

function showCharacters(characters){
    characters.map( c => {
        var card = createCard(c.name, c.species, c.image)        
        select('#characters').child(card)
    })    
}