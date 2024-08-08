document.addEventListener('DOMContentLoaded', () => {
    const spreekButton = document.getElementById('spreek');
    const outputDiv = document.getElementById('output');
    const ttsAudio = document.createElement('audio'); // Maak een audio-element aan om de gegenereerde spraak af te spelen

    if (spreekButton && outputDiv) {
        spreekButton.addEventListener('click', async () => {
            const textToSpeak = Array.from(outputDiv.children).map(child => child.innerText).join(' ');

            if (!textToSpeak) {
                alert('Geen tekst om uit te spreken.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/tts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: textToSpeak }),
                });

                if (response.ok) {
                    const audioBlob = await response.blob(); // Verwerk de binaire respons als een Blob
                    const audioUrl = URL.createObjectURL(audioBlob);
                    ttsAudio.src = audioUrl;
                    ttsAudio.play();
                } else {
                    alert('Er is een fout opgetreden bij het genereren van de spraak.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Er is een fout opgetreden. Controleer de console voor details.');
            }
        });
    }
    const foutjeButton = document.getElementById('foutje');
    if (foutjeButton) {
        foutjeButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (outputDiv && outputDiv.lastChild) {
                outputDiv.removeChild(outputDiv.lastChild);
            }
        });
    }

    const zinsbalkLeegButton = document.getElementById('zinsbalkleeg');
    if (zinsbalkLeegButton) {
        zinsbalkLeegButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (outputDiv) {
                outputDiv.innerHTML = ''; // Leeg de hele inhoud van de output div
            }
        });
    }
});
