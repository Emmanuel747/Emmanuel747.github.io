let soundByte;
let button1, button2, button3, button4;
let reverb, filter, slider;

function preload() {
  // Load MP3 files from the "Sounds" directory
  soundByte = new p5.SoundFile("./Sounds/Aughhhh Sound Effect - 320.mp3");
  soundByte2 = new p5.SoundFile("./Sounds/Chill-Nahhh.mp3");
  soundByte3 = new p5.SoundFile("./Sounds/Andriod-Phone.mp3");
  soundByte4 = new p5.SoundFile("./Sounds/YOU NEED TO LEAVE Sound Effect - 320.mp3");
  soundByte5 = new p5.SoundFile("./Sounds/Hot-Boy-Beat.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight-60);
  let btnHeight = 370;

  // Create buttons to trigger each sample
  button1 = createButton("Meme Sound 1");
  button1.class("sound-button");
  button1.position( width/2-350, height/2);
  button1.mousePressed(function() {
    soundByte.play();
  });

  button2 = createButton("Meme Sound 2");
  button2.class("sound-button");
  button2.position( width/2-230, height/2);
  button2.mousePressed(function() {
    soundByte2.play();
  });

  button3 = createButton("Meme Sound 3");
  button3.class("sound-button");
  button3.position( width/2-110, height/2);
  button3.mousePressed(function() {
    soundByte3.play();
  });

  button4 = createButton("Meme Sound 4");
  button4.class("sound-button");
  button4.position( width/2+10, height/2);
  button4.mousePressed(function() {
    soundByte4.play();
  });

  button5 = createButton("Meme Sound Instrumental");
  button5.class("sound-button");
  button5.position( width/2+130, height/2);
  button5.mousePressed(function() {
    soundByte5.play();
  });

  // Create a button to stop all sounds
  buttonStop = createButton("Stop All Sounds");
  buttonStop.class('stop-button');
  buttonStop.position(width / 2 - 60, height / 2 + 50);
  buttonStop.mousePressed(function () {
    soundByte.stop();
    soundByte2.stop();
    soundByte3.stop();
    soundByte4.stop();
    soundByte5.stop();
  });

  // Create a volume slider button
  slider = createSlider(0, 1, 0.3, 0.01);
  slider.class("slider");
  slider.position(width / 2 - 130, height / 2 + 110);
  slider.input(function () {
    soundByte.setVolume(slider.value());
    soundByte2.setVolume(slider.value());
    soundByte3.setVolume(slider.value());
    soundByte4.setVolume(slider.value());
    soundByte5.setVolume(slider.value());
  });

  // Create a reverb effect and set its parameters
  reverb = new p5.Reverb();
  reverb.set(3, 2);

  // Create a low-pass filter and set its frequency
  filter = new p5.LowPass();
  filter.set(2000);
  
  // Connect the soundByte to the effects and then to the master output
  soundByte.disconnect();
  soundByte.connect(filter);
  filter.connect(reverb);
  reverb.connect();
  
  soundByte2.disconnect();
  soundByte2.connect(filter);
  filter.connect(reverb);
  reverb.connect();
  
  soundByte3.disconnect();
  soundByte3.connect(filter);
  filter.connect(reverb);
  reverb.connect();
  
  soundByte4.disconnect();
  soundByte4.connect(filter);
  filter.connect(reverb);
  reverb.connect();
}

function draw() {
  background(220);
  textAlign(CENTER);
  textSize(24);
  text("Please don't sue me, just using sounds as a learning experience", width/2, height/2);
}
