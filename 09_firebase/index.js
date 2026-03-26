
//lav en ref (reference) til din collection
var testRef = db.collection("test")
console.log("oprettet reference til test:", testRef)





//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    //Nu kommer det geniale: ONSNAPSHOT
    testRef.onSnapshot( snap => {
        console.log("modtog snap", snap.size)
        snap.forEach( doc => {
            var d = doc.data()
            console.log(d)
        })
    })
}

