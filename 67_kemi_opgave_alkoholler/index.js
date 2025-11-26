//Globale variabler
var currentPage = "#page1" //Hvilken side er aktiv
var videoButton
var videoPlaying = false
var billeder = [
    "./assets/eugenol.png",
    "./assets/vanillin.png",
    "./assets/vanillinsyre.png"
    
];
var former = [
    "Alkohol form",
    "Aldehyd form",
    "Syre form"
];


var index = 1;
//P5 Setup() bliver kaldt EN gang før siden vises


select("#vanillinTilstand").html(former[index])

function setup() {
    console.log("P5 setup kaldt")
    //Sæt menu op
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
    
    //skift til current page
    shiftPage(currentPage);
    

    
    
    select("#vanillinTilstandBillede").style("background-image", `url(${billeder[index]})`)
    select("#vanillinTilstand").html(former[index])

   
    var oxidationsKnap = select("#oxidationsKnap")
    var reductionsKnap = select("#reduktionsKnap")
   //sæt en event listener op på knappen
   oxidationsKnap.mousePressed(()=>{
   
    
    if (index < billeder.length - 1) {
      index++;
        select("#vanillinTilstandBillede").style("background-image", `url(${billeder[index]})`)
        select("#vanillinTilstand").html(former[index])
      updateButtons()
    }
   })
   

    reductionsKnap.mousePressed(()=>{
  
   
     if (index > 0) {
      index--;
       select("#vanillinTilstandBillede").style("background-image", `url(${billeder[index]})`)
       select("#vanillinTilstand").html(former[index])
      updateButtons()
     }
   })

   function updateButtons() {
  if (index === 0) {
    reductionsKnap.attribute("disabled", true);
  } else {
    reductionsKnap.removeAttribute("disabled");
  }

  if (index === billeder.length - 1) {
    oxidationsKnap.attribute("disabled", true);
  } else {
    oxidationsKnap.removeAttribute("disabled");
  }
}
   
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

