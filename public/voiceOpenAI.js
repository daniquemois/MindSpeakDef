async function spreekTekstUit(tekst) {
    try {
        const response = await fetch('http://localhost:3000/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: tekst })
        });

        const data = await response.json();
        if (data.audioContent) {
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
            audio.play();
        } else {
            console.error('Failed to play the audio');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('spreekButton').addEventListener('click', () => {
    const tekst = document.getElementById('gekozenZin').value;
    spreekTekstUit(tekst);
});