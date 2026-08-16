var seconds = 0

    let scores = [
    { "name": "Langsom gut", seconds: 80 },
    { "name": "Simon", seconds: 20 },
    { "name": "Ludvig", seconds: 40 },
    { "name": "Xavier", seconds: 40 },
    { "name": "Hurtigste", seconds: 2 },
    { "name": "Anden hurtigste", seconds: 4 },
    { "name": "Tredje hurtigste", seconds: 6 },
    { "name": "Bastian", seconds: 28 },
    { "name": "Tobias", seconds: 50}
]


//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    


console.log(scores)


 select('#saveScore').mousePressed(() => {
    
    saveName()
        // console.log(scores, "Dit input er gemt")
        
      

})


}




function saveName(){
     var navn = select('#arrayInput').value().trim()
    if (navn === '') {
        select('#arrayInput').attribute('placeholder', 'Skriv noget først')
        return
    }
    scores.push({
        name: navn
       
    })
    scores.forEach(e => {
        select("#scoreDisplay").html(e.name, e.seconds)
    });

    console.log(scores, "scores efter push")


    sortNames()
}



function sortNames(){
    scores.sort((a,b) => a.seconds - b.seconds)
    console.log(scores)
}