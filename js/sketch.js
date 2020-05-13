"use strict";
// template for firebase

let nodeData; // object we will push to firebase
let fbData; // data we pull from firebase
let fbDataArray; // firebase data values converted to an array
let database; // reference to our firebase database
let folderName = "softMessages"; // name of folder you create in db
let messageInput;
let usernameInput;
let sendBtn;
let chatsLoaded = false;
let messageDiv;
let audioStart = false;

function setup() {

  noCanvas();

  // Initialize firebase
  // support for Firebase Realtime Database 4 web here: https://firebase.google.com/docs/database/web/start
  // Copy and paste your config here (replace object commented out)
  // ---> directions on finding config below

  messageDiv = document.querySelector('#messageDiv');

  usernameInput = select('#usernameInput');
  messageInput = select('#messageInput');
  sendBtn = select('#sendBtn');

  messageInput.changed(sendMessage);
  sendBtn.mousePressed(sendMessage);

  let config = {
    apiKey: "AIzaSyCEM2bNRQtaLOLzMNRvgJTz1BImTRb-MPI",
    authDomain: "social-c7c31.firebaseapp.com",
    databaseURL: "https://social-c7c31.firebaseio.com",
    projectId: "social-c7c31",
    storageBucket: "social-c7c31.appspot.com",
    messagingSenderId: "7276354307",
    appId: "1:7276354307:web:002e05daba1c356d9be736"
  };

  firebase.initializeApp(config);

  database = firebase.database();

  // this references the folder you want your data to appear in
  let ref = database.ref(folderName);
  // **** folderName must be consistant across all calls to this folder

  ref.on('value', gotData, errData);


  // ---> To find your config object:
  // They will provide it during Firebase setup
  // or (if your project already created)
  // 1. Go to main console page
  // 2. Click on project
  // 3. On project home page click on name of app under project name (in large font)
  // 4. Click the gear icon --> it's in there!
}

function draw() {

}

function mousePressed() {
    audioStart = true;
    console.log("audio on");
    let snd = new Audio("../images/birb.mp3");
    snd.volume = 0.2;
}

function sendMessage() {

  if (usernameInput.value() !== '' && messageInput.value() != '' && audioStart) {


    let snd = new Audio("../images/bell.mp3");
    snd.volume = 0.2;

    snd.play();

    let timestamp = Date.now();
    let chatObject = {
      username: usernameInput.value(),
      message: messageInput.value(),
      timestamp: timestamp,
    }

    createNode(folderName, timestamp, chatObject);
    messageInput.value('');


  } else {
    alert('type username and message first!')
  }
}

function displayPastChats() {
  let length = fbDataArray.length;

  for (let i = 0; i < length; i++) {
    let date = new Date(fbDataArray[i].timestamp);
    let p = createP(`${fbDataArray[i].username}: <br> ${fbDataArray[i].message}`);
    let p2 = createP(`${fbDataArray[i].username}: <br> ${fbDataArray[i].message}`);

    p2.position(i * 50, random(windowHeight));
    p2.style('background-color', `hsl(${(i + 180) % 300}, 100%, 60%)`); //changed color
    let opacity = map(i / length, 0, 1, 0, .9);
    p2.style('opacity', .5);

    p.parent('messageDiv');

    p2.class('message');
  }

  messageDiv.scrollTop = messageDiv.scrollHeight - messageDiv.clientHeight;
}

function displayLastChat() {
  let index = fbDataArray.length - 1;
  let p = createP(`${fbDataArray[index].username}:
    <br> ${fbDataArray[index].message}`);
  let p2 = createP(`${fbDataArray[index].username}:
    <br> ${fbDataArray[index].message}`);

  p2.position(index * 50, random(windowHeight));
  p.parent('messageDiv');

  p2.class('message');

  messageDiv.scrollTop = messageDiv.scrollHeight - messageDiv.clientHeight;
}
