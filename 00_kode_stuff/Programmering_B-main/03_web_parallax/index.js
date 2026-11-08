

var currentPage = "#page3"
var mouseX = 0
var mouseY = 0


//P5 setup bliver kaldt EN gang før siden vises
function setup()
{
    console.log('P5 setup kaldt')

    //skift til current page
    shiftPage(currentPage)

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

function mouseMoved(){
    // P5 giver os variabler om mussen og vinduet:
    //console.log("p5 mus: ", mouseX, mouseY, windowWidth, windowHeight)
    // SelectAll vælger alle elementer med en klase- .map() looper igennem den
    selectAll(".parallaxMouse").map( john =>{
        const speed = div.attribute('dataspeed')
        div.style(elem.style.transform = `translate(${(mouseX - screenWidth/ 2) * speed}px, ${(mouseY - screenHeight / 2) * speed}px)`)
    })
}

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    console.log(mouseX, mouseY)

    screenWidth = window.innerWidth
    screenHeight = window.innerHeight

    document.querySelectorAll(".parallax-mouse").forEach((elem) => {
        const speed = elem.getAttribute("data-speed");
        elem.style.transform = `translate(${(mouseX - screenWidth/ 2) * speed}px, ${(mouseY - screenHeight / 2) * speed}px)`
    });
})