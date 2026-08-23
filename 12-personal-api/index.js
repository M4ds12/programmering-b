

//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
      var allPages = selectAll(".page")
      
    // Brug funktionerne fra dit personlige API her.
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

select(currentPage).addClass("show")

startTimer(20, "#timer", "#timerBtn")



select("#arrayBtn").mousePressed(() => {
        var value = select("#arrayInput").value()
        if (value === "") return

        myArray.push(value)
        select("#arrayInput").value("")

        createList(myArray, "#arrayList", "array-item")
    })



select("#colorChangeBtn").mousePressed(() => {
    var color = select("#colorInput").value()
    if (color === "") return

    changeColor(color, "#page4")
})

}


