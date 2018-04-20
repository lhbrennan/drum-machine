/*Inputs
- tempo
- swing
- bars
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

  let resolution = 16;
  let bars = Number($("#num-bars").val());
  
  // BUILDERS ------------------------------------- 

  const buildDOMGrid = function(bars, resolution) {
    console.log(arguments);
    let stepsPerBeat = resolution / 4;
    let beats = bars * 4;

    let grid = $(".grid");
    grid.empty();
    instruments.forEach( instrument => {
      let instrumentDiv = $("<div></div>")
        .addClass('instrument-row')
        .data('instrument', instrument);
      instrumentDiv.append(`<label class="instrument-label">${instrument}</label>`)
      for(let i=1; i<=beats; i++) {
        let beatGroup = $("<div></div>").addClass('beat-group');
        for(let k=1; k<=stepsPerBeat; k++) {
          let stepNum = ((i-1)*4)+k
          let pad = $(`<button>${i}</button>`)
            .addClass('btn btn-default pad')
            .data('step', stepNum);          
          beatGroup.append(pad)
          instrumentDiv.append(beatGroup);
        }
      }
      grid.append(instrumentDiv);
    })
  };

  // ON PAGE LOAD -------------------------------
    let steps = buildStepsArray();
    console.log(steps);
    buildDOMGrid(bars, resolution);  

  // EVENT HANDLERS -----------------------------
  $(".pad").click(function(){
    let stepIndex = Number($(this).data().step)-1;
    let instrument = $(this).parent().parent().data().instrument;
  	if(steps[stepIndex][instrument]) {
      console.log(`deactivated ${instrument} pad on step ${stepIndex+1}`)
  	  deactivatePad(stepIndex, instrument);
      unilluminatePad($(this));
    } else {
      console.log(`activated ${instrument} pad on step ${stepIndex+1}`)
      activatePad(stepIndex, instrument);
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

  // OTHER FUNCTIONS ------------------------------   
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const activatePad = function(stepIndex, instrument) {
    // console.log('grid before\n', steps);
    // console.log('stepIndex:', stepIndex);
    // console.log('instrument:', instrument);
    steps[stepIndex][instrument] = true;
    // console.log('grid after\n', steps);
  };

  const deactivatePad = function(stepIndex, instrument) {
    // console.log('grid before\n', steps);
    // console.log('stepIndex:', stepIndex);
    // console.log('instrument:', instrument);
    steps[stepIndex][instrument] = false;
    // console.log('grid after\n', steps);
  };

  const activateTransport = button => {
    transportOn = true;
    let bpm = $('#bpm').val();
    let avgStepDuration = 60000 / ((bpm * resolution) / 4);
    playMusic(avgStepDuration);
    button.addClass('btn-danger').html('Stop');
    //activate 'music playing' animation
  };

  const deactivateTransport = function(button) {
    transportOn = false;
    button.removeClass('btn-danger').html('Play');
  };

  // const playMusic = async function(avgSleepDuration) {
  //   let swing = Number($("#swing").val());
  //   console.log(swing);
  //   let counter = 1;
  //   while(transportOn) {
  //     const activeInstruments = instruments
  //       .filter(instrument => steps[counter-1][instrument]);
  //     triggerStepSamples(activeInstruments);
  //     counter = counter > 15 ? 1 : counter + 1;
  //     let sleepDuration = counter % 2 === 0 ? avgSleepDuration * (1+(swing/10)) : avgSleepDuration * (1-(swing/10));
  //     await sleep(sleepDuration);
  //   }
  // };

  const playMusic = function(avgSleepDuration) {
    let swing = Number($("#swing").val());
    console.log(swing);
    let counter = 1;
    setInterval(function(){
      if(!transportOn) { 
        console.log('clearing interval!');
        clearInterval(); 
      }
      const activeInstruments = instruments
        .filter(instrument => steps[counter-1][instrument]);
      triggerStepSamples(activeInstruments);
      counter = counter > 15 ? 1 : counter + 1;
    }, avgSleepDuration)
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

  const illuminatePad = function(button) {
    button.addClass('btn-primary');
  };

  const unilluminatePad = function(button) {
    button.removeClass('btn-primary');
  };

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
    let arr = new Array(numSteps).fill('x');
    return arr.map($ => Object.assign({}, activePads));
  };  

  const samples = {
    kick: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_kick_04.wav',
    clap: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_clap.wav',
    snare: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_snare_04.wav',
    closedHat: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_closedhat_01.wav',
    openHat: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_openhat_02.wav'
  }

})