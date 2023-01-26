let x = 200;
let y = 200;
let size = 50;
let dragging = false;

let dragStartX = -1;
let dragStartY = -1;
let characterStartX = -1;
let characterStartY = -1;
function setup() {
  createCanvas(850, 400);
}

function draw() {
  background(color(255, 204,0));

  fill(220);
  square(x,y,size);
  fill(0);
  circle(x+10, y+10, 10);
  circle(x+size-10, y+10, 10);
  stroke(0);
  line(x+size/4, y+size-15, x+size-size/4, y+size-15);

}
function mousePressed() {
  let insideX = mouseX >= x && mouseX <= x + size;
  let insideY = mouseY >= y && mouseY <= y + size;
  console.log("You're right!", insideX);
  let inside = insideX && insideY;

  if (inside) { 
    dragging = true;
    dragStartX = x;
    dragStartY = y;
  }
}
function mouseReleased() {
  dragging = false
}

function mouseDragged() {
  if (dragging) {
    x = characterStartX + (mouseX - dragStartX);
    y = characterStartY + (mouseY - dragStartY);
  }
}