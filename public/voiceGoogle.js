// Functie om de tekst in het invoerveld uit te spreken
function spreekTekstUit(tekst) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(tekst);

        // Zoek naar een Nederlandse stem
        const voices = synth.getVoices();
        const dutchVoice = voices.find(voice =>
            voice.lang.includes('nl-NL')
        ) || voices[0]; // Valt terug op de eerste beschikbare stem als geen match is gevonden

        utterance.voice = dutchVoice;
        utterance.pitch = 2; // Toonhoogte
        utterance.rate = 0.5; // Snelheid

        synth.speak(utterance);
    } else {
        console.error('SpeechSynthesis is not supported in this browser.');
    }
}

// Event listener om de tekst uit te spreken wanneer er op de knop wordt geklikt
document.getElementById('spreekButton').addEventListener('click', () => {
    const tekst = document.getElementById('gekozenZin').value;
    spreekTekstUit(tekst);
});