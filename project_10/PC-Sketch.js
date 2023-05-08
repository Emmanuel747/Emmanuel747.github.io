let angle = 0;
let speed = 0.05;
let radius;
let circleSegments = 37;
let targetSegment = 9;
let isPlaying = true;

function setup() {
  createCanvas(800, 800);
  radius = min(width, height) / 2 * 0.8;
}

function draw() {
  background(220);

  translate(width / 2, height / 2);

  for (let i = 0; i < circleSegments; i++) {
    push();
    rotate((TWO_PI / circleSegments) * i);
    if (i == targetSegment) {
      fill(255, 0, 0);
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
}

function keyPressed() {
  if (keyCode === 32) { // Spacebar
    let currentSegment = floor((angle % TWO_PI) / (TWO_PI / circleSegments));
    if (currentSegment == targetSegment) {
      console.log("Success!");
      flashSuccess();
    } else {
      console.log("Try again!");
      flashFailure();
    }
    isPlaying = !isPlaying;
  }
}

function flashSuccess() {
  let flashCount = 10;
    for (let i = 0; i < circleSegments; i++) {
      push();
      rotate((TWO_PI / circleSegments) * i);
      fill(random(255), random(255), random(255));
      rect(radius, -10, 40, 20);
      setInterval(() => {}, 2000);
      pop();
    }
    flashCount--;
    if (flashCount === 0) {
      clearInterval(interval);
    }
  
}

function flashFailure() {
  let flashCount = 5;
  let interval = setInterval(() => {
    for (let i = 0; i < circleSegments; i++) {
      push();
      rotate((TWO_PI / circleSegments) * i);
      fill(i % 2 === 0 ? 255 : 0, 0, 0);
      rect(radius, -10, 40, 20); 
      pop();
    }
    flashCount--;
    if (flashCount === 0) {
      clearInterval(interval);
    }
  }, 1000);
}
