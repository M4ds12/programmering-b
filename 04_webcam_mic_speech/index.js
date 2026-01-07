//Globale variabler
var currentPage = "#page1" //Hvilken side er aktiv
var capture
var otterSound, rainSound, fireGif
var recBtn, recorder, audioFile
var isRecording = false
var speakInput, speakButton



function preload(){
    //Load sound er fra p5 biblioteket
    otterSound = loadSound(`./assets/otter-sound.mp3`)
}


//P5 Setup() bliver kaldt EN gang før siden vises
function setup() {
    console.log("P5 setup kaldt")
    //Sæt menu op
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
    
    capture = createCapture(VIDEO, {flipped:true})
    capture.size(720, 468)
    select("#page1").child(capture)


    
     //Start browserens mikrofon
    var mic = new p5.AudioIn()
    mic.start()
    //Opret en ny fil til at gemme lyd i 
    audioFile = new p5.SoundFile()

    recorder = new p5.SoundRecorder()
    recorder.setInput(mic)

    

select("#odderBillede").mousePressed(()=>{
        otterSound.play()})
    
        //Opret en lyd med createSound og indsæt den med DOM Binding
    rainSound = createAudio('./assets/rain.mp3')
    rainSound.showControls()
    select('#page2').child(rainSound)
    //rainSound.play()

    //Speech synth
    speakInput = select("#speakMe")
    speakButton = select("#speakButton")
    //Når man trykker på knappen, læses indholdet i inputfeltet op
    speakButton.mousePressed(()=>{
        const utterance = new SpeechSynthesisUtterance
        utterance.lang = "ur-PK"
        utterance.rate = 1.4
        utterance.pitch = 1.4
        speechSynthesis.speak(utterance)
    })


    //DOM binding til knappen
    recBtn = select('#recBtn')
    //start/stop optagelse
    recBtn.mousePressed(()=>{
        if(!isRecording){
            recorder.record(audioFile)
            isRecording = true
            recBtn.html('STOP recording')
        }else{
            recorder.stop()
            isRecording = false
            setTimeout(()=>{
                audioFile.play()
            }, 200)

        }
    })
    


     

    //skift til current page
    shiftPage(currentPage);

     allPages.map(
        page => {
            //Lav et nyt "a" element
            var menuItem = createElement("a")
            //Sæt a taggets html til sidens titel
            menuItem.html(page.attribute("title"))
            //sæt a tagget ind i sidebaren
            select(".sidebar").child(menuItem)
            //sæt event listener på a tagget
            menuItem.mousePressed(
                ()=>{
                    shiftPage("#" + page.attribute("id"))
                }
            )
        }
   )


    
}

function shiftPage(newPage){
    select(currentPage).removeClass("show")
    select(newPage).addClass("show")
    currentPage = newPage;
}

