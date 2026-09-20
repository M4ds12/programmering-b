
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7PnEf6erI8t4m_Y6wlwKsoUqNl_fTuxo",
  authDomain: "first-firebase-dc65f.firebaseapp.com",
  projectId: "first-firebase-dc65f",
  storageBucket: "first-firebase-dc65f.firebasestorage.app",
  messagingSenderId: "284470427139",
  appId: "1:284470427139:web:e489e0225e8387ab27d836",
  measurementId: "G-GPRVNEMPBD"
};


//opret forbindelse til firebase. Firebase virker på grund af html biblioteket
firebase.initializeApp(firebaseConfig)
console.log("firebase startet med: ", firebaseConfig.projectId)



//vi får nu et firestore "objekt" som vi kan bruge til at kommunikerer med forestore databasen
var db = firebase.firestore()
console.log("forbindelse til firestore oprettet")
