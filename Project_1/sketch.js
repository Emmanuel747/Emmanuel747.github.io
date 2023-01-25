function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(200);
  
  // 1st Container
  fill(255); // set fill color to white
  let containerX1 = (windowWidth / 2) - (300 + 20); //calculate container x position, by subtracting the width of the container and some padding from the half of the window width
  let containerY1 = (windowHeight / 3) - 150; //calculate container y position, by subtracting the height of the container from the 1/3 of the window height
  rect(containerX1, containerY1, 300, 300); // draw a white rectangle container
  
  fill(color(255,170,169,190)); // set fill color to the HEX color 
  ellipse(containerX1 + 100, containerY1 + 80, 100, 100); // draw a red circle for the 1st set

  fill(color(167,255,167,190));
  ellipse(containerX1 + 145, containerY1 + 140, 100, 100); // draw a green circle for the 2nd set

  fill(color(170,168,255,190));
  ellipse(containerX1 + 80, containerY1 + 140, 100, 100); // draw a purple circle for the 3rd set
  
  // 2nd Container
  fill(0, 255, 0); // set fill color to green
  let containerX2 = (windowWidth / 2) + 20; //calculate container x position, by adding some padding to the half of the window width
  let containerY2 = (windowHeight / 3) - 30; //calculate container y position, by subtracting the height of the container from the 1/3 of the window height
  rect(containerX2, containerY2, 300, 120); // draw a green rectangle
  
  fill(255); // set fill color to white
  ellipse(containerX2 + 90, containerY2 + 60, 100, 100); // draw a white circle
  rect(containerX2 + 160, containerY2 + 10, 100, 100); // draw a white square
  


  // 3rd Container
  fill("#000081"); // set fill color to yellow
  let containerX3 = (windowWidth / 2) - (300 + 20);
  let containerY3 = (windowHeight / 3)*2 - 80;
  rect(containerX3, containerY3, 300, 300);

    // Draw the circle
    fill("green"); // set fill color to green
    stroke("white"); // set stroke color to white
    strokeWeight(5); // set stroke weight to 5
    let sizeOfCircle = 180;
    ellipse(containerX3 + 150, containerY3 + 150, sizeOfCircle, sizeOfCircle); // draw the circle
  
    // Draw the star
    fill("red"); // set fill color to red
    let sizeOfStar = 90;
    stroke("white"); // disable stroke
    push();
    translate(containerX3 + 150, containerY3 + 150);
    beginShape();
    for (let a = 1; a < TWO_PI; a += TWO_PI / 5) {
      let sx = cos(a) * sizeOfStar;
      let sy = sin(a) * sizeOfStar;
      vertex(sx, sy);
      sx = cos(a + PI / 5) * 30;
      sy = sin(a + PI / 5) * 30;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    pop();
  
    
  // 4th Container
  fill("black"); // set fill color to black
  let containerX4 = (windowWidth / 2 + 10);
  let containerY4 = (windowHeight / 3)*2 - 10;
  rect(containerX4, containerY4, 300, 120);

  noStroke(); // disable stroke

  // Translate the pac-man shape to the center of the container
  translate(containerX4 + 75, containerY4 + 60);
  
  // Rotate the pac-man shape backwards by 45 degrees
  rotate(radians(-47));
  
  // Draw pac-man shape
  fill("yellow"); // set fill color to yellow
  arc(0, 0, 50, 50, 225, 135);
 
  // Reset the transformation matrix
  resetMatrix();

  // second pac-man ghost
  fill("red"); // set fill color to red
  rect(containerX4 + 200, containerY4 + 50, 50, 25); // bottom half of pac-man ghost
  ellipse(containerX4 + 225, containerY4 + 48, 50, 50); // top half of pac-man ghost
  
  fill("white"); // set fill color to white
  ellipse(containerX4 + 215, containerY4 + 55, 15, 15); // pac-man ghost left eye
  ellipse(containerX4 + 235, containerY4 + 55, 15, 15); // pac-man ghost right eye
  
  fill("blue"); // set fill color to blue
  ellipse(containerX4 + 215, containerY4 + 55, 10, 10); // pac-man ghost left eye
  ellipse(containerX4 + 235, containerY4 + 55, 10, 10); // pac-man ghost right eye
  }