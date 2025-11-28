//Globale variabler
var currentPage = "#page1" //Hvilken side er aktiv
var videoButton
var videoPlaying = false
var billederVanillin = [
    "./assets/eugenol.png",
    "./assets/vanillin.png",
    "./assets/vanillinsyre.png"
    
];

var BillederEthanol =[
  "./assets/ethanol.png",
  "./assets/ethanal.png",
  "./assets/ethansyre.png"
]
var BillederEddikesyre = [

]


var former = [
    "Alkohol form",
    "Aldehyd form",
    "Carboxylsyre form"
];


var index1 = 1;
var index2 = 0
//P5 Setup() bliver kaldt EN gang før siden vises



function setup() {
    console.log("P5 setup kaldt")
    //Sæt menu op
    select("#vanillinTilstand").html(former[index1])
    //Trin 1: jeg laver en liste og sætter et array op ved at hente alle siderne
    var allPages = selectAll(".page")
    
    //skift til current page
    shiftPage(currentPage);
    

    var oxidationsKnapEthanol = select("#oxidationsKnapEthanol")
    var reductionsKnapEthanol = select("#reduktionsKnapEthanol")

    
    var oxidationsKnapVanillin = select("#oxidationsKnapVanillin")
    var reductionsKnapVanillin = select("#reduktionsKnapVanillin")
   //sæt en event listener op på knappen
   oxidationsKnapVanillin.mousePressed(()=>{
    if (index1 < billederVanillin.length - 1) {
      index1++;
        select("#vanillinTilstandBillede").style("background-image", `url(${billederVanillin[index1]})`)
        select("#vanillinTilstand").html(former[index1])
      updateButtons()
      opdaterAldehydTekst()
    }
   })
   

 reductionsKnapVanillin.mousePressed(()=>{

   if (index1 > 0) {
    index1--;
     select("#vanillinTilstandBillede").style("background-image", `url(${billederVanillin[index1]})`)
     select("#vanillinTilstand").html(former[index1])
    updateButtons()
    opdaterAldehydTekst()
   }
 })


 oxidationsKnapEthanol.mousePressed(()=>{
    if(index2 < BillederEthanol.length - 1){
      index2++;
      select("#ethanolTilstandBillede").style("background-image", `url(${BillederEthanol[index2]})`)
      select("#ethanolTilstand").html(former[index2])
      updateButtons()
    }
   })


   reductionsKnapEthanol.mousePressed(()=>{
    if(index2 > 0){
      index2--;
      select("#ethanolTilstandBillede").style("background-image", `url(${BillederEthanol[index2]})`)
      select("#ethanolTilstand").html(former[index2])
      updateButtons()
    }
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

   function updateButtons() { 
    if (index1 === 0) { reductionsKnapVanillin.attribute("disabled", true); 
       select("#reduktionsKnapVanillin").html(`Jeg kan ikke reduceres videre :(`);
    }
     else{ 
      reductionsKnapVanillin.removeAttribute("disabled");
       select("#reduktionsKnapVanillin").html(`Reducer mig twin!!!!!`);
     }

    if (index1 === billederVanillin.length - 1) {
      oxidationsKnapVanillin.attribute("disabled", true);
    select("#oxidationsKnapVanillin").html(`Jeg kan ikke oxideres videre :(`);
       } else {
    oxidationsKnapVanillin.removeAttribute("disabled");
    select("#oxidationsKnapVanillin").html(`Oxider mig twin!!!!!`);
   
       }

       if (index2 === 0) {
    reductionsKnapEthanol.attribute("disabled", true);
        } else {
    reductionsKnapEthanol.removeAttribute("disabled");
        }


       if (index2 === BillederEthanol.length - 1) {
    oxidationsKnapEthanol.attribute("disabled", true);
      } else {
    oxidationsKnapEthanol.removeAttribute("disabled");
      }





}
   
     


function shiftPage(newPage){
    select(currentPage).removeClass("show")
    select(newPage).addClass("show")
    currentPage = newPage;
    index1 = 1
    select("#vanillinTilstandBillede").style("background-image", `url(${billederVanillin[index1]})`)
    select("#vanillinTilstand").html(former[index1])
    index2 = 0
    select("#ethanolTilstandBillede").style("background-image", `url(${BillederEthanol[index2]})`)
    select("#ethanolTilstand").html(former[index2])
}

function opdaterAldehydTekst(){
  if(index1===1){
    select("#vanillinString").html(`Vanillin er et aldehyd, der primært findes i vaniljebønner. Det er her at duften og smagen af vanilje stammer, som vi alle kender. Det kemiske navn for vanillin er 4-hydroxy-3-methoxybenzaldehyd, og det har den kemiske formel C8H8O3. Vanillin bruges eksempelsvis i produkter som vaniljesukker.
  <br><br>
  Navnet er lidt langt men alle elementerne fortæller noget om stoffet
  <br><br>
  4-hydroxy: På den fjere plads i carbonkæden fra den funktionelle gruppe i starten af kæden er en hydroxygruppe.
  <br>
  3-methoxy: Til højre er der en methyl gruppe med 1 carbon og 3 hydrogen. Den er bundet til benzen ringen på tredje plads fra starten af kæden med 1 oxygen, herved "oxy"
  <br>
  benz: Molekylet indeholder en benzen ring med 6 carbon og 6 hydrogen atomer
  <br>
  aldehyd: den funktionelle gruppe i molekylet er en aldehyd, med en oxogruppe- og hydrogen atom bundet til et carbon atom, altså en "aldehydgruppe"
  <br><br>
  Stoffet er polært, på grund af oxogrupperne og hydroxygruppen. De stoffer er hydrofile, og forholdet mellem de hydrofile stoffer og carbon-atomerne er heller ikke højere end 1:4, så der er snak om polaritet.
  <br>
  Som tidligere nævnt, så anvendes det til smag og duft.
`);
  } else if(index1===2){
    select("#vanillinString").html(`Vanillinsyre er en carboxylsyre, og det kemiske navn for vanillinsyre er 4-hydroxy-3-methoxybenzoesyre, og det har den kemiske formel C8H8O4.
  <br><br>
  Navnet er også lidt langt her men igen fortæller alle elementerne noget om stoffet. Navngivningen er det samme som aldehydet, bortset fra syre endelsen.
  <br><br>
  4-hydroxy: På den fjere plads i carbonkæden fra den funktionelle gruppe i starten af kæden er en hydroxygruppe.
  <br>
  3-methoxy: Til højre er der en methyl gruppe med 1 carbon og 3 hydrogen. Den er bundet til benzen ringen på tredje plads fra starten af kæden med 1 oxygen, herved "oxy"
  <br>
  benz: Molekylet indeholder en benzen ring med 6 carbon og 6 hydrogen- atomer
  <br>
  Syre: den funktionelle gruppe i molekylet er en carboxylsyre, med en oxogruppe- og hydroxygruppe bundet til et carbon atom, altså en "COOH-gruppe" eller "Carboxylgruppe"
  <br><br>
  Stoffet er polært, på grund af oxogruppen og hydroxygruppen. De stoffer er hydrofile, og forholdet mellem de hydrofile stoffer og carbon-atomerne er heller ikke højere end 1:4, så der er snak om polaritet.
  <br>
  Denne syre anvendes primært som et smagsstof.
  `);
}
else if(index1===0){
  select("#vanillinString").html(`Isoeugenol er et organisk stof, der primært findes i AAAAAAAAAAAA Det er her at AAAAAAA stammer, Det kemiske navn for AAAAAAAAAAA er AAAAAAAAAAA, og det har den kemiske formel C10H10O2. Isogeuenol er et primært alkohol, og et eksempel på et produkt hvor det bruges er AAAAAAAAA.
  <br><br>
  Navnet er lidt langt men alle elementerne fortæller noget om stoffet
  <br><br>
  4-hydroxy: På den fjere plads i carbonkæden fra den funktionelle gruppe i starten af kæden er en hydroxygruppe.
  <br>
  3-methoxy: Til højre er der en methyl gruppe med 1 carbon og 3 hydrogen. Den er bundet til benzen ringen på tredje plads fra starten af kæden med 1 oxygen, herved "oxy"
  <br>
  benz: Molekylet indeholder en benzen ring med 6 carbon og hydrogen carbon-atomerne
  <br>
  aldehyd: den funktionelle gruppe i molekylet er en aldehyd, med en oxogruppe- og hydrogen atom bundet til et carbon atom.
  <br><br>
  Stoffet er polært, på grund af oxogruppen og hydroxygruppen. De stoffer er hydrofile, og forholdet mellem de hydrofile stoffer og carbon-atomerne er heller ikke højere end 1:4, så der er snak om polaritet.
  <br>
  Som tidligere nævnt, så anvendes det til smag og duft.
  `);
 }
  }
 }
 