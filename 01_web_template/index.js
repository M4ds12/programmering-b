//Globale variabler
var currentPage = "#page5" //Hvilken side er aktiv
var videoButton
var videoPlaying = true
//P5 Setup() bliver kaldt EN gang før siden vises

function setup() {
    console.log("P5 setup kaldt")
   //Videoen
   theVideo = select("#theVideo")
    //video control button
   videoButton = select("#videoButton")
   videoButton.mousePressed(()=>{
    console.log("button pressed")
    if(videoPlaying){
    //paus videoen
    theVideo.pause()
    videoPlaying = false
    } else{
        theVideo.play()
        videoPlaying = true
    }
   

   })
   
   
    //Sæt menu op
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
    
    //skift til current page
    shiftPage(currentPage);
   //løb listen igennem en for en
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

