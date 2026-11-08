//This script takes a .csv file and clean the data into javasript array

//.csv filen er en tabel
var table 
//cleanData will hold the javasript objects we intend to use
var cleanData = []

const csvFile = "./assets/IRIS.csv"
//vi vil kun bruge max 1000 rækker - da vi skal kunne tegne dem på skærmen
const maxRows = 1000

function preload(){
    console.log("gooning rn 👅👅")
    //loadTable er en p5-funktion som henter en tabel fra en fil
    table = loadTable(csvFile, "csv", "header")
    console.log("data tabel loaded")
}

//kan jeg lave en algoritme som kan forudsige folks jobtilfredshed ud fra deres transporttid og søvntimer
function setup(){
    console.log("Rå data kolonner: ", table.columns)
    var xValue = "sepal_length"
    var yValue = "sepal_width"
    var labelValue = "species"
    //table.rows er et array med alle data objekterne i
    //map returnerer et nyt array med de dimentioner vi gerne vil have
    cleanData = table.rows.map( row => {
        var x = row.get(xValue)
        var y = row.get(yValue)
        var returnObj = {
            [xValue]: Number(x),
            [yValue]: Number(y),
        }
        if(labelValue){
            returnObj.label = row.get(labelValue)
        }
        return returnObj
    })

    console.log(cleanData)
    //vi filterer så lige arrayet så vi er sikre på at alle de dimensioner vi skal bruge er...?
    cleanData = cleanData.filter( row => {
        //valid er true, hvis begge felter er et TALs
        var valid = !isNaN(row[xValue]) && !isNaN(row[yValue])
        //MEN vi skal også tjekke om label er noget HVIS vi har et label
        if(labelValue && row.label){
            valid = false
        }
        return valid
    })

    //bland data vilkårlig (p5 funktion der blander array)
    cleanData = shuffle(cleanData)

    cleanData = cleanData.slice(0, maxRows)

    //console.log("så har vi renset data: ", cleanData)

    select("#status").html(`Vi har nu renset data skåret det ned til maks 1000 rækker - kig i rækken bihh`)
}


