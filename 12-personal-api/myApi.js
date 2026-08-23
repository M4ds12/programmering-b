var timerInterval = null
var currentPage = "#page1"
var myArray = []
readyToShift = true
// Dine genbrugelige API-funktioner kommer her.


//Demands an HTML element with id=toast
function showToast(txt, timeout = 2000, type = "notify") {
    var toast = select('#toast')
    console.log('Forbundet til NEXT MQTT server')
    toast.html('Forbundet til NEXT MQTT server')
    toast.addClass('toastShow')
    setTimeout(() => {
        toast.removeClass('toastShow')
    }, 2000)
}

//ShiftPage(newId, fromId = currentPage, className = 'show'){
//if(!select(newId))


//}






function shiftPage(newPage, fromId = currentPage, className = "show") {
    if (!readyToShift) return
    if (!select(newPage)) return

    select(fromId).removeClass(className)   // brug fromId og className her
    currentPage = newPage
    select(currentPage).addClass(className) // og her

    readyToShift = false
    setTimeout(() => readyToShift = true, 1000)
    console.log("shiftPage called")
}


function startTimer(seconds, displayId, startBtn) {
    seconds = 0
    select(startBtn).mousePressed(() => {
        if (timerInterval == null) {
            select(startBtn).html("Stop timer")
            timerInterval = setInterval(() => {
                seconds++
                select(displayId).html(seconds + ' sek')
            }, 1000)

        } else {
            stopTimer(startBtn)
        }
    })



}

function stopTimer(stopBtn) {
    clearInterval(timerInterval)
    timerInterval = null
    select(stopBtn).html("Start timer")

}




function createList(list, containerId, className) {
    var container = select(containerId)
    container.html("")

    list.map(listElements => {
        var listDiv = createElement("div", listElements)
        listDiv.addClass(className)
        container.child(listDiv)
    })
}

function changeColor(color, changedDiv){
select(changedDiv).style("background-color", color)
}