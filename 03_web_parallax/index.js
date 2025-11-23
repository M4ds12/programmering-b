//Globale variabler
var currentPage = "#page2" //Hvilken side er aktiv

//P5 Setup() bliver kaldt EN gang før siden vises

var mouseX = 0;
var mouseY = 0;


function setup() {
    console.log("P5 setup kaldt")
    //Sæt menu op
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
    
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

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    screenWidth = window.innerWidth
    screenHeight = window.innerHeight

    console.log(mouseX, mouseY)
    document.querySelectorAll(".parallax-mouse").forEach((elem) => {
        elem.style.transform = `translate(${mouseX - screenWidth / 2}px, ${mouseY - screenHeight / 2}px)`
    })
}
)

