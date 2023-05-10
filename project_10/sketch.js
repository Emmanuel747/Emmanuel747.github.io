let currentBackgroundColor = 220;
let textColor;
let angle = 0;

let radius;
let circleSegments = 4; // default 90
let targetSegment = 1;
let currentSegmentDisplay = null;
let targetWidth = 0; // How many circleSegments adjacent to the targetSegment also count

let spacebarEnabled = false;
let isPlaying = false; 
let mediumModeStarted = false;
let bossModeStarted = false;
let playerMissed = false;

let score = 0;
let level = 1;
let round = 1;
let speed = 0.03 + (round * 0.005);

let highScore = 0;
let highScoreRound = 0;
let roundStartTime = 0;
let roundScore = 0;

let levelText = "LEVEL " + level;

// preloading sounds
function preload() {
  successSound = loadSound('./sounds/button-124476.mp3');
  failureSound = loadSound('./sounds/game-over-arcade-6435.mp3');
  backgroundMusic = loadSound('./sounds/arguement-loop-27901.mp3');
  nextRoundMusic = loadSound('./sounds/coin-upaif-14631.mp3');
  mediumModeMusic = loadSound('./sounds/8-bit-melody-loop-37872.mp3');
  bossBgMusic = loadSound('./sounds/high-energy-loop-69158.mp3');
  buildUpTransition = loadSound('./sounds/reloaded-145002.mp3');

}

function setup() {
  createCanvas(800, 800);
  textColor = color(0, 0, 0);
  radius = min(width, height) / 2 * 0.8;
  // backgroundMusic.loop();
  backgroundMusic.setVolume(0.8);

  // Create the div to display the level
  levelDisplay = createDiv("LEVEL " + level);
  levelDisplay.id("levelDisplay");
  levelDisplay.position(width / 2, 50);
}

function draw() {
  background(currentBackgroundColor);
  translate(width / 2, height / 2);

  // Update the level display
  levelDisplay.html(levelText);

   // Calculate time elapsed since the start of the round when in play
  let timeElapsed = millis() - roundStartTime;
  if (!isPlaying) {
    roundScore = roundScore;
  } else {
    roundScore = max(200 - floor(timeElapsed / 1000) * 10, 20);
  }

  for (let i = 0; i < circleSegments; i++) {
    push();
    rotate((TWO_PI / circleSegments) * i);
    if (i == targetSegment) {
      fill(255, 0, 0);
    } else if (i == currentSegmentDisplay) {
      fill(255, 165, 0); // Set the color to orange for the current segment
    } else {
      fill(255);
    }
    rect(radius, -10, 40, 20);
    pop();
  }

  if (isPlaying) {
    push();
    rotate(angle);
    fill(0, 255, 0);
    rect(radius, -10, 40, 20);
    angle += speed;
    pop();
  }

  // Display score and round
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(textColor);
  text("Highest Round: " + highScoreRound, 0, -height / 2 + 150);
  text("Highest Score: " + highScore, 0, -height / 2 + 200);

  text("Round: " + round, 0, -height / 2 + 350);
  text("Score: " + score, 0, -height / 2 + 400);
  text("Round Score: " + roundScore, 0, -height / 2 + 450);

  if (!isPlaying && playerMissed) {
    textSize(64);
    fill(255, 0, 0);
    text("MISSED", 0, -height / 2 + 550);
  } else if (!isPlaying) {
    textSize(64);
    fill(255, 165, 0);
    text("PAUSED", 0, -height / 2 + 550);
  }
}

function keyPressed() {
  if ((keyCode === 32 && spacebarEnabled) || (mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height)) { // Spacebar or touch on mobile
    let currentSegment = floor((angle % TWO_PI) / (TWO_PI / circleSegments));
    currentSegmentDisplay = currentSegment; // Update current segment display value
    let lowerBound = (targetSegment - targetWidth + circleSegments) % circleSegments;
    let upperBound = (targetSegment + targetWidth) % circleSegments;
    
    if ((currentSegment >= lowerBound && currentSegment <= upperBound) || (currentSegment <= upperBound && lowerBound > upperBound) || (currentSegment >= lowerBound && lowerBound > upperBound)) {
      console.log("Success!");
      flashSuccess();
      score += roundScore;
      nextRound();

      // Update high score and high score round if the current score is higher
      if (score > highScore) {
        highScore = score;
        highScoreRound = round;
      }
    } else {
      console.log("Try again!");
      flashFailure();
      resetRound();
    }
  } else if (keyCode === ESCAPE) { // Escape key
    togglePause();
  }
}

function togglePause() {
  isPlaying = !isPlaying;
  if (!isPlaying) {
    spacebarEnabled = false;
    backgroundMusic.stop();
    if (bossModeStarted) bossBgMusic.setVolume(0);
    if (mediumModeStarted) mediumModeMusic.setVolume(0);
  } else {
    spacebarEnabled = true;
    if (bossModeStarted) {
      bossBgMusic.setVolume(0.5);
    } else if (mediumModeStarted) {
      mediumModeMusic.setVolume(0.5);
    } else backgroundMusic.loop();
  }
}

async function nextLevel() {
  if (round % 4 === 0) {
    isPlaying = false;
    level++
    levelText = "LEVEL " + level;
    nextRoundMusic.play();
    speed += 0.011;
    await sleep(2000);
    circleSegments += 10;
    isPlaying = true;

    if (targetWidth <= 7 && round > 3) {
      targetWidth += 1;
    }
  }
  if (level === 3 && !mediumModeStarted) {
    levelText = "LEVEL " + level + " - Warming Up!"
    backgroundMusic.stop();
    // buildUpTransition.play();
    // buildUpTransition.setVolume(0.5);
    mediumModeMusic.loop();
    togglePause();
    await sleep(3000); //wait 6secs for build up
    // bossBgMusic.setVolume(0.5);
    // bossBgMusic.loop();
    mediumModeStarted = true;
    currentBackgroundColor = 90;
    textColor = color(173, 216, 230); // Light blue
    togglePause();
  }
  if (level === 5 && !bossModeStarted) {
    levelText = "LEVEL " + level + "- Boss Mode!"
    backgroundMusic.stop();
    buildUpTransition.play();
    buildUpTransition.setVolume(0.5);
    togglePause();
    await sleep(9000); //wait 6secs for build up
    bossBgMusic.setVolume(0.5);
    bossBgMusic.loop();
    bossModeStarted = true;
    currentBackgroundColor = 50;
    textColor = color(238, 130, 238); // Light violet
    togglePause();
  }
}

function nextRound() {
  round++;
  targetSegment = floor(random(circleSegments));
  roundStartTime = millis(); // Update round start time
  currentSegmentDisplay = null; // Clear current segment display value

  nextLevel();   // Update level
}

function resetRound() {
  level = 1;
  round = 1;
  score = 0;
  speed = 0.03;
  roundStartTime = millis(); // Update round start time
  backgroundMusic.stop();
  mediumModeMusic.stop();
  bossBgMusic.stop();
  levelText = "LEVEL " + level
  currentBackgroundColor = 220;
  textColor = color(0, 0, 0);
  bossModeStarted = false;
  mediumModeStarted = false;
  // currentSegmentDisplay = null; // Clear current segment display value
}

async function playAgain() {
  backgroundMusic.stop();
  bossBgMusic.stop();
  failureSound.play();
  currentBackgroundColor = color(255, 102, 102);
  playerMissed = true;
  isPlaying = false;
  await sleep(3000);
  targetSegment = 1;
  circleSegments = 4;
  playerMissed = false;
  isPlaying = true;
  backgroundMusic.loop(); 
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function flashSuccess() {

  successSound.play();
}

async function flashFailure() {


  playAgain();
}
