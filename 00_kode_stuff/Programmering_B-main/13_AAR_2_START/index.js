
var client


function setup(){

    shiftPage('#page1')

    //mqtt er et objekt vi får fra mqtt-biblioteket i HTML-siden
    client = mqtt.connect('wss://mqtt.nextservices.dk')

    client.on('connect', msg => {
        //console.log(msg)
        var toast = select('#toast')
        console.log('forbundet til NEXT MQTT server')
        toast.html('forbundet til NEXT MQTT server')
        toast.addClass('toastShow')
        setTimeout(()=>{
            toast.removeClass('toastShow')
        },2000)
    })

    client.subscribe('viggoserver')
    client.subscribe('viggoserver/page')

    //her får vi beskeder fra forskellige topics vi abbonerer på
    //"topic" er hvilken gren af serveren der sendes beskeder over. Fx: "viggoserver/page".
    client.on('message', (topic, msg) => {
        console.log(topic, msg.toString)
        msg = msg.toString()

        if(topic == 'viggoserver/page'){
            console.log('nu skal der skiftes side')
            //ER DET ET TAL?
            msg = '#page' + msg
            shiftPage(msg)

        }
        select('#msg').elt.textContent = 'Besked på topic "' + topic + '" med teksten ' + msg
        select('#p2msg').elt.textContent = 'Besked på topic "' + topic + '" med teksten ' + msg
    })
    //"publish" sender
    client.publish('viggoserver', '1')
    
}

var currentPage = "#page1"
var readyToShift = true
function shiftPage(newPage){
    if(readyToShift){
        if(!select(newPage)) return
        select(currentPage).removeClass('show')
        currentPage = newPage
        select(currentPage).addClass('show')
        readyToShift = false
        setTimeout(() => readyToShift = true, 50);
    }
}
/*

function createCard(text, img, destID){
    console.log(img)
    var div = createDiv().addClass('container')
}

createCard('Her er billedet', 'https://media.tenor.com/5x7yNPBj5HcAAAAm/happy.webp', '#cards')

function createCard(text, img, destId){
    var containerDiv = createDiv().addClass('container')
    var topDiv = createDiv().addClass('top')
    var img = createImg(img)
    topDiv.child(img)
    var bottomDiv = createDiv(text).addClass('bottom')
    containerDiv.child(topDiv)
    containerDiv.child(bottomDiv)
    select(destId).child(containerDiv)
}
*/