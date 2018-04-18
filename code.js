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
    // <div data-instrument="clap" class="instrument-row">
    //   <label class="instrument-label">Clap</label>
    //   <button data-step='1' class="btn btn-default pad step-1">1</button>
  };

  // ON PAGE LOAD -------------------------------
    let steps = buildStepsArray();
    console.log(steps);
    buildDOMGrid(1, 16);  

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
      new Audio(samples[instrument]).play();
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

  const activateTransport = function(button) { // invoked with play button is clicked (or spacebar pressed)
    transportOn = true;
    playMusic();
    button.addClass('btn-danger').html('Stop');
    //activate 'music playing' animation
  };

  const deactivateTransport = function(button) { //invoked when stop button is clicked (or spacebar pressed)
    transportOn = false;
    button.removeClass('btn-danger').html('Play');
  };

  const playMusic = async function() {
    let counter = 1;
    while(transportOn) {
      console.log('step ', counter);
      const activeInstruments = instruments.filter(instrument => steps[counter-1][instrument]);
      triggerStepSamples(activeInstruments);
      counter = counter > 16 ? 1 : counter + 1;
      await sleep(125);
    }
  };

  const triggerStepSamples = function(activeInstruments) {

    activeInstruments.forEach(instrument => {
      new Audio(samples[instrument]).play();
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
    return arr.map(x => Object.assign({}, activePads));
  };  

  const samples = {
    kick: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_kick_04.wav',
    clap: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_clap.wav',
    snare: 'samples/Sample_Magic_Roland_TR_909/SampleMagic_tr909_snare_04.wav'
  }

})