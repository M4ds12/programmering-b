//Globale variabler
var currentPage = "#page1" //Hvilken side er aktiv
var videoButton
var videoPlaying = false
var billederVanillin = [
    "./assets/isoeugenol.png",
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
    console.log("setup ended")
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
      opdaterAlkoholTekst()
    }
   })


   reductionsKnapEthanol.mousePressed(()=>{
    if(index2 > 0){
      index2--;
      select("#ethanolTilstandBillede").style("background-image", `url(${BillederEthanol[index2]})`)
      select("#ethanolTilstand").html(former[index2])
      updateButtons()
      opdaterAlkoholTekst()
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
       select("#reduktionsKnapVanillin").html(`Reducer mig!!!!!`);
     }

    if (index1 === billederVanillin.length - 1) {
      oxidationsKnapVanillin.attribute("disabled", true);
    select("#oxidationsKnapVanillin").html(`Jeg kan ikke oxideres videre :(`);
       } else {
    oxidationsKnapVanillin.removeAttribute("disabled");
    select("#oxidationsKnapVanillin").html(`Oxider mig!!!!!`);
   
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
    opdaterAlkoholTekst()
}

function opdaterAlkoholTekst(){
 if(index2===1){
  select("#ethanolString").html(`Ethanal er et organisk stof, der eksempelvis findes i kaffe, brød og frugt. Det kemiske navn for Ethanal er CH3CHO. Ethanal er et aldehyd.
  <br>
  Også et kort og simpelt navn :)
  <br>
  Ethan: 2 carbon atomer med en enkeltbinding
  <br>
  al endelse:  den funktionelle gruppe i molekylet er en aldehyd, med en oxogruppe- og hydrogen atom bundet til et carbon atom, altså der er en "aldehydgruppe"
  <br><br>
  Stoffet er polært, på grund af oxogruppen. Den er hydrofil, og forholdet mellem de hydrofile stoffer og carbon-atomerne er ikke højere end 1:4, så der er snak om polaritet.
  <br>
  Som tidligere nævnt, så findes det blandt andet i fødevare.
  `);
 }
  else if(index2===2){
  select("#ethanolString").html(`Eddikesyre er et organisk stof, der primært findes i eddike. Det kemiske navn for eddikesyre er ethansyre, og det har den kemiske formel CH3COOH. Ethansyre er en carboxylsyre, og et eksempel hvor det bruges er f.eks til afkalkning.
  <br>
  Igen igen er navnet simpelt :)
  <br>
  Ethan: Der er 2 carbon atomer, i en enkeltbinding.
  <br>
  Syre endelse: fordi det er en carboxylsyre😱 Det er det fordi der er en oxogruppe- og hydroxylgruppe bundet til et carbon atom, altså en "COOH-gruppe" eller "Carboxylgruppe".
  <br><br>
  Stoffet er polært, på grund af oxogruppen og hydroxylgruppen. De stoffer er hydrofile, og forholdet mellem de hydrofile stoffer og carbon-atomerne er heller ikke højere end 1:4, så der er snak om polaritet.
  <br>
  Som tidligere nævnt, så anvendes det til afkalkning, men så også madlavning i eddike og som skyllemiddel.
  `);
  select("#whiskeyBillede").style("background-image", "url('./assets/eddike.png')");
  select("#whiskeyBillede").style("background-size", "cover")
  }

    else if(index2===0){
      select("#ethanolString").html(`Ethanol er et organisk stof, der primært findes i alkoholiske drikkevare (som øl, whiskey👅, vodka, osv).  Det kemiske navn for Ethanol er............... Ethanol, og det har den kemiske formel C2H5OH. Ethanol er et primært alkohol, og nogler eksempler på hvor det bruges er parfume, de tidligere nævnte alkoholiske drikkevare, brændstof, osv.
  <br>
  Navngivningen er heldigvis ret simpel
  <br>
  Ethan: der er 2 carbon atomer som har enkeltbindinger
  <br>
  Ol: der endestillede hydroxylgruppe som er stoffets funktionelle gruppe
  <br><br>
  Stoffet er polært, på grund af hydroxylgruppen. Hydroxylgruppen er hydrofilt, og forholdet mellem de hydrofile stoffer og carbon-atomerne er ikke højere end 1:4, så der er snak om polaritet.
  `);

  select("#whiskeyBillede").style("background-image", "url('./assets/jackD.png')");
  select("#whiskeyBillede").style("background-size", "cover")
    }

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
  select("#vanillinString").html(`Isoeugenol er et organisk stof, der blandt andet findes i nelikker. Det kemiske navn er 2-methoxy-4-(prop-1-en-1-yl)phenol, og det har den kemiske formel C10H12O2. Isogeuenol er et alkohol (ikke et primært men er en phenol).
  <br><br>
  Navnet er ret her langt men elementerne fortæller igen igen noget om stoffet
  <br><br>
    2-methoxy: Der er en methoxy gruppe på anden plads i kæden.
  <br>
  4-(prop-1-en-1-yl)  På fjerde plads i kæden er en sidekæde med 3 carbon atomer som inkluderer en dobbeltbinding.
  <br><br>
  Stoffet er polært, på grund af methoxygruppen og hydroxylgruppen. De stoffer er hydrofile, og forholdet mellem de hydrofile stoffer og carbon-atomerne er heller ikke højere end 1:4, så der er snak om polaritet.
  <br>
  På grund af at stoffet er et isomer (anderledes variant af det normale stof hvor dobbeltbindingen er rykket et andet sted) et (E) i det fulde kemiske navn
  `);

  
 }
  }


 ethanolButton = select("#ethanolKnap")
 ethanolButton.mousePressed(()=>{
    shiftPage("#page2")
   })

  vaniljeButton = select("#vaniljeKnap")
  vaniljeButton.mousePressed(()=>{
    shiftPage("#page3")
   })

   eddikeButton = select("#eddikeKnap")
   eddikeButton.mousePressed(()=>{
    shiftPage("#page2")
   })

 }
 