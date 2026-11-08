//lav en ref til din collection
var quotesRef = db.collection("quotes")
console.log("oprettet reference til quotes")
var edit_id = ""
var edit_div = ""

//P5 setup() bliver kaldt EN gang før siden vises 
function setup() {

    //NU KOMMER DET GENIALE!!!! .onSnapshot
    quotesRef.onSnapshot(snap => {
        console.log("modtog snap fra anton svane 🦶", snap.size)
        //ryd quotes div og sæt nye quotes ind
        select("#quotes").html("")
        snap.forEach(doc => {
            var d = doc.data()
            //vi laver lige en reference til tekst div'en
            var qDiv = createDiv(d.textQ)
            qDiv.mousePressed(() => {
                qDiv.attribute("contenteditable", "true")
                edit_id = doc.id
                edit_div = qDiv
            })
            //opret quote kort med knapper
            select("#quotes")
                .child(
                    createDiv().addClass("card")
                        .child(
                            qDiv
                        ).child(
                            createDiv(d.textC)
                        )
                        .child(
                            createDiv(d.timestamp.toDate().toLocaleDateString("da-dk", {
                                month: "short",
                                weekday: "long"
                            })).addClass("date")
                        )
                        .child(
                            createImg("./assets/delete.svg")
                                .addClass("delete")
                                .mousePressed(() => {
                                    if (confirm(
                                        ("Er du nu sikker på at du vil fjerne dette permanent? Det kan altså være en ret dårlig idé at slette noget, da du mister muligheden for at genskabe eller revurdere det senere. Information, filer eller beslutninger kan få ny værdi i en anden sammenhæng, og når de først er væk, er de ofte svære eller umulige at få tilbage. Derudover kan sletning skabe huller i dokumentation eller historik, hvilket gør det sværere at forstå tidligere valg eller fejl. Kort sagt: det, der virker overflødigt nu, kan vise sig at være vigtigt senere. Her er din ide: " + d.text)))
                                    quotesRef.doc(doc.id).delete()
                                })
                        )
                )
        })
    })
}

//key pressed er en indbygget function i p5.js
function keyPressed() {
    //console.log(key)
    if (key == "Enter") {
        //nu skal vi opdater databasen
        if (edit_id != "") {
            console.log(edit_div.html())
            quotesRef.doc(edit_id).update({textQ:edit_div.html()})
            .then(()=>{
                edit_id = ""
                edit_div = ""
                console.log("quote opdateret")
            })
        }else{
            //hent teksten fra input feltet
            var q = select("#newQuote").value()
            var c = select("#newCitat").value()
            if (q == "") {
                confirm("skriv quote bitchass niiggaaa")
                return
            }
            //nu skal vi gemme det nye quote i firestore
            //funktionen add() på en collectionref
            //OPRETTER en ny collection hvis den IKKE findes
            quotesRef.add({
                textQ: q,
                textC: c,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
                //.then kalde aynkront NÅR add er færdig
            }).then(
                console.log("Quote gemt i databasen", q),
                console.log("Citat gemt i databasen", c)
            )


            //citat

            //nu skal vi gemme det nye quote i firestore
            //funktionen add() på en collectionref
            //OPRETTER en ny collection hvis den IKKE findes

        }
        select("#newQuote").html("")
    }
}

