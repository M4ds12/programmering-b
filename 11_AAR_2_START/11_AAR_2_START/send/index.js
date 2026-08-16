
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

    select("#btn1").mousePressed( ()=>{
        client.publish('mads/page', '1')
    })
    
    select("#btn3").mousePressed( ()=>{
        client.publish('mads/page', '2')
    })

    select("#btn2").mousePressed( ()=>{
        client.publish('mads', 'open')
    })

    select("#btnColor").mousePressed(() => {
    let color = select("#clrInput").value()
    client.publish('mads/color', color)
})

    

}


