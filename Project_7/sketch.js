let synth; // variable for the synth sound
let filter; // variable for the filter effect
let envelope; // variable for the amplitude envelope
let distortion; // variable for the distortion effect
let gain; // variable for the gain control

let blockImage; // variable for the image of the block

function preload() {
  backgroundImage = loadImage('./Minecraft Pickaxe.png');
  blockImage = loadImage('./png-transparent-break.png'); // load the block image
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  Tone.start(); // start the audio context

  // create the synth with a square wave oscillator
  synth = new Tone.Synth({
    oscillator: {
      type: 'sawtooth', // use a frequency modulated square wave oscillator
      modulationType: 'triangle', // set the modulation type to a triangle wave
      harmonicity: 0.5, // set the harmonicity to 0.5 for a more dissonant sound
      modulationIndex: 10 // set the modulation index to 10 for a more pronounced effect
    }
  });

  

  // create the gain control and set the volume to 20%
  gain = new Tone.Gain(0.2).toDestination();

  // create the filter effect with a lowpass filter
  filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 2000, // decrease the frequency to give more bass
    rolloff: -12,
    Q: 1,
    gain: 0
  }).toDestination();

  // create the amplitude envelope for the synth
  envelope = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.2,
    sustain: 0.01,
    release: 0.1
  }).connect(filter);

  // create the distortion effect with a bitcrusher
  distortion = new Tone.BitCrusher({
    bits: 4,
    wet: 1
  }).toDestination();

  // remove the button to trigger the sound effect
  // and instead start the sound on mouse press
  mousePressed = function() {
    triggerSound();
  };
}

function draw() {
  background(220);
  background(backgroundImage);

  // draw the block image when it's clicked
  if (mouseIsPressed) {
    image(blockImage, mouseX, mouseY);
  }
}

function triggerSound() {
  console.log('Sound triggered');
  // randomly set the frequency and resonance of the filter
  filter.frequency.value = random(500, 2000); // decrease the frequency range for more consistent bass sound
  filter.Q.value = random(1, 10);

  // randomly set the amount of distortion
  distortion.bits = random(2, 8);

  // connect the synth to the gain control, envelope, and distortion effect
  synth.connect(gain);
  gain.connect(envelope);
  envelope.connect(distortion);

  // trigger the synth with the envelope
  synth.triggerAttackRelease('C2', '1'); // use a lower note and longer duration for a deeper and more rumbling sound

  // stop the sound after 1 second
  setTimeout(function() {
    console.log('Sound stopped');
    synth.triggerRelease();
  }, 750);
}
