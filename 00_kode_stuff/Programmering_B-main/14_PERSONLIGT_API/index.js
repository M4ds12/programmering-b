
//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){

    
    createCard('guhhh', 'https://media.tenor.com/5x7yNPBj5HcAAAAm/happy.webp', '#cards')
    // Brug funktionerne fra dit personlige API her.
    showToast('SELMA ER SMEGMA', 5000, 'warning')
    
    select('#page1 #buttonIdle').mousePressed(() => {
        select('#page1 #buttonIdle').removeClass("visible")
        select('#page1 #buttonIdle').addClass("hidden")
        select('#page1 #buttonPressed').addClass("visible")
        select('#page1 #buttonPressed').removeClass("hidden")

        setTimeout(() => {
            select('#page1 #buttonPressed').removeClass("visible")
            select('#page1 #buttonPressed').addClass("hidden")
            select('#page1 #buttonIdle').removeClass("hidden")
            select('#page1 #buttonIdle').addClass("visible")
            
            setTimeout(() => {
                shiftPage('#page2')
                startTimer()
            }, (500))
        }, (500));

        //jeg behøver ikke skrive 'notify' for at få en notify toast, da den er sat til default
        showToast('skiftet til page2', 5000)
    })

    select('#page2 #buttonContainer ').mousePressed(() => {
        select('#page2 #buttonIdle').removeClass("visible")
        select('#page2 #buttonIdle').addClass("hidden")
        select('#page2 #buttonPressed').addClass("visible")
        select('#page2 #buttonPressed').removeClass("hidden")

        setTimeout(() => {
            select('#page2 #buttonPressed').removeClass("visible")
            select('#page2 #buttonPressed').addClass("hidden")
            select('#page2 #buttonIdle').removeClass("hidden")
            select('#page2 #buttonIdle').addClass("visible")
            
            setTimeout(() => {
                shiftPage('#page1')
                stopTimer()
            }, (500))
        }, (500));
    })

}
