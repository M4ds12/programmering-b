
function setup(){
    //mqtt er et objekt vi får fra mqtt biblioteket i html siden
    client = mqtt.connect("wss://mqtt.nextservices.dk")

    client.on('connect', msg => {
        //console.log("msg")
        console.log("Forbundet til NEXT MQTT server")
        select("#toast").html("Forbundet til NEXT MQTT server")
        setTimeout(() => select("#toast").style("top", "50%"), 400)
        setTimeout(() => select("#toast").style("top", "-100%"), 8000)
    
    })
    
    client.subscribe('mads')
    client.subscribe('mads/page')




    //Her får vi beskeder på forskellige topics vi abonnerer på
    client.on('message', (topic, msg) => {
    console.log(topic, msg)
    if(topic.includes('page')){
        console.log("nu skal der skiftes side")
        //Er det et tal?
        msg = '#page' + msg
        shiftPage(msg)
        
    }
    if(topic == 'mads'){
    select("#msg").elt.textContent = 'Besked på topic' + topic + ' med teksten ' + msg
    }

    })

    client.publish('programmering/page', '')
}


var currentPage = "#page1"
var readyToShift = true
function shiftPage(newPage){
    if(!select(newPage)) return
    select(currentPage).removeClass("show")
    currentPage = newPage
    select(currentPage).addClass("show")
    readyToShift = false
    setTimeout(()=>readyToShift = true, 5000)
}