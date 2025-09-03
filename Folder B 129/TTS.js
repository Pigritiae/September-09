document.addEventListener('DOMContentLoaded', () => {
    const textToSpeakInput = document.getElementById('text-to-speak');
    const voiceSelect = document.getElementById('voice-select');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValueSpan = document.getElementById('volume-value');
    const pitchSlider = document.getElementById('pitch-slider');
    const pitchValueSpan = document.getElementById('pitch-value');
    const rateSlider = document.getElementById('rate-slider');
    const rateValueSpan = document.getElementById('rate-value');
    const speakBtn = document.getElementById('speak-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const stopBtn = document.getElementById('stop-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    const synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance();
    let voices = [];

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }
    
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function populateVoiceList() {
        voices = synth.getVoices().sort((a, b) => {
            const aname = a.name.toUpperCase();
            const bname = b.name.toUpperCase();
            if (aname < bname) return -1;
            if (aname === bname) return 0;
            return 1;
        });

        voiceSelect.innerHTML = '';

        if (voices.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No Voice Available';
            voiceSelect.appendChild(option);
            speakBtn.disabled = true;
            showMessage('No Speech Voice found in your Browser. Please verify the Settings of your Browser.');
            return;
        }

        voices.forEach((voice) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.name;
            option.dataset.lang = voice.lang;
            option.dataset.name = voice.name;
            voiceSelect.appendChild(option);
        });

        const portugueseVoice = voices.find(voice => voice.lang === 'pt-BR');
        if (portugueseVoice) {
            utterance.voice = portugueseVoice;
            voiceSelect.value = portugueseVoice.name;
        } else if (voices.length > 0) {
            utterance.voice = voices[0];
            voiceSelect.value = voices[0].name;
        }

        speakBtn.disabled = false;
    }

    function speakText() {
        if (synth.speaking) {
            showMessage("I'm already Speaking. Please wait for my Speech to end before Requesting a New one.");
            return;
        }
        const text = textToSpeakInput.value.trim();
        if (text === '') {
            showMessage('Please Type some Text for me to Speak.');
            return;
        }
        if (voices.length === 0) {
            showMessage('No Voice Available to Speak.');
            return;
        }
        utterance.text = text;
        utterance.volume = parseFloat(volumeSlider.value);
        utterance.pitch = parseFloat(pitchSlider.value);
        utterance.rate = parseFloat(rateSlider.value);

        const selectedVoiceName = voiceSelect.value;
        const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            showMessage('Selected Voice not Found. Using Standard Voice.');
            utterance.voice = voices[0];
        }
        synth.speak(utterance);
    }

    function pauseSpeech() {
        if (synth.speaking && !synth.paused) {
            synth.pause();
            updateButtonsStates(true, true);
        } else if (synth.paused) {
            showMessage('The Speech is Already Paused.');
        } else {
            showMessage('No Speech Active to Pause.');
        }
    }

    function resumeSpeech() {
        if (synth.paused) {
            synth.resume();
            updateButtonsStates(true);
        } else if (synth.speaking) {
            showMessage('The Speech is Already Active.');
        } else {
            showMessage('No Speech Paused to Resume.');
        }
    }

    function stopSpeech() {
        if (synth.speaking || synth.paused) {
            synth.cancel();
            updateButtonsStates(false);
        } else {
            showMessage('No Speech Active to Stop.');
        }
    }

    function updateButtonsStates(speaking, paused = false) {
        speakBtn.disabled = speaking;
        pauseBtn.disabled = !speaking || paused;
        resumeBtn.disabled = !paused;
        stopBtn.disabled = !speaking && !paused;
    }

    synth.addEventListener('voiceschanged', populateVoiceList);

    voiceSelect.addEventListener('change', () => {
        const selectedVoiceName = voiceSelect.value;
        utterance.voice = voices.find(voice => voice.name === selectedVoiceName);
    });

    volumeSlider.addEventListener('input', (e) => {
        utterance.volume = parseFloat(e.target.value);
        volumeValueSpan.textContent = `${Math.round(e.target.value * 100)}%`;
    });

    pitchSlider.addEventListener('input', (e) => {
        utterance.pitch = parseFloat(e.target.value);
        pitchValueSpan.textContent = e.target.value;
    });

    rateSlider.addEventListener('input', (e) => {
        utterance.rate = parseFloat(e.target.value);
        rateValueSpan.textContent = e.target.value;
    });

    speakBtn.addEventListener('click', speakText);
    pauseBtn.addEventListener('click', pauseSpeech);
    resumeBtn.addEventListener('click', resumeSpeech);
    stopBtn.addEventListener('click', stopSpeech);

    utterance.onstart = () => updateButtonsStates(true);
    utterance.onend = () => updateButtonsStates(false);
    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        showMessage(`Error at Speech: ${event.error}`);
        updateButtonsStates(false);
    };

    closeMessageBtn.addEventListener('click', hideMessage);

    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    populateVoiceList();
    updateButtonsStates(false);
});