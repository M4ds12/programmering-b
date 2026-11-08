

var currentPage = "#page1"
var videoPlaying = true
var videoButton, theVideo



//P5 setup bliver kaldt EN gang før siden vises
function setup()
{
    console.log('P5 setup kaldt')
    console.log(selectAll('.page'))
    //hent alle sider som et array
    var allPages = selectAll('.page')
    
    //skift til current page
    shiftPage(currentPage)
    
    //Videoen
    theVideo = select('#theVideo')
    //Video control button
    videoButton = select('#videoButton')
    videoButton.mousePressed(()=>{
        //console.log('button pressed')
        if(videoPlaying){
            theVideo.pause()
            videoPlaying = false
        }else{
            theVideo.play()
            videoPlaying = true
        }
    })

    var theDropdown = select("#theDropdown")

    theDropdown.changed(()=>{
        var billeder = theDropdown.value()
        select("#page2").style("background-image", `url(${billeder})`)
        select("#page2").style("background-size", "cover")
    })

    //buttons
    //var myButton = createButton('tilbage') select('#theButtonTilbage').child(myButton) myButton.mousePressed( ()=>{ shiftPage('#page1') })
    
    //Dropdowns
    
    //sæt menu op
    //hent alle sider som et array
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


function shiftPage(newPage){
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}
