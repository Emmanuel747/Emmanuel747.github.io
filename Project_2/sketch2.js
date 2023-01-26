let characterOne;
let characterTwo;

function setup() {
  createCanvas(900, 400);
  characterOne = new Character(100, 100, 50);
  characterTwo = new Character(200, 150, 90);
}

function draw() {
  background(color(255, 204, 0));

  characterOne.draw();
  characterTwo.draw();

  characterOne.update();
  characterTwo.update();
}

class Character {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.dragging = false;

    this.dragStartX = -1;
    this.dragStartY = -1;
    this.characterStartX = -1;
    this.characterStartY = -1;
  }

  draw() {
    fill(color('hsla(160, 100%, 50%, 0.5)'));
    square(this.x, this.y, this.size);
    fill(0);
    circle(this.x + 10, this.y + 10, 10);
    circle(this.x + this.size - 10, this.y + 10, 10);
    stroke(0);
    line(this.x + this.size / 4, this.y + this.size - 15, this.x + this.size - this.size / 4, this.y + this.size - 15);
  }

  update() {
    this.handleMouseEvents();
  }

  handleMouseEvents() {
    if (mouseIsPressed) {
      if (this.isMouseInside()) {
        if (!this.dragging) {
          this.dragStartX = mouseX;
          this.dragStartY = mouseY;
          this.characterStartX = this.x;
          this.characterStartY = this.y;
        }
        this.dragging = true;
      }
    } else {
      this.dragging = false;
    }

    if (this.dragging) {
      this.x = this.characterStartX + (mouseX - this.dragStartX);
      this.y = this.characterStartY + (mouseY - this.dragStartY);
    }
  }

  isMouseInside() {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.size &&
      mouseY >= this.y &&
      mouseY <= this.y + this.size
    );
  }
}
