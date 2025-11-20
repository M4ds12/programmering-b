//Globale variabler
var currentPage = "#page1" //Hvilken side er aktiv
var videoButton
var videoPlaying = true

//P5 Setup() bliver kaldt EN gang før siden vises




function setup() {
    console.log("P5 setup kaldt")
    //Sæt menu op
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
    
    //skift til current page
    shiftPage(currentPage);


    var myButton = createButton("Få noget mere info!!!!!!!")
   //Læg en ind i side 5
   select("#theButton").child(myButton)
   //Lav en event listener
   myButton.mousePressed(()=>{
    shiftPage("#page2")
   })

      //Videoen
   theVideo = select("#theVideo")
    //video control button
   videoButton = select("#videoButton")
   videoOverlay = select("#overlay")
   videoButton.mousePressed(()=>{
    console.log("button pressed")
    if(videoPlaying){
    //paus videoen
    theVideo.pause()
    videoButton.html("Play") 
    videoPlaying = false
    videoOverlay.show()
    
    } else{
        theVideo.play()
        videoPlaying = true
         videoOverlay.hide()
        videoButton.html("Pause")
    }

   

   })

    //Dropdowns
    var theDropdown = select("#theDropdown")
    

    theDropdown.changed(()=>{
        var billedeStyling = theDropdown.value()
        select("#page3").style("background-image", `url(${billedeStyling})`)
        select("#page3").style("background-size", "cover")
    })
   



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

