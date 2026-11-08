
var currentPage = "#page1"
var videoButton, theVideo
var videoPlaying = true


//P5 setup bliver kaldt EN gang før siden vises
function setup()
{
    console.log('P5 setup kaldt')

    //skift til current page
    shiftPage(currentPage)

    var tilbageButton1 = createButton("tilbage")
    select('#theButtonTilbage1').child(tilbageButton1)
    tilbageButton1.mousePressed( ()=>{
        shiftPage('#page1') })
    var tilbageButton2 = createButton("tilbage")
    select('#theButtonTilbage2').child(tilbageButton2)
    tilbageButton2.mousePressed( ()=>{
        shiftPage('#page1') })



    var alkoholButton = createButton('forklaring af alkohol, keton og carboxysyre')
    select('#alkoholForklaring').child(alkoholButton)
    alkoholButton.mousePressed( ()=>{
        shiftPage('#page2') })

    var aldehydButton1 = createButton('forklaring af dagens forsøg')
    select('#aldehydForklaring').child(aldehydButton1)
    aldehydButton1.mousePressed( ()=>{
        shiftPage('#page3') })

    var aldehydButton2 = createButton('næste forsøg')
    select('#aldehydForklaring2').child(aldehydButton2)
    aldehydButton2.mousePressed( ()=>{
        shiftPage('#page3') })
    var aldehydButton3 = createButton('forrige forsøg')
    select('#aldehydForklaring3').child(aldehydButton3)
    aldehydButton3.mousePressed( ()=>{
        shiftPage('#page2') })
        
}

function shiftPage(newPage)
{
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}
