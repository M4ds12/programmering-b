
var client

function setup(){

    //mqtt er et objekt vi får fra mqtt-biblioteket i HTML-siden
    client = mqtt.connect('wss://mqtt.nextservices.dk')

    client.on('connect', msg => {
        var toast = select('#toast')
        //console.log(msg)
        console.log('forbundet til NEXT MQTT server')
        toast.html('forbundet til NEXT MQTT server')
        toast.addClass('toastShow')
        setTimeout(()=>{
            toast.removeClass('toastShow')
        },2000)
    })

    //"publish" sender
    select('#btn1').mousePressed( () => {
        client.publish('viggoserver/page', '1')
    })
    select('#btn2').mousePressed( () => {
        client.publish('viggoserver', 'fødder 👅')
    })
    select('#btn3').mousePressed( () => {
        client.publish('viggoserver/page', '2')
    })
    

}