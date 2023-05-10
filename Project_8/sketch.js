// Declare variables
let bugs = [];
let bugCount = 99;
let bugFace = 1;
let bugSpeed = 1;
let bugsKilled = 0;
let bugDirections = [-8, 8];
let startTime;
let gameState = "wait";
let isMuted = false; // flag to track whether the sound is muted or not
let hasSongPlayed = false
let playTime = 31; // number of seconds player has for one round.
let hammerImg;

// webserial Varibles
let port, writer, reader;
let button2;
let sensorData = {};
let light = 0;
let button;
const encoder = new TextEncoder();
const decorder = new TextDecoder();

let activationState = { active: false };

//ArdinoBoard values
let cursorPos = { x: 500, y: 600 };


// Create a timer to track elapsed time
function timer() {
  return int(((playTime * 1000) - (millis() - startTime)) / 1000);
}

function preload() {
  // Load bug images
  bugImg = loadImage("./eman-bug.png");
  bugSmashedImg = loadImage("./eman-bug_squished.png");
  hammerImg = loadImage("./eman-spray.png");

  // Load background music
  backgroundMusic = loadSound("./sounds/background-music.mp3");
  skitteringSound = loadSound("./sounds/skittering-sound.mp3");
  bossSound = loadSound("./sounds/Battleship.mp3");
  squishSound = loadSound("./sounds/squish-sound.mp3");
  victorySound = loadSound("./sounds/round-complete.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  if ("serial" in navigator) {
    // The Web Serial API is supported.
    button = createButton("Click to Connect GamePad");
    button.addClass("connectBtn"); // Add the "connectBtn" class to the button
    button.position(windowWidth /2 - 400, windowHeight / 3 + 200);
    cursorPos = { x: windowWidth /2 - 85, y: windowHeight / 3 };
    button.mousePressed(connect);
  }

  // Play background music and set it to loop
  backgroundMusic.setVolume(0.15);
  backgroundMusic.play();
  backgroundMusic.loop();

  skitteringSound.setVolume(0.2);
  skitteringSound.play();


  // Create array of Bug objects
  for (let i = 0; i < bugCount; i++) {
    bugs[i] = new Bug(
      bugImg,
      bugSmashedImg,
      random(10, windowWidth - 400),
      random(10, windowHeight),
      random(bugDirections),
      false,
      windowHeight,
      windowWidth
    );
  };
  toggleMute()
}

function draw() {
  background(color(124, 48, 48));
  drawMuteBtn();
  // cursor("none"); // hide default cursor
  image(hammerImg, cursorPos.x, cursorPos.y, 85, 85); // replace with spray bottle
  if (reader) { serialRead() };

  if (gameState == "wait") {
    // Display message to start the game
    textSize(30);
    text("Welcome to my game", width / 2, height / 2);
    text("Once you connected your Game Pad", width / 2 + 100, height / 2 + 35);
    text(" Press Spacebar to Start", width / 2 + 20, height / 2 + 70);
    if (keyCode === 32 || sensorData.button === 1) { // checks to see if spacebar has been pressed
      // Start the game and timer when user presses a key
      startTime = millis();
      gameState = "playing";
    }
    keyCode = 0;
  } else if (gameState == "playing") {
    cursor("none"); // hide default cursor

      if (sensorData.button === 1) {
        buttonPressed();
      }
        keyCode = 0;
        playBossTrack();

        // cursor(); //  enable mouse cursor
        // Draw bugs, track time, and kill count during gameplay
        for (let i = 0; i < bugCount; i++) {
          bugs[i].draw();
        }
        let time = timer();
        // Format text(content, x-axis, y-axis);
        text("Time: " + time, 90, 20);
        text("Kill Count: " + bugsKilled, 150, 50);
        if (time <= 0) {
          // End game after 30 seconds
          gameState = "end";
        }
        hasVicSongPlayed = false;
 


  } else if (gameState == "end") {
    playBossTrack();
    noCursor();
    // Display end game message and restart prompt
    text("Kill Count: " + bugsKilled, width / 2 + 7, height / 2 - 35);
    text("Game Over", width / 2, height / 2);
    text("Press spacebar to restart", width / 2 + 92, height / 2 + 35);
    skitteringSound.stop();
    backgroundMusic.stop();

    if (keyCode === 32) {
      // Restart game if user presses spacebar
      startTime = millis();
      // Stop movement of all clicked bugs
      for (let i = 0; i < bugCount; i++) {
        if (bugs[i].bugClicked == true) {
          bugs[i].bugClicked = false;
        }
      }
      // Reset kill count and resume gameplay
      bugsKilled = 0;
      gameState = "playing";
    }
  }
}

function buttonPressed() {
  console.log("FIREEE --> ", sensorData.button)
  // Handle clicks on bugs
  for (let i = 0; i < bugCount; i++) {
    if (
      cursorPos.x >= bugs[i].x + 35 &&
      cursorPos.x <= bugs[i].x + 102 &&
      cursorPos.y >= 43 + bugs[i].y &&
      cursorPos.y <= 99 + bugs[i].y &&
      bugs[i].bugClicked != true
    ) {
      // toggle spray can image if button is presssed.
      image(hammerImg, cursorPos.x, cursorPos.y, 85, 85);
      // Play the squish sound effect using Tone.js
      squishSound.play();

      // If bug is clicked and not already stopped, stop its movement and add to kill count
      bugs[i].bugClicked = true;
      bugsKilled++;

      serialWrite({ score: bugsKilled });
      bugSpeed += 2;
    }
  }
}

class Bug {
  constructor(img, bugSmashedImg, x, y, direction, bugClicked, windowHeight, windowWidth) {
    this.img = img;
    this.bugSmashedImg = bugSmashedImg;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.bugClicked = bugClicked;
    this.windowHeight = windowHeight;
    this.windowWidth = windowWidth;
    this.face = this.direction > 0 ? 1 : -1;
    this.speed = 1;
  }

  // Draw the bug, either the normal image or the smashed one, depending on whether it has been clicked or not
  draw() {
    push();
    translate(this.x, this.y);
    scale(this.face, 1);
    if (!this.bugClicked) {
      image(this.img, 20, 20, 100, 100, 0, 0, 0, 0);
      this.x += this.direction;
    } else {
      image(this.bugSmashedImg, 20, 20, 100, 100, 0, 0, 0, 0);
    }
    if (this.x > this.windowWidth - 100 || this.x < -20) {
      this.direction = -this.direction;
      this.face = -this.face;
    }
    pop();
  }

  // Method to check if the bug has been clicked
  clicked(x, y) {
    const bugWidth = 90;
    const bugHeight = 90;
    const bugX = this.x + 40;
    const bugY = 50 + this.y;
    if (x >= bugX && x <= bugX + bugWidth && y >= bugY && y <= bugY + bugHeight && !this.bugClicked) {
      this.bugClicked = true;
      bugsKilled++;

      this.speed += 2;
    }
  }
}

function drawMuteBtn() {
  // Draw the mute/unmute button
  textSize(30);
  textAlign(RIGHT, TOP);
  fill(isMuted ? '#ff0000' : '#000000');
  // text(isMuted ? "🔊 Unmute" : "🔇 Mute", width - 70, 10);
  let muteBtn = document.getElementById('mute-btn');
  isMuted ? muteBtn.textContent = "🔊 Unmute" : muteBtn.textContent = "🔇 Mute";
  muteBtn.onclick = toggleMute;
}

function toggleMute() {
  if (isMuted) {
    backgroundMusic.setVolume(0.1); // set volume to normal
    skitteringSound.setVolume(0.8);
    bossSound.setVolume(0.2);
    victorySound.setVolume(0.3);
    squishSound.setVolume(0.9);
  } else {
    backgroundMusic.setVolume(0); // mute the background music
    skitteringSound.setVolume(0); // mute the skittering sound
    bossSound.setVolume(0);
    victorySound.setVolume(0);
    squishSound.setVolume(0);
  }
  isMuted = !isMuted; // toggle the flag
}

function playBossTrack() {
  if (gameState === "playing" && !hasSongPlayed) {
    backgroundMusic.stop();
    bossSound.setVolume(0.1);
    bossSound.play();
    skitteringSound.setVolume(0.2);
    skitteringSound.play();
    skitteringSound.loop();
    hasSongPlayed = true;
  } else if (gameState === "end" && !hasVicSongPlayed) {
    bossSound.stop();
    victorySound.setVolume(0.3);
    victorySound.play();
    hasVicSongPlayed = true;
  }
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

// Function to connect to the Board
async function connect() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    writer = port.writable.getWriter();
    reader = port.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader();
    button.remove();
  } catch (err) {
    console.log(err);
  }

}

// helper function to read and parse JSON string from board
async function serialRead() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    } 
    sensorData = JSON.parse(value);
    console.log(sensorData);
    cursorPos.x = map(sensorData.x, 0, 750, width / 1.3, 0);
    cursorPos.y = map(sensorData.y, 0, 750, width / 1.3, 0);

  }
}

// helper function to write and stringify varibles to JSON
function serialWrite(jsonObject) {
  if (writer) {
    writer.write(encoder.encode(JSON.stringify(jsonObject) + "\n"));
  }
}

// professor's example
// async function serialRead() {
//   // Listen to data coming from the serial device.
//   while (true) {
//     const { value, done } = await reader.read();
//     if (done) {
//       // Allow the serial port to be closed later.
//       reader.releaseLock();
//       break;
//     }
//     // value is a string.
//     console.log(value);
//   }
// }