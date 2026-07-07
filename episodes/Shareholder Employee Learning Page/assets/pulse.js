
let ctx, osc, gain, lfo, lfoGain;
function startPulse(){
  const card = document.getElementById('audioCard');
  if(ctx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if(!AudioContext){ alert('Audio is not supported in this browser.'); return; }
  ctx = new AudioContext();
  gain = ctx.createGain();
  gain.gain.value = 0.035;
  osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 92;
  lfo = ctx.createOscillator();
  lfo.frequency.value = 2.2;
  lfoGain = ctx.createGain();
  lfoGain.gain.value = 18;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(); lfo.start();
  if(card) card.classList.add('playing');
}
function stopPulse(){
  const card = document.getElementById('audioCard');
  try { if(osc) osc.stop(); if(lfo) lfo.stop(); if(ctx) ctx.close(); } catch(e) {}
  ctx = osc = gain = lfo = lfoGain = null;
  if(card) card.classList.remove('playing');
}
window.addEventListener('DOMContentLoaded', () => {
  const play = document.getElementById('playBtn');
  const stop = document.getElementById('stopBtn');
  if(play) play.addEventListener('click', startPulse);
  if(stop) stop.addEventListener('click', stopPulse);
});
