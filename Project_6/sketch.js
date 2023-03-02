function setup() {
  createCanvas(1200, 200);

  // create a new synthesizer with a sine wave oscillator
  synth = new Tone.Synth({
    oscillator: {
      type: 'sine'
    }
  });

  // create an envelope for the amplitude
  envelope = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.2,
    sustain: 1,
    release: 1
  }).connect(synth.volume);

  // create a filter to shape the sound
  filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 1000,
    rolloff: -24,
    Q: 1,
    gain: 4
  }).connect(envelope);

  // create a chorus effect to add grit to the sound
  const chorus = new Tone.Chorus({
    frequency: 1.5,
    delayTime: 1.5,
    depth: 1.7,
    feedback: 1,
    type: 'triangle',
    spread: 180,
    wet: 1
  });

  // connect the synth to the master output
  synth.toDestination();

  // create a keyboard layout for an octave of notes
  let keyboardLayout = [
    { note: 'C3', keyCode: 49 }, 
    { note: 'C#3', keyCode: 50 }, 
    { note: 'D3', keyCode: 51 }, 
    { note: 'D#3', keyCode: 52 }, 
    { note: 'E3', keyCode: 53 }, 
    { note: 'F3', keyCode: 54 }, 
    { note: 'F#3', keyCode: 55 }, 
    { note: 'G3', keyCode: 56 }, 
    { note: 'G#3', keyCode: 57 },
  ];

  // create a container element for the buttons
  buttonContainer = createDiv();
  buttonContainer.style('display', 'flex');
  buttonContainer.style('justify-content', 'center');
  buttonContainer.style('align-items', 'center');
  buttonContainer.style('height', '100px');
  buttonContainer.style('background-color', 'red');

  // create buttons for each note in the keyboard layout and add to the container element
  let buttonWidth = width / keyboardLayout.length;
  for (let i = 0; i < keyboardLayout.length; i++) {
    let note = keyboardLayout[i].note;
    let keyCode = keyboardLayout[i].keyCode;
    let button = createButton(note);
    button.size(buttonWidth, height);
    button.mousePressed(function () {
      // trigger the note when the button is clicked
      synth.triggerAttack(note);
    });
    button.mouseReleased(function () {
      // release the note when the button is released
      synth.triggerRelease();
    });

    // add button to the container element
    buttonContainer.child(button);

    // map the key press to the corresponding note in the keyboard layout
    let keyFunction = function (event) {
      if (keyCode === event.keyCode) {
        synth.triggerAttack(note);
      }
    };
    document.addEventListener('keydown', keyFunction);

    // map the key release to release the note
    let releaseFunction = function (event) {
      if (keyCode === event.keyCode) {
        synth.triggerRelease();
      }
    };
    document.addEventListener('keyup', releaseFunction);
  }

  // create a slider to control the amount of chorus
  distSlider = createSlider(0.002, 100, 20, 0.01);
  distSlider.position(20, height - 40);
  distSlider.input(function () {
    // set the amount of chorus based on the slider value
    chorus.feedback = distSlider.value();
  });

  // create an oscilloscope to visualize the audio waveform
  const scope = new Tone.Waveform();
  const scopeView = new Tone.Visualizer({
    element: '#oscilloscope',
    type: 'waveform',
    buffer: scope,
    width: width,
    height: height / 2,
    options: {
      fill: true,
      stroke: true,
      strokeWidth: 2,
      color: 'white'
    }
  }).toMaster();

  // connect the audio nodes to the scope
  synth.connect(chorus);
  chorus.connect(filter);
  filter.connect(envelope);
  envelope.connect(scope);

  // set up a loop to update the chorus amount based on the slider
  Tone.Transport.scheduleRepeat(function (time) {
    chorus.feedback = distSlider.value();
  }, '16n');

  // create a container element for the slider
  const sliderContainer = createDiv();
  sliderContainer.style('position', 'absolute');
  sliderContainer.style('bottom', '100px');
  sliderContainer.style('left', '90%');
  sliderContainer.style('transform', 'translateX(-50%)');


  // create a label for the slider
  const distLabel = createDiv('chorus Amount');
  distLabel.parent(sliderContainer);

  // add the slider to the container element
  distSlider.parent(sliderContainer);

  // create a toggle button to switch between lowpass and highpass filters
  const filterToggle = createButton('Toggle Filter');
  filterToggle.position(width - 110, height - 40);
  filterToggle.mousePressed(function () {
    if (filter.type === 'lowpass') {
      filter.type = 'highpass';
    } else {
      filter.type = 'lowpass';
    }
  });

  // create a button to randomize the filter parameters
  const filterRandomize = createButton('Randomize Filter');
  filterRandomize.position(width - 220, height - 40);
  filterRandomize.mousePressed(function () {
    filter.frequency.value = random(100, 1000);
    filter.Q.value = random(0.5, 10);
    filter.gain.value = random(-20, 20);
  });
}

function draw() {
  // draw the oscilloscope waveform
  scopeView.draw();
}

// connect the audio nodes to the effects and the master output
synth.connect(chorus);
chorus.connect(filter);
filter.connect(Tone.Master);

// update the chorus and chorus amount based on the sliders
Tone.Transport.scheduleRepeat(function (time) {
  chorus.wet.value = distSlider.value();
}, '16n');


// add the audio effects container to the page
audioEffects.parent(document.body);