//Globale variabler
var currentPage = "#page4" //Hvilken side er aktiv

//P5 Setup() bliver kaldt EN gang før siden vises




function setup() {
    console.log("P5 setup kaldt")
    //Sæt menu op
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
    
    //skift til current page
    shiftPage(currentPage);

   //Buttons
   var theButton = select("#theButton")
   //sæt en event listener op på knappen
   theButton.mousePressed(()=>{
    if(confirm("Har du sikker?")){
        theButton.html("I was clicked!")
    } else{
        theButton.html("I'm not sure who I am")
    }
   })

   //P5 Buttons
   var myButton = createButton("Button created with javascript")
   //Læg en ind i side 5
   select("#page5").child(myButton)
   //Lav en event listener
   myButton.mousePressed(()=>{
    shiftPage("#page1")
   })


    //Dropdowns
    var theDropdown = select("#theDropdown")
    //Event listener: changed
    theDropdown.changed(()=>{
        select("#page2").style("background-color", theDropdown.value())
    })


    

    


    //Input field - DOM BINDING  
    var theInput = select('#theInput')
    var theInputButton = select('#theInputButton')
    var theInputTitle = select('#theInputTitle')
    theInputButton.mousePressed(()=>{
        //Giv mig det som står i input feltet ind i variablen title 
        var title = theInput.value()
        theInput.hide()
        theInputButton.hide()
        theInputTitle.html(title)
    })



     //Checkboxes
     var ck = select("#ck1")
     ck.changed(()=>{
        ck.hide()
        select("#ck1").hide()
        select("#rebel").hide()
     })

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

