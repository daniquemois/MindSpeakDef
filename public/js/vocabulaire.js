document.addEventListener('DOMContentLoaded', async () => {
    const spreekButton = document.getElementById('spreek');
    const outputDiv = document.getElementById('output');
    const ttsAudio = document.createElement('audio'); // Maak een audio-element aan

    let selectedVoice = localStorage.getItem('selectedVoice') || 'nova'; // Haal de geselecteerde stem op, of gebruik 'nova' als standaard

    // Haal de configuratie op van de server
    let config;
    try {
        const response = await fetch('/api/config');
        config = await response.json();
    } catch (error) {
        console.error('Error fetching configuration:', error);
        alert('Kon de configuratie niet ophalen. Controleer de serverinstellingen.');
        return;
    }

    const apiUrl = config.API_URL;

    // Helper functie om base64 naar een Blob om te zetten
    function base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mimeType });
    }

    // Functie om tekst uit te spreken
    async function speakText(text, voice) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    voice,
                    language: 'nl'
                }), // Gebruik de geselecteerde stem en stel de taal in op Nederlands
            });

            if (response.ok) {
                const { audioContent, mimeType } = await response.json(); // Ontvang de audio en mimeType
                console.log('Received MIME type:', mimeType); // Controleer het MIME-type

                const audioBlob = base64ToBlob(audioContent, mimeType); // Converteer de base64-string naar een Blob
                const audioUrl = URL.createObjectURL(audioBlob); // Maak een URL voor de ontvangen audio

                ttsAudio.src = audioUrl; // Stel de audio bron in

                ttsAudio.addEventListener('error', function (e) {
                    console.error('Audio error:', e);
                    alert('Kan de audio niet afspelen. Het audiobestand is mogelijk niet correct.');
                });

                try {
                    await ttsAudio.play(); // Probeer de audio af te spelen
                } catch (playError) {
                    console.error('Error during audio playback:', playError);
                    alert('Kan de audio niet afspelen.');
                }
            } else {
                console.error('TTS API error:', response.statusText);
                alert('Er is een fout opgetreden bij het genereren van de spraak.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Er is een fout opgetreden. Controleer de console voor details.');
        }
    }

    // Event listener voor de spreekknop
    if (spreekButton && outputDiv) {
        spreekButton.addEventListener('click', () => {
            const textToSpeak = Array.from(outputDiv.children)
                .map(child => child.innerText)
                .join(' ');

            if (!textToSpeak) {
                alert('Geen tekst om uit te spreken.');
                return;
            }

            speakText(textToSpeak, selectedVoice); // Spreek de samengestelde tekst uit met de geselecteerde stem
        });
    }

    // Event listener voor de foutje-knop
    const foutjeButton = document.getElementById('foutje');
    if (foutjeButton) {
        foutjeButton.addEventListener('click', () => {
            if (outputDiv && outputDiv.lastChild) {
                outputDiv.removeChild(outputDiv.lastChild);
            }
        });
    }

    // Event listener voor de zinsbalk leeg-knop
    const zinsbalkLeegButton = document.getElementById('zinsbalkleeg');
    if (zinsbalkLeegButton) {
        zinsbalkLeegButton.addEventListener('click', () => {
            if (outputDiv) {
                outputDiv.innerHTML = ''; // Leeg de hele inhoud van de output div
                document.cookie = 'zin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'; // Verwijder de cookie
            }
        });
    }
});