let serial;
let bgColor = 0;

function setup() {
  createCanvas(400, 200);
  serial = new p5.SerialPort();
  serial.on('list', printList);
  serial.on('data', serialEvent);
  serial.list();
  serial.open("COM3"); // Change this to the appropriate port for your Arduino
}

function printList(portList) {
  for (let i = 0; i < portList.length; i++) {
    console.log(i + " " + portList[i]);
  }
}

function serialEvent() {
  let message = serial.readLine();
  let value = parseInt(message);
  if (!isNaN(value)) {
    bgColor = map(value, 0, 1023, 0, 255);
  }
}

function draw() {
  background(bgColor);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Click to toggle LED", width / 2, height / 2 - 30);

  // Add a rectangle to represent the potentiometer value
  fill(255);
  rect(20, height - 40, map(bgColor, 0, 255, 0, width - 40), 20);
  noFill();
  rect(20, height - 40, width - 40, 20);
}


function mouseClicked() {
  let ledState = getCookie("ledState") === "1" ? "0" : "1";
  setCookie("ledState", ledState);
  serial.write(ledState);
}

function setCookie(name, value) {
  document.cookie = name + "=" + value + ";path=/";
}

function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split("=");
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return "";
}
