var currentPage = '#page1';
var classifier;
var capture;
var lastSent = 0;
var isPredicting = false;
var motorCooldown = null;
let label = 'waiting...';
let kategori = "";
 
const client = new Paho.MQTT.Client(
    "mqtt-plain.nextservices.dk", 9001,
    "client_" + Math.random().toString(36).substr(2, 9)
);
client.connect({
    onSuccess: () => console.log("Forbundet til MQTT"),
    onFailure: (err) => console.error("Fejl:", err.errorMessage)
});
 
function preload() {
    classifier = ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/oDrVaAEys/model.json");
}

function setup() {
    noCanvas();
    shiftPage(currentPage);
 
    capture = createCapture(VIDEO, { flipped: true });
    capture.size(720, 468);
    capture.parent('webcam-container');
 
    var allPages = selectAll('.page');
    allPages.map(page => {
        var menuItem = createElement('a');
        menuItem.html(page.attribute('title'));
        menuItem.mousePressed(() => shiftPage('#' + page.attribute('id')));
        select('.sidebar').child(menuItem);
    });
 
    select('#inputLeft').mousePressed(() => {
        sendCommand('accel 10000');
        sendCommand('speed 6000');
        sendCommand('left 20 rev');
        console.log("left pressed");
    });
 
    select('#inputRight').mousePressed(() => {
        sendCommand('accel 15000');
        sendCommand('speed 6000');
        sendCommand('right 20 rev');
    });
 
    select('#stopButton').mousePressed(() => {
        sendCommand('stop');
    });
 
    classifyVideo();
}
 
function draw() {}
 
function shiftPage(newPage) {
    select(currentPage).removeClass('show');
    select(newPage).addClass('show');
    currentPage = newPage;
}
 
function sendCommand(cmd) {
    if (!client.isConnected()) {
        console.warn("MQTT not connected!");
        return;
    }
    console.log("Sending:", cmd);
    let message = new Paho.MQTT.Message(cmd);
    message.destinationName = "stepper/atom-846bcc/cmd";
    client.send(message);
}
 
function classifyVideo() {
    classifier.classify(capture, gotResults);
}
 
function gotResults(results, error) {
    if (error) {
        console.error(error);
        classifyVideo();
        return;
    }
 
    label = results[0].label;
    const confidence = results[0].confidence;
    console.log(label, confidence);
 
    // Update the label in the DOM
    document.getElementById('label-display').textContent = label;
 
    // Send MQTT kommandoer baseret på klasse/affaldstype
     if (motorCooldown === null && millis() - lastSent >= 2000) {
        if (confidence > 0.95 && label === "Metal") {
            sendCommand('accel 10000');
            sendCommand('speed 6000');
            sendCommand('left 20 rev');
            lastSent = millis();
            motorCooldown = setTimeout(() => { motorCooldown = null; }, 3000);
        } else if (confidence > 0.95 && label === "Mad") {
            sendCommand('accel 10000');
            sendCommand('speed 6000');
            sendCommand('left 1 rev');
            lastSent = millis();
            motorCooldown = setTimeout(() => { motorCooldown = null; }, 3000);
        }
        else if (confidence > 0.95 && label === "Restaffald"){
            {
            sendCommand('accel 10000');
            sendCommand('speed 6000');
            sendCommand('right 10 rev');
            lastSent = millis();
            motorCooldown = setTimeout(() => { motorCooldown = null; }, 3000);
        } }
    } 
 

    classifyVideo();
}
 
 
/*
{"id":"atom-846bcc",
"ip":"10.146.104.27",
"fw":"stepper-mqtt-v4.1",
"type":"stepper",
"cmd_topic":"stepper/atom-846bcc/cmd",
"legacy_cmd":"stepAgent",
"presence_topic":"stepper/atom-846bcc/presence",
"status_topic":"stepper/atom-846bcc/status",
"commands":["right/left N rev|steps",
"speed N",
"accel N",
"stop",
"status",
"reset",
"led off|red|green|blue|orange|amber|#RRGGBB",
"test pulse N",
"enpol activelow|activehigh"],
"speed_range":[10,6000],
"accel_range":[50,20000],
"steps_per_rev":6400}
*/
 
