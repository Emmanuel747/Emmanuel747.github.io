let port;
let writer, reader;
let ledBtn;
let sensorData = {};
let light = 0;
const encoder = new TextEncoder();
const decorder = new TextDecoder();

let lightDanceState = false;
let ledState = false;

function setup() {
  createCanvas(400, 400);

  if ("serial" in navigator) {

    // Create a container div for the buttons
    const buttonContainer = createDiv();
    buttonContainer.addClass('button-container');

    // The Web Serial API is supported.
    let button = createButton("connect");
    button.position(0,0);
    button.mousePressed(connect);
    button.addClass("connectBtn"); // Add the "Togglebutton" class to the button
    button.parent(buttonContainer); // Add the button to the container


    ledBtn = createButton("Toggle Led");
    ledBtn.position(0,50);
    ledBtn.mousePressed(toggleLED);
    ledBtn.addClass("connectBtn"); // Add the "Togglebutton" class to the button
    ledBtn.parent(buttonContainer); // Add the button to the container

    danceBtn = createButton("Suprise Light Dance");
    danceBtn.position(0,100);
    danceBtn.mousePressed(toggleLED_DANCE);
    danceBtn.addClass("connectBtn"); // Add the "Togglebutton" class to the button
    danceBtn.parent(buttonContainer); // Add the button to the container
  }
}

function keyTyped() {
  if (key === 'a') {
    activationState.active = !activationState.active;
    serialWrite(activationState);
  }
}

function draw() {
  if (activationState.active) {
    light = sensorData.light - 200
    background(light < 255 ? (light < 0 ? 0 : light) : 255); // Change background color based on light sensor value
    text("Light: " + sensorData.light, 10, 100);
  } else {
    background(220);
  }

  if (reader) {
    serialRead();
  }
}

async function connect() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });
  writer = port.writable.getWriter();
  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
}

async function serialRead() {
  while(true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    console.log(value);
    sensorData = JSON.parse(value);
  }
}

async function serialWrite(jsonObject) {
  if (writer) {
    writer.write(encoder.encode(JSON.stringify(jsonObject)+"\n"));
  }
}

function toggleLED_DANCE() {
  serialWrite({lightDance: !lightDanceState});
  lightDanceState = !lightDanceState;
}

function toggleLED() {
  serialWrite({toggleLED: !ledState}); // Send toggle LED command to arduino
  ledState = !ledState;
}


class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
