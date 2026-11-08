

var currentPage = "#page5"
var videoButton, theVideo
var videoPlaying = true


//P5 setup bliver kaldt EN gang før siden vises
function setup()
{
    console.log('P5 setup kaldt')

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
    



    //sæt menu op
    //hent alle sider som et array
    var allPages = selectAll('.page')
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

function shiftPage(newPage)
{
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}
