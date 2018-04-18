/*Inputs
- tempo
- play/stop
- pads (active/inactive)
*/

$("document").ready(function(){
  // GLOBAL VARIABLES ---------------------------
  const instruments = [
    'kick',
    'clap',
    'snare',
    'openHat',
    'closedHat'
  ];

  let transportOn = false;
  
  // BUILDERS ------------------------------------- 

  const buildDOMGrid = function(bars, resolution) {
    console.log('building grid');
    let stepsPerBeat = resolution / 4;
    let beats = bars * 4;

    let grid = $(".grid");
    instruments.forEach( instrument => {
      let instrumentDiv = $("<div></div>")
        .addClass('instrument-row')
        .data('instrument', instrument);
      instrumentDiv.append(`<label class="instrument-label">${instrument}</label>`)
      for(let i=1; i<=beats; i++) {
        let beatGroup = $("<div></div>").addClass('beat-group');
        for(let k=1; k<=stepsPerBeat; k++) {
          let pad = $(`<button>${i}</button>`)
            .addClass('btn btn-default pad')
            .data('step', k);          
          beatGroup.append(pad)
          instrumentDiv.append(beatGroup);
        }
      }
      grid.append(instrumentDiv);
    })
    // <div data-instrument="clap" class="instrument-row">
    //   <label class="instrument-label">Clap</label>
    //   <button data-step='1' class="btn btn-default pad step-1">1</button>
  };

  // ON PAGE LOAD -------------------------------
    const steps = buildStepsArray();
    buildDOMGrid(1, 16);  

  // EVENT HANDLERS -----------------------------
  $(".pad").click(function(){
    console.log($(this).data());
    let stepIndex = Number($(this).data().step)-1;
    let instrument = $(this).parent().data().instrument;
  	if(steps[stepIndex].instrument) {
      console.log(`deactivated ${instrument} pad on step ${stepIndex+1}`)
  	  deactivatePad(stepIndex, instrument);
    } else {
      console.log(`activated ${instrument} pad on step ${stepIndex+1}`)
      activatePad(stepIndex, instrument);
      let audio = new Audio(samples.kick);
      audio.play(); 
    }
  });

  $(".play").click(function(){
  	console.log('clicked the play button!')
    if(transportOn) {
	  deactivateTransport();
    } else {
	  activateTransport();
    }     
  });

  // OTHER FUNCTIONS ------------------------------   
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const activatePad = function(stepIndex, instrument) {
    steps[stepIndex].instrument = true;
    // illuminate pad
  };

  const deactivatePad = function(stepIndex, instrument) {
    steps[stepIndex].instrument = false;
  };

  const activateTransport = function() { // invoked with play button is clicked (or spacebar pressed)
    transportOn = true;
    playMusic();
    //flip 'play' button to 'stop'
    //activate 'music playing' animation
  };

  const deactivateTransport = function() { //invoked when stop button is clicked (or spacebar pressed)
    transportOn = false;
  };

  const playMusic = async function() {
    let counter = 0;
    while(transportOn) {
      console.log('beat');
      counter = counter > 17 ? 1 : counter + 1;
      //triggerStepSamples(steps[counter]);
      // triggerStepSamples(samples, ...activePads)
      await sleep(2000);
    }
  };

  const triggerStepSamples = function(samples, ...activePads) {
    // define activeSamples array
    // loop through activeInstruments (as keys in samples obj)
      // push samples to activeSamples
    //loop through active samples
      // new Audio('sounds/kick32.mp3').play();

  }

  const illuminatePad = function() {
  	
  }

  // DATA ---------------------------------------
  /*
  array that contains pad booleans and steps (active / inactive)
  const steps = [
    {kick: true, clap: false, snare: true, openHat: true, closeHat: false},
    {kick: false, clap: true, snare: false, openHat: false, closeHat: false},
    {kick: false, clap: false, snare: true, openHat: true, closeHat: false},
    {kick: flase, clap: false, snare: false, openHat: false, closeHat: true}....
  ]
  */
  function buildStepsArray(bars=1, resolution=16) {
    let numSteps = bars * resolution;
    let activePads = {};
    instruments.forEach(instrument => {
      activePads[instrument] = false;
    })
    return new Array(numSteps).fill(activePads);
  };  

  const samples = {
    kick: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_kick_04.wav',
    clap: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_clap.wav',
    snare: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_snare_04.wav'
  }

})