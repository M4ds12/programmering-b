var btnOn = false
var currentPage = "#page1"

function setup(){
  console.log("setup has been called")
  shiftPage('currentPage')



  //mqtt er et objekt vi får fra mqtt biblioteket i html siden
  client = mqtt.connect("wss://mqtt.nextservices.dk")
  client.on('connect', msg => {
      //console.log("msg")
      console.log("Forbundet til NEXT MQTT server")
  
  })
  client.subscribe('brillevisker')
  client.subscribe('brillevisker/on')
  client.subscribe('brillevisker/off')

  //vi DOM-binder vores knap med ID'et "mqttButton"
  select('#mqttButton').mousePressed(()=>{
    select('#mqttButton').html('Stop viskere')
    if (btnOn == false){
      btnOn = true
      client.publish('brillevisker', 'on')
      console.log("motor turned on")

      select('#mqttButton').addClass('btnActive')

      select('#wetImg').addClass('hidden')
      select('#wetImg').removeClass('visible')
      select('#dryImg').addClass('visible')
      select('#dryImg').removeClass('hidden')
      
    } else if (btnOn == true){
      select('#mqttButton').html('Start viskere')

      btnOn = false
      client.publish('brillevisker', 'off')
      console.log("motor turned off")

      select('#mqttButton').removeClass('btnActive')

      select('#dryImg').addClass('hidden')
      select('#dryImg').removeClass('visible')
      select('#wetImg').addClass('visible')
      select('#wetImg').removeClass('hidden')
    }
  })
  
}