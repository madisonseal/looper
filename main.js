import Timer from './timer.js'
document.addEventListener("DOMContentLoaded", () => {
const mic_btn = document.querySelector('#mic');
const playback = document.querySelector('.playback');
mic_btn.addEventListener('click', toggleMic);
const metro_start = document.querySelector('#metronome-start');
const metro_stop = document.querySelector('#metronome-stop');
const bpm_input = document.querySelector("#bpm");
const bpm_label = document.querySelector("#bpm-label");
const beatPerMeasureInput = document.querySelector("#beatsPerMeasure");
const beatPerMeasureLabel = document.querySelector("#beatsPerMeasureLabel")

let bpm = parseInt(bpm_input.value);
let beatPerMeasure = parseInt(beatPerMeasureInput.value);

bpm_label.textContent = `BPM ${bpm}`;
beatPerMeasureLabel.textContent = `Beats per Measure: ${beatPerMeasure}`;
const vol_input = document.querySelector("#volume");

document.querySelector('#time-sig').addEventListener('change', (e) => {
    const timeSignature = e.target.value;
    
    let bpm = e.target.selectedOptions[0].getAttribute('data-bpm');
    
    const [numerator, denominator] = timeSignature.split('/').map(Number);
    
    beatPerMeasure = numerator;
    beatPerMeasureLabel.textContent = `Beats per Measure: ${beatPerMeasure}`;


    bpm = parseInt(bpm);  
    bpm_label.textContent = `BPM: ${bpm}`;

  
    bpm_input.value = bpm;  

    count = 0;


    if (metronome) {
        metronome.stop();
        metronome = new Timer(playClick, 60000 / bpm, {immediate: true});
        metronome.start();
    }
});



let can_record = false;
let is_recording = false;   
let recorder = null;
let chunks = [];



// bpm 

// let beatPerMeasure = 4;
let count = 0;

// clicks 
const click1 = new Audio("click1.mp3");
const click2 = new Audio("click2.mp3");

// metronome 
let metronome;
const metronome_dot = document.querySelector('#metronome_dot');




function setUpAudio() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            audio: true
        })
        .then(setUpStream)
        .catch(err => {
            console.log(err)
        });
    }
}


setUpAudio();

function setUpStream(stream) {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        chunks.push(e.data);
    }

    recorder.onstop = e => {
        const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        playback.src = audioURL;
        playback.loop = true;
        playback.play();

        }
        can_record = true;
}

function toggleMic() {
    if (!can_record) {
        return;
    }

    is_recording = !is_recording;

    if (is_recording) {
        recorder.start();
        mic_btn.style.backgroundColor = 'red';
        
    } else {
        recorder.stop();
        mic_btn.style.backgroundColor = "#1db954"; 
    }  
}

function playClick() {
    console.log("Count:", count);

    if (count === 0) {
        metronome_dot.classList.add('active')
        metronome_dot.classList.add('pulse')
        click1.currentTime = 0;
        click1.play();
        
    } else {
        metronome_dot.classList.remove('active')
        metronome_dot.classList.remove('pulse')
        click2.currentTime = 0;
        click2.play();
    }

    count++;

    if (count >= beatPerMeasure) {
        count = 0;
    }
}






function startMetronome() {
    if (!metronome) {
    metronome = new Timer(playClick, 60000 / bpm, {immediate: true});
    metronome.start();
    }
}

function stopMetroNome() {
    if (metronome){
        metronome.stop();
        metronome = null;
    }
}

vol_input.addEventListener('input', (e) => {
    const volume = e.target.value;
    click1.volume = volume;
    click2.volume = volume;


});

bpm_input.addEventListener('input',(e) => {
    bpm = parseInt(e.target.value);
    bpm_label.textContent = `BPM: ${bpm}`;
    
    if (metronome) {
        metronome.stop();
        metronome = new Timer(playClick, 60000/ bpm, {immediate: true});
        metronome.start();
    }
});

beatPerMeasureInput.addEventListener('input', (e) => {
    beatPerMeasure = parseInt(e.target.value);
    beatPerMeasureLabel.textContent = `Beats per Measure: ${beatPerMeasure}`;

})

metro_start.addEventListener('click', startMetronome);

metro_start.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        metro_start.click(); 
    }
});
metro_stop.addEventListener('click', stopMetroNome);

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        if (can_record) {
            toggleMic();
        }
        event.preventDefault();
    }
});

setUpAudio();

});





