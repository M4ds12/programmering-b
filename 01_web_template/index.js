//Globale variabler
var currentPage = "#page10" //Hvilken side er aktiv

//P5 Setup() bliver kaldt EN gang før siden vises

function setup() {
    console.log("P5 setup kaldt")
    //Sæt event listeners op på menu
    select("#menu-side1").mousePressed(
        function(){shiftPage("#page1")}
    )
    select("#menu-side2").mousePressed(
        function(){shiftPage("#page2")}
    )
    select("#menu-side3").mousePressed(
        function(){shiftPage("#page3")}
    )
    select("#menu-side4").mousePressed(
        function(){shiftPage("#page4")}
    )
    select("#menu-side5").mousePressed(
        function(){shiftPage("#page5")}
    )
    select("#menu-side6").mousePressed(
        function(){shiftPage("#page6")}
    )
    select("#menu-side7").mousePressed(
        function(){shiftPage("#page7")}
    )
    select("#menu-side8").mousePressed(
        function(){shiftPage("#page8")}
    )
    select("#menu-side9").mousePressed(
        function(){shiftPage("#page9")}
    )
    select("#menu-side10").mousePressed(
        function(){shiftPage("#page10")}
    )
    select("#menu-side11").mousePressed(
        function(){shiftPage("#page11")}
    )
}

function shiftPage(newPage){
    select(currentPage).removeClass("show")
    select(newPage).addClass("show")
    currentPage = newPage;
}

