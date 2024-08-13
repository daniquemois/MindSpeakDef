document.addEventListener('DOMContentLoaded', async () => {
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

    function clearTiles() {
        const tiles = document.querySelectorAll('.dy');
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.className = 'dy';
            tile.removeAttribute('style');
            const newTile = tile.cloneNode(true);
            tile.replaceWith(newTile);
        });
    }

    function fillTiles(items) {
        clearTiles();

        const tiles = document.querySelectorAll('.dy');
        items.forEach((item, index) => {
            if (index < tiles.length) {
                const tile = tiles[index];
                tile.innerText = item.label;
                tile.classList.add(item.className || 'item-button');
                tile.addEventListener('click', () => {
                    if (item.themeClass !== undefined) {
                        document.body.className = '';
                        if (item.themeClass) {
                            document.body.classList.add(item.themeClass);
                        }
                        localStorage.setItem('selectedTheme', item.themeClass || '');
                    } else if (item.fontFamily) {
                        document.querySelectorAll('*').forEach(element => {
                            element.style.fontFamily = item.fontFamily;
                            element.style.fontWeight = item.fontWeight;
                        });
                        localStorage.setItem('selectedFont', item.fontFamily);
                        localStorage.setItem('selectedFontWeight', item.fontWeight);
                    } else if (item.voiceName) {
                        localStorage.setItem('selectedVoice', item.voiceName);
                        speakLabel(item.label); // Spreek het label uit wanneer de stemknop wordt ingedrukt
                    } else if (item.keyboardLayout) {
                        localStorage.setItem('selectedKeyboardLayout', item.keyboardLayout);
                    }
                });
            }
        });
    }

    function speakLabel(text) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text, voice: localStorage.getItem('selectedVoice') || 'nova' })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(`TTS request failed: ${text}`); });
                }
                return response.json();
            })
            .then(data => {
                console.log('TTS response:', data);
                const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            })
            .catch(error => {
                console.error('Error during TTS request:', error);
            });
    }

    function loadColorThemes() {
        const colorThemes = [
            { label: 'Standaard', themeClass: '' },
            { label: 'Pastel', themeClass: 'theme-pastel' },
            { label: 'High Contrast', themeClass: 'theme-contrast' },
            { label: 'Dark Mode', themeClass: 'theme-dark' }
        ];

        fillTiles(colorThemes);
    }

    function loadFonts() {
        const fonts = [
            { label: 'Standaard', fontFamily: 'ITC Avant Garde Gothic, sans-serif', fontWeight: 'normal' },
            { label: 'Arial', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' },
            { label: 'Times New Roman', fontFamily: '"Times New Roman", serif', fontWeight: 'bold' },
            { label: 'Courier New', fontFamily: '"Courier New", monospace', fontWeight: 'bold' },
            { label: 'Georgia', fontFamily: 'Georgia, serif', fontWeight: 'bold' },
            { label: 'Comic Sans MS', fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold' }
        ];

        fillTiles(fonts);
    }

    function loadVoices() {
        const voices = [
            { label: 'Zilver', voiceName: 'alloy' },
            { label: 'Ster', voiceName: 'nova' },
            { label: 'Glitter', voiceName: 'shimmer' },
            { label: 'Echo', voiceName: 'echo' },
            { label: 'Kristal', voiceName: 'onyx' },
            { label: 'Sprookje', voiceName: 'fable' }
        ];

        fillTiles(voices);
    }

    function loadKeyboardLayouts() {
        const layouts = [
            { label: 'QWERTY', keyboardLayout: 'qwerty' },
            { label: 'AZERTY', keyboardLayout: 'azerty' },
            { label: 'ABC', keyboardLayout: 'abc' }
        ];

        fillTiles(layouts);
    }

    // Event listeners voor knoppen
    const kleurenButton = document.getElementById('kleuren');
    if (kleurenButton) {
        kleurenButton.addEventListener('click', () => {
            loadColorThemes();
        });
    }

    const lettertypeButton = document.getElementById('lettertype');
    if (lettertypeButton) {
        lettertypeButton.addEventListener('click', () => {
            loadFonts();
        });
    }

    const stemButton = document.getElementById('av3');
    if (stemButton) {
        stemButton.addEventListener('click', () => {
            loadVoices();
        });
    }

    const toetsenbordButton = document.getElementById('toetsenbord');
    if (toetsenbordButton) {
        toetsenbordButton.addEventListener('click', () => {
            loadKeyboardLayouts();
        });
    }

    // Toepassen van opgeslagen instellingen bij het laden van de pagina
    const storedTheme = localStorage.getItem('selectedTheme');
    const storedFont = localStorage.getItem('selectedFont');
    const storedFontWeight = localStorage.getItem('selectedFontWeight');

    if (storedTheme !== null) {
        document.body.className = '';
        if (storedTheme) {
            document.body.classList.add(storedTheme);
        }
    }

    if (storedFont && storedFontWeight) {
        document.querySelectorAll('*').forEach(element => {
            element.style.fontFamily = storedFont;
            element.style.fontWeight = storedFontWeight;
        });
    }
});