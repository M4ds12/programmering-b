var client
var topic = "karaktervalg"
var me
var isSelected = false
function setup() {
    // Bind controllerens knapper og send handlinger over MQTT her.
    client = mqtt.connect('wss://mqtt.nextservices.dk')
    client.on('connect', () => {
        showToast('Forbundet til MQTT')
        client.subscribe(topic)
    })
    client.on('message', (topic, ms) => {
        //showToast(`Modtog besked: ${ms.toString()}`) 
        var msObject = JSON.parse(ms.toString()) 
        console.log(msObject.name)


         if(msObject.action == "choose character"){
         if(select(`#player${msObject.name}`)){
        select(`#player${msObject.name}`).hide()
        
    }
}

    } )

    select("#playerA").mousePressed(() => choosePlayer("A"))
    select("#playerB").mousePressed(() => choosePlayer("B"))
    select("#forward").mousePressed(() => choice("forward"))
    select("#back").mousePressed(() => choice("back"))
    select("#select").mousePressed(() => {
    if (!isSelected) {
        choice("select")
        select("#select").html("Unselect")
        isSelected = true
    } else {
        choice("unselect")
        select("#select").html("Select")
        isSelected = false
    }
})
   
    
       
    
}


function choosePlayer(name){
    me = name
    var obj = {
        "name":name,
        action:"choose character"
    }
    obj = JSON.stringify(obj)
    client.publish(topic, obj)
    select("#name").html(`I am${me}`)
    shiftPage("#choose")
}

function choice(direction){
 var obj = {
        "name":me,
        action:direction
    }
    obj = JSON.stringify(obj)
    client.publish(topic, obj)
}