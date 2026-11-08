

var currentPage = "#page1"



//P5 setup bliver kaldt EN gang før siden vises
function setup()
{
    console.log('P5 setup kaldt')

    //skift til current page
    shiftPage(currentPage)


    //button
    var theButton = select('#theButton')
    //sæt en event lisstener op på knappen
    theButton.mousePressed( ()=>{
        if(confirm('ok super duper')){
            theButton.html('"ok" super duper')
        }
        else{
            theButton.html('"annuller" super duper')
        }
    })



    //drop downs
    var theDropdown = select('#theDropdown')
    //event listener
    theDropdown.changed( ()=>{
        select('#page2').style('background-color', theDropdown.value())
    })


    //input field
    var theInput = select('#theInput')
    var theInputButton = select('#theInputButton')
    var theInput = select('#theInputTitle')
    theInputButton.mousePressed( ()=>{
        var title = theInput.value()
        theInput.hide()
        theInputButton.hide()
        theInputTitle.html(title)
    })

    //check boxes
    var ck= select('#ck')
    ck.changed(()=>{
        ck.hide()
        select('#ck1').hide
        select('#rebel').html("yuh!")
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

//P5 button
var myButton = createButton('Button created with javascript')
//læg den ind i page 5
select('#page5').child(myButton)
//lav en event listener
myButton.mousePressed( ()=>{
    shiftPage('#page1')
})

function shiftPage(newPage)
{
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}
