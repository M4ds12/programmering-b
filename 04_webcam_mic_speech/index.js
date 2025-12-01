//Globale variabler
var currentPage = "#page1" //Hvilken side er aktiv
var capture


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


    select("#odderBillede").mousePressed(()=>
        otterSound.play())

    

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


    Button = select("#dutch")
   dutchButton.mousePressed(()=>{
    shiftPage("#page4")
   })

}

function shiftPage(newPage){
    select(currentPage).removeClass("show")
    select(newPage).addClass("show")
    currentPage = newPage;
}

