document.addEventListener('DOMContentLoaded', () => {
    function clearTiles() {
        const tiles = document.querySelectorAll('.dy');
        tiles.forEach(tile => {
            tile.innerText = ''; // Maak de inhoud leeg
            tile.className = 'dy'; // Verwijder alle klassen
            tile.removeAttribute('style'); // Verwijder inline styles zoals fontFamily en fontWeight
            const newTile = tile.cloneNode(true); // Maak een schone kopie van het element
            tile.replaceWith(newTile); // Vervang het oude element met de schone kopie om event listeners te verwijderen
        });
    }

    function fillTiles(items) {
        clearTiles(); // Maak eerst de tegels leeg

        const tiles = document.querySelectorAll('.dy');
        items.forEach((item, index) => {
            console.log("test", item, index);
            if (index < tiles.length) {
                const tile = tiles[index];
                console.log(tile)
                tile.innerText = item.label;
                tile.classList.add(item.className || 'item-button'); // Voeg een standaard of specifieke klasse toe
                tile.addEventListener('click', () => {
                    if (item.themeClass !== undefined) {
                        document.body.className = ''; // Reset alle themaklassen
                        if (item.themeClass) {
                            document.body.classList.add(item.themeClass); // Pas de gekozen themaklasse toe
                        }
                    } else if (item.fontFamily) {
                        document.querySelectorAll('*').forEach(element => {
                            element.style.fontFamily = item.fontFamily;
                            element.style.fontWeight = item.fontWeight;
                        });
                    }
                });
            }
        });
    }

    function loadColorThemes() {
        const colorThemes = [
            { label: 'Default', themeClass: '' },
            { label: 'Pastel', themeClass: 'theme-pastel' },
            { label: 'High Contrast', themeClass: 'theme-contrast' },
            { label: 'Dark Mode', themeClass: 'theme-dark' }
        ];

        fillTiles(colorThemes); // Vul de tegels met kleurenthema's
    }

    function loadFonts() {
        const fonts = [
            { label: 'Default', fontFamily: 'ITC Avant Garde Gothic, sans-serif', fontWeight: 'normal' },
            { label: 'Arial', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' },
            { label: 'Times New Roman', fontFamily: '"Times New Roman", serif', fontWeight: 'bold' },
            { label: 'Courier New', fontFamily: '"Courier New", monospace', fontWeight: 'bold' },
            { label: 'Georgia', fontFamily: 'Georgia, serif', fontWeight: 'bold' },
            { label: 'Comic Sans MS', fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold' }
        ];

        fillTiles(fonts); // Vul de tegels met lettertypes
    }

    const kleurenButton = document.getElementById('kleuren');
    if (kleurenButton) {
        kleurenButton.addEventListener('click', () => {
            loadColorThemes(); // Laad de kleurenthema's wanneer er op de kleurenknop wordt gedrukt
        });
    }

    const lettertypeButton = document.getElementById('lettertype');
    if (lettertypeButton) {
        lettertypeButton.addEventListener('click', () => {
            loadFonts(); // Laad de lettertypes wanneer er op de lettertypeknop wordt gedrukt
        });
    }
});
