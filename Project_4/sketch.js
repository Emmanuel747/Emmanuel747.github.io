// Declare variables
let bugs = [];
let bugCount = 99;
let bugFace = 1;
let bugSpeed = 1;
let bugsKilled = 0;
let bugDirections = [-8, 8];
let startTime;
let gameState = "wait";

// Create a timer to track elapsed time
function timer() {
  return int((millis() - startTime) / 1000);
}

function preload() {
  // Load bug images
  bugImg = loadImage("./eman-bug.png");
  bugSmashedImg = loadImage("./eman-bug_squished.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
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
  }
}

function draw() {
  background(color(144, 238, 144));
  if (gameState == "wait") {
    // Display message to start the game
    textSize(30);
    text("Welcome to my game", width/2, height/2);
    text(" Click any where to start", width/2, height/2 + 35);
    if (mouseIsPressed) {
      // Start the game and timer when user presses a key
      startTime = millis();
      gameState = "playing";
    }
  } else if (gameState == "playing") {
    // Draw bugs, track time, and kill count during gameplay
    for (let i = 0; i < bugCount; i++) {
      bugs[i].draw();
    }
    let time = timer();
    // Format text(content, x-axis, y-axis);
    text("Time: " + time, 90, 20);
    text("Kill Count: " + bugsKilled, 150, 50);
    if (time >= 30) {
      // End game after 30 seconds
      gameState = "end";
    }
  } else if (gameState == "end") {
    // Display end game message and restart prompt
    text("Game over", width/2, height/2);
    text("Press any key to restart", width/2, height/2 + 35);
    if (mouseIsPressed) {
      // Restart game if user clicks mouse
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

function mouseClicked() {
  // Handle clicks on bugs
  for (let i = 0; i < bugCount; i++) {
    if (
      mouseX >= bugs[i].x + 35 &&
      mouseX <= bugs[i].x + 102 &&
      mouseY >= 43 + bugs[i].y &&
      mouseY <= 99 + bugs[i].y &&
      bugs[i].bugClicked != true
    ) {
      // If bug is clicked and not already stopped, stop its movement and add to kill count
      bugs[i].bugClicked = true;
      bugsKilled++;
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
