var currentPage = "#page1" //Hvilken side er aktiv

//P5 Setup() bliver kaldt EN gang før siden vises

function setup() {
    console.log("P5 setup kaldt")
    //Sæt menu op
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
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
    window.addEventListener('hashchange', function() {
        if (window.location.hash == "") {
            return;
        }
        shiftPage(window.location.hash);
        window.location.hash = ""
        
    })
 
}

function shiftPage(newPage){
    select(currentPage).removeClass("show")
    select(newPage).addClass("show")
    currentPage = newPage;
}
