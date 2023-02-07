let spriteWidth = 80;
let spriteHeight = 80;
let spriteFrames = 8; // Number of animation frames in the sprite sheet
let animationSpeed = 8; // Speed of the animation (frames to skip)

// Array to store all the Character objects
let spriteObjects = [];

// Load the sprite sheets into an array
function preload() {
  spriteSheets = [
    loadImage("./sprites/1-Spelunky_Round Boy.png"),
    loadImage("./sprites/2-Spelunky_Spelunky Guy.png"),
    loadImage("./sprites/3-Spelunky-Purple.png"),
    loadImage("./sprites/4-Spelunky-Jungle Warrior.png"),
  ];
}

// Main draw loop
function draw() {
  background('rgba(0,255,0, 0.25)');
  for (let i = 0; i < spriteObjects.length; i++) {
    spriteObjects[i].update();
    spriteObjects[i].display();
  }
}

// Setup the canvas and create the Character objects
function setup() {
  createCanvas(windowWidth/1.005, windowHeight/1.5);
  frameRate(30);

  for (let i = 0; i < 5; i++) {
    // Place the Character objects randomly on the canvas
    spriteObjects.push(new Character(spriteSheets[i % spriteSheets.length], random(width), random(height)));
  }
}

// Character class definition
class Character {
  constructor(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.currentFrame = 0;
    this.xSpeed = 2;
    this.facingRight = true;
    // this.moving = true; // check for if moving
  }

  update() {
    // Animate the character
    // if (this.moving) {
    this.currentFrame = (this.currentFrame + 1) % spriteFrames;
    if (keyIsDown(LEFT_ARROW)) {
      this.facingRight = false;
      this.xSpeed = -2;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.facingRight = true;
      this.xSpeed = 2;
    }
    this.x += this.xSpeed;

    // Stop the character at the canvas border
    if (this.x < 0) {
      this.x = 0;
      this.xSpeed = 0;
    } else if (this.x + spriteWidth > width) {
      this.x = width - spriteWidth;
      this.xSpeed = 0;
    }
  // }
  }

  display() {
    if (this.facingRight) {
      image(
        this.sprite,
        this.x,
        this.y,
        spriteWidth,
        spriteHeight,
        this.currentFrame * spriteWidth,
        0,
        spriteWidth,
        spriteHeight
      );
    } else {
      push();
      translate(this.x + spriteWidth, this.y);
      scale(-1, 1);
      image(
        this.sprite,
        0,
        0,
        spriteWidth,
        spriteHeight,
        this.currentFrame * spriteWidth,
        0,
        spriteWidth,
        spriteHeight
      );
      pop();
    }
  }
}

// Check if sprite is clicked, if so, stop or resume its movement
if (mouseIsPressed) {
  for (let i = 0; i < spriteObjects.length; i++) {
    let d = dist(mouseX, mouseY, spriteObjects[i].x, spriteObjects[i].y);
    if (d < spriteWidth / 2) {
      spriteObjects[i].moving = !spriteObjects[i].moving;
    }
  }
}