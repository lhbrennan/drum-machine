/*Inputs
- tempo
- play/stop
- pads (active/inactive)
*/



$("document").ready(function(){

  // Event Handlers
  $(".pad").click(function(){
  	console.log('clicked the pad!')
	// if pad is 'true' in steps
	  // deactivatePad();
	// else
	  // activateTransport();
	let audio = new Audio(samples.kick);
	audio.play();      
  })


  $(".play").click(function(){
  	console.log('clicked the play button!')
   //  if(transportOn) {
	  // deactivateTransport();
   //  } else {
	  // activateTransport;
    // }     
  })
  
/*
// transport clicked
  

*/

/*Functions

activatePad() {
  // update steps
  // illuminate pad
}

deactivatePad() {
	
}

activateTransport() { // invoked with play button is clicked (or spacebar pressed)
  transportOn = true;
  playMusic();
  //flip 'play' button to 'stop'
  //activate 'music playing' animation
}

deactivateTransport() { //invoked when stop button is clicked (or spacebar pressed)
  transportOn = false;
}

playMusic() {
  while(transportOn)
  // loop through steps
    // triggerStepSamples(samples, ...activePads)
    // delay(milliseconds)
}

triggerStepSamples(samples, ...activePads) {
  // define activeSamples array
  // loop through activeInstruments (as keys in samples obj)
    // push samples to activeSamples
  //loop through active samples
    // new Audio('sounds/kick32.mp3').play();

}

illuminatePad() {
	
}
*/

/*Data
- array that contains pad booleans and steps (active / inactive)
const steps = [
  {kick: true, clap: false, snare: true, openHat: true, closeHat: false},
  {kick: false, clap: true, snare: false, openHat: false, closeHat: false},
  {kick: false, clap: false, snare: true, openHat: true, closeHat: false},
  {kick: flase, clap: false, snare: false, openHat: false, closeHat: true}....
]
*/

const samples = {
  kick: 'samples/SampleMagic_tr909_kick_04.wav'
  //clap: ....
}


})