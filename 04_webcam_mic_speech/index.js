var currentPage = '#page4'
var capture 
var otterSound, rainSound, fireGif
var recBtn, recorder, audioFile
var isRecording = false
var speakInp, speakBtn

function preload(){
    otterSound = loadSound('./assets/ottersound.mp3') 
}

//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    console.log('P5 setup kaldt inshallah')
    
    //skift til current page 
    shiftPage(currentPage)

    capture = createCapture(VIDEO, {flipped:true})
    capture.size(720,468)
    select('#page1').child(capture)


    //SOUND 
    //Make a sound play on mouse press 
    select('#otter').mousePressed(()=>{
            //Animeret gif 
            fireGif = createImg('./assets/fire.gif')
            select('#page2').child(fireGif)

            var pos = select('#otter').position()
            console.log(pos)
            fireGif.position(pos.x, pos.y)
            //Skjul odderen så den kan brænde og dø 
            select('#otter').hide()
            otterSound.play()
    })
    //Opret en lyd med createSound og indsæt den med DOM Binding
    rainSound = createAudio('./assets/rain.mp3')
    rainSound.showControls()
    select('#page2').child(rainSound)
    //rainSound.play()

    //Lydoptagelse
    //Start browserens mikrofon
    var mic = new p5.AudioIn()
    mic.start()
    //Opret en ny fil til at gemme lyd i 
    audioFile = new p5.SoundFile()

    recorder = new p5.SoundRecorder()
    recorder.setInput(mic)

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
            recBtn.html("Start recording")
            setTimeout(()=>{
                audioFile.play()
                save(audioFile, "myVoice.wav")
            }, 500)

        }
    })

    //Speech synth
    speakInp = select('#speakMe')
    speakBtn = select('#speakBtn')
    //Når man trykker på knappen, læses indholdet i input feltet op
    speakBtn.mousePressed(()=>{
        const utterance = new SpeechSynthesisUtterance(speakInp.value())
        utterance.lang = "ur-PK"
        utterance.rate = 1.4
        utterance.pitch = 1.4
        speechSynthesis.speak(utterance)
    }) 

    
    //Sæt menu op
    //Hent alle sider som et array
    var allPages = selectAll('.page')
    //Løb listen igennem en for en 
    allPages.map(
       page => {
        //Lav et nyt <a> element 
        var menuItem = createElement('a')
        //Sæt a taggets html til sidens titel
        menuItem.html(page.attribute('title'))
        //sæt eventlistener på a tagget
        menuItem.mousePressed(
            () => shiftPage('#' + page.attribute('id'))
        )
        //sæt a tagget ind i sidebaren
        select('.sidebar').child(menuItem)
       }
    )

}

function shiftPage(newPage){
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}