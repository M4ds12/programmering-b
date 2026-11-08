

var currentPage = "#page1"



//P5 setup bliver kaldt EN gang før siden vises
function setup()
{
    console.log('P5 setup kaldt')
    //sæt menu op
    //hent alle sider som et array
    var allPages = selectAll('.page')
    //løb listen igennem en for en
    allPages.map(
        (page) => {
            //æav et nyt <a> element
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
