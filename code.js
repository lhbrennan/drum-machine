// const samples = require('./samples.js')
// const examples = require('./examples.js');

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
  let resolution = 16;
  let bars = Number($("#num-bars").val());
  let activeStep = null;
  
  // BUILDERS ------------------------------------- 

  const buildDOMGrid = function(bars, resolution) {
    let stepsPerBeat = resolution / 4;
    let beats = bars * 4;
    let grid = $(".grid");

    grid.empty();
    
    // create instrument rows
    instruments.forEach( instrument => {
      let instrumentDiv = $("<div></div>")
        .addClass('instrument-row')
        .data('instrument', instrument);
      // add labels to each instrument row
      instrumentDiv.append(`<label class="instrument-label">${instrument}</label>`)
      // add beat groups to each instrument row
      for(let i=1; i<=beats; i++) {
        let beatGroup = $("<div></div>").addClass('beat-group');
        // add steps to each beat group
        for(let k=1; k<=stepsPerBeat; k++) {
          let stepNum = ((i-1)*4)+k
          let pad = $(`<button>${i}</button>`)
            .addClass('btn btn-default pad')
            .data('step', stepNum)
            .data('activated', false);          
          beatGroup.append(pad)
          instrumentDiv.append(beatGroup);
        }
      }
      grid.append(instrumentDiv);
    })
  };

  function buildStepsArray(bars=1, resolution=16) {
    let numSteps = bars * resolution;
    let activePads = {};
    instruments.forEach(instrument => {
      activePads[instrument] = false;
    })
    let arr = new Array(numSteps).fill('x');
    return arr.map($ => Object.assign({}, activePads));
  }; 

  // ON PAGE LOAD -------------------------------
    let steps = buildStepsArray();
    buildDOMGrid(bars, resolution);  

  // EVENT HANDLERS -----------------------------
  $(".pad").click(function(){
    let stepIndex = Number($(this).data().step)-1;
    let instrument = $(this).parent().parent().data().instrument;
  	if(steps[stepIndex][instrument]) {
      console.log(`deactivated ${instrument} pad on step ${stepIndex+1}`)
  	  deactivateStep(stepIndex, instrument);
      unilluminatePad($(this));
    } else {
      console.log(`activated ${instrument} pad on step ${stepIndex+1}`)
      activateStep(stepIndex, instrument);
      illuminatePad($(this));
      if(!transportOn) {
        new Audio(samples[instrument]).play();  
      }
    }
  });

  $(".play").click(function(){
    if(transportOn) {
    console.log('clicked the stop button!')      
	  deactivateTransport($(this));
    } else {
    console.log('clicked the play button!')      
	  activateTransport($(this));
    }     
  });

  $(".bars-button").click(function(){
    const numBars = Number($("#num-bars").val());
    buildDOMGrid(numBars, resolution);
  });

  $(".reset-button").click(resetPattern);

  $(".example").click(function(){
    deactivateTransport();
    const exampleName = $(this).data().example;
    console.log(`clicked example ${exampleName}`);
    const song = examples[exampleName];
    loadSavedSong(song);
  });

  // PAD FUNCTIONS --------------------------------
  const activateStep = function(stepIndex, instrument) {
    steps[stepIndex][instrument] = true;
  }; 

  const deactivateStep = function(stepIndex, instrument) {
    steps[stepIndex][instrument] = false;
  };

  const illuminatePad = function(button) {
    button.data().activated = true;
    button.removeClass('btn-default');
    button.addClass('btn-primary');
  };

  const unilluminatePad = function(button) {
    button.data().activated = false;
    button.addClass('btn-default')
    button.removeClass('btn-primary');
  };

  const illuminateAllActivePads = function(steps) {
    steps.forEach(step => {
      for(let keys in step) {
        if(step[key]) {
          //get button
            //let button = $(".instrument-row")
          illuminatePad(button);
        }
      }
    });
  };

  // PLAYBACK FUNCTIONS -------------------------   
  const activateTransport = button => {
    transportOn = true;
    const bpm = $('#bpm').val();
    const avgStepDuration = 60000 / ((bpm * resolution) / 4);
    playMusic(avgStepDuration);
    button.addClass('btn-danger').html('Stop');
    //activate 'music playing' animation
  };

  const deactivateTransport = function(button) {
    transportOn = false;
    button.removeClass('btn-danger').html('Play');
  };

  const triggerStepSamples = function(activeInstruments) {
    activeInstruments.forEach(instrument => {
      let audio = new Audio(samples[instrument]);
      if(instrument === 'openHat' || instrument === 'closedHat') {
        audio.volume -= .45;
      }
      audio.play();
    })
  };

  // const loopThroughSteps = function(startingCounter, avgSleepDuration){
  //   let counter = startingCounter;
  //   let interval = setInterval(function(){
  //     if(!transportOn) { clearInterval(interval); }
  //     const activeInstruments = instruments.filter(instrument => steps[counter-1][instrument]);
  //     triggerStepSamples(activeInstruments);
  //     counter = counter > 14 ? startingCounter : counter + 2;
  //   }, avgSleepDuration*2)
  // };

  // const playMusic = function(avgSleepDuration) {
  //   let swing = Number($("#swing").val());
  //   let swingDelay = avgSleepDuration * (1 + (swing / 10));
  //   console.log('avgSleepDuration: ', avgSleepDuration);
  //   console.log('swingDelay: ', swingDelay);
  //   loopThroughSteps(1, avgSleepDuration);
  //   setTimeout(loopThroughSteps(2, avgSleepDuration), swingDelay);
  // }; 

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const playMusic = async function(avgSleepDuration) {
    let swing = Number($("#swing").val());
    let counter = 1;
    while(transportOn) {
      const activeInstruments = instruments
        .filter(instrument => steps[counter-1][instrument]);
      triggerStepSamples(activeInstruments);
      counter = counter > 15 ? 1 : counter + 1;
      let sleepDuration = counter % 2 === 0 ? avgSleepDuration * (1+(swing/10)) : avgSleepDuration * (1-(swing/10));
      await sleep(sleepDuration);
    }
  };

  // const playMusic = function(avgSleepDuration) {
  //   let swing = Number($("#swing").val());
  //   let counter = 1;

  //   let interval = setInterval(function(){
  //     if(!transportOn) { 
  //       console.log('clearing interval!');
  //       clearInterval(interval); 
  //     }
  //     const activeInstruments = instruments
  //       .filter(instrument => steps[counter-1][instrument]);
  //     triggerStepSamples(activeInstruments);
  //     counter = counter > 15 ? 1 : counter + 1;
  //   }, avgSleepDuration)

  // };

  // OTHER FUNCTIONS ---------------------------- 
  function resetPattern() {
    steps = buildStepsArray();
    // let pads = $(".beat-group").children();
    // console.log('pads ', pads);
    $('.pad').each(function() {
      if($(this).data().activated) {
        unilluminatePad($(this));
      }
    })
  };

  const loadSavedSong = function(song) {
    resetPattern();
    steps = song.steps;
    $("#swing").val(song.swing)
    $("#bpm").val(song.bpm);
    $("#bars").val(song.bars);
    // illuminateAllActivePads();
  }

  const illuminateActiveBeatGroup = function() {

  }

})
// SAMPLES --------------------------------------
const samples = {
  kick: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_kick_04.wav',
  clap: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_clap.wav',
  snare: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_snare_04.wav',
  closedHat: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_closedhat_01.wav',
  openHat: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_openhat_02.wav'
};

// EXAMPLES --------------------------------------
const examples = {
  one: {
    steps: [
      {kick: true, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: true},
      {kick: false, clap: false, snare: false, openHat: true, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: true, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: true, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: true, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: true},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: true, openHat: false, closedHat: true}
    ],
    bpm: 125,
    swing: 3,
    bars: 1
  },
  two: {
    steps: [
      {kick: true, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: true},
      {kick: false, clap: false, snare: false, openHat: true, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: true, snare: true, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: true, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: true, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: true, snare: true, openHat: false, closedHat: true},
      {kick: true, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: true, closedHat: false},
      {kick: false, clap: false, snare: true, openHat: false, closedHat: false}
    ],
    bpm: 125,
    swing: 3,
    bars: 1
  },
  three: {
    steps: [
      {kick: true, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: false, snare: true, openHat: false, closedHat: true},
      {kick: true, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: true, snare: true, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: true, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: false, snare: false, openHat: true, closedHat: false},
      {kick: false, clap: false, snare: true, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: true, clap: true, snare: true, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false},
      {kick: false, clap: false, snare: false, openHat: false, closedHat: false}
    ],
    bpm: 110,
    swing: 2,
    bars: 1
  }
}
