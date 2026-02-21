//This script takes a cssv file and cleans the data into a javascript array

var table
//cleandata will hold the javascript objects we intend
var cleanData = []

const csvFile = "./assets/sleepDataset.csv"
//vi vil kun bruge 1000 rækker når vi skal tegne dem på skærmen
const maxRows = 1000

function preload(){
    //loadTable er en p5 funktion der henter en tabel fra en fil
    table = loadTable(csvFile, "csv", "header")
    console.log("data tabel loaded", table)

}

//Problemformulering: Kan jeg lave en algoritme som kan forudsige folks stress niveau,
//ud fra deres koffein indtagelse og fysiske aktivitets niveau?
function setup(){
    console.log("rå data kolonner: ", table.columns)
    var yValue = "Caffeine_Intake"
    var xValue = "Physical_Activity_Level"
    labelValue = "Stress_Level"
    //table.rows er et array med alle data objekterne i
    //Map returnerer et nyt array med de elementer vi gerne vil have
    cleanData = table.rows.map( row =>{
      var x = row.get(xValue)
      var y = row.get(yValue)
      var returnObj = {
        [xValue]: Number(x), 
        [yValue]: Number(y)
      }
      if(labelValue){
        returnObj.label = Number(row.get(labelValue))
      }
      return returnObj     
    })
    console.log(cleanData)

    //Vi filtrerer så lige arrayet så vi er sikre på at alle de dimensioner vi skal bruge 
    //er udfyldte
    cleanData = cleanData.filter( row => {
        //valid er true hvis begge fekter er et tal
        var valid = !isNaN(row[xValue]) && !isNaN(row[yValue])
        //men vi skal også tjekke om label er noget HVIS vi har en label
        if(labelValue && !row.label){
            valid = false
        }
        return valid
    })

    //bland data vilkårligt (p5 funktion der blander et array)
    cleanData = shuffle(cleanData)

    cleanData = cleanData.slice(0, maxRows)

    console.log("Så har vi renset data: ", cleanData)

    select("#status").html(`vi har nu renset data og skåret det ned til at være maks 1000 rækker - kig i konsollen <3`)
}


