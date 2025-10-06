//Globale variabler
var currentPage = "#page10" //Hvilken side er aktiv

//P5 Setup() bliver kaldt EN gang før siden vises

function setup() {
    console.log("P5 setup kaldt")
    //Sæt event listeners op på menu
    //variablet AllMenuItem, selecter alle a elementer under klassen sidebar
   var allMenuItem = selectAll(".sidebar a")
   console.log(allMenuItem)
   allMenuItem.map(
    function(item){
        item.mousePressed(
            function(){
                shiftPage(item.attribute("action"))
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

