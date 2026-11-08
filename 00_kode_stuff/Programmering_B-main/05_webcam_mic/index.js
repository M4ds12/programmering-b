

var currentPage = "#page4"
var capture
var explosionSound
var chirpSound
var explosionGif
var recBtn, recorder, audioFile
var isRecording = false
var speakInput, speakBtn


function preload(){
    explosionSound = loadSound("./assets/roblox-explosion-sound.mp3")
}

//P5 setup bliver kaldt EN gang før siden vises
function setup()
{
    console.log('P5 setup kaldt')

    //skift til current page
    shiftPage(currentPage)
    
    
    //SOUND
    select("#explosion").mousePressed(()=>{
        //Animated GIF
        explosionGif = createImg("./assets/explosion.gif")
        select("#page2").child(explosionGif)
        
        var pos = select("#explosion").position()
        console.log(pos)
        explosionGif.position(pos.x, pos.y)
        //Skjul explosion så den... eksploderer?
        select("#explosion").hide()
        explosionSound.play()
    })

    
    //Opret en lyd med createSound og indsæt den som DOM Binding
    //Chirp
    chirpSound = createAudio("./assets/chirp.mp3")
    chirpSound.showControls()
    select("#page2").child(chirpSound)
    chirpSound.play()

    //Lydoptagelse
    //Start browserens mikrofon
    var mic = new p5.AudioIn()
    mic.start()
    //opret en ny fil til at gemme lyd i
    audioFile = new p5.SoundFile()

    recorder = new p5.SoundRecorder()
    recorder.setInput(mic)

    //DOM Binding til knappen
    recBtn = select("#recBtn")
    //Start/stop optagelse
    recBtn.mousePressed(()=>{
        if(!isRecording){
            recorder.record(audioFile)
            isRecording = true
            recBtn.html("STOP recording")
        }
        else{
            recorder.stop()
            isRecording = false
            setTimeout(()=>{
                audioFile.play()
                save(audioFile, ("sybau alr twin"))
            }, 500)

        }
    })

    //speech synth
    speakInp = select("#speakInput")
    speakBtn = select("#speakBtn")
    //når man trykker på knappen, læses indholdet i input feltet op
    speakBtn.mousePressed(()=>{
        const utterance = new SpeechSynthesisUtterance(speakInp.value())
        utterance.lang = "ur-PK"
        utterance.rate = 1.4
        utterance.pitch = 1.4
        speechSynthesis.speak(utterance)
    })

    //VIDEO
    capture = createCapture(VIDEO)
    capture.size(720, 468)
    select('#page1').child(capture)


    //sæt menu op
    //hent alle sider som et array
    var allPages = selectAll('.page')
    //løb listen igennem en for en
    allPages.map(
        (page) => {
            //lav et nyt <a> element
            var menuItem = createElement('a')
            //sæt 'a' tagget's html til sidens titel
            menuItem.html(page.attribute('title'))
            //sæt eventlister på 'a' tagget
            menuItem.mousePressed(
                () => shiftPage('#' + page.attribute('id'))
            )
            //sæt tagget ind i sidebar
            select('.sidebar').child(menuItem)
        }
    )
}





function shiftPage(newPage)
{
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}
