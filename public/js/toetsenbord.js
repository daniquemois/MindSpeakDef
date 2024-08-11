document.addEventListener('DOMContentLoaded', () => {
    const keyboardLayout = {
        qwerty: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        azerty: ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'W', 'X', 'C', 'V', 'B', 'N'],
        abc: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    };

    let currentPage = 0; // Huidige pagina
    const itemsPerPage = 24; // Maximaal 24 toetsen per pagina (laat ruimte voor "Volgende" knop)

    const selectedLayout = localStorage.getItem('selectedKeyboardLayout') || 'qwerty'; // Haal de gekozen layout op, standaard naar qwerty

    function generateKeyboard(layout, page) {
        const keyboardDiv = document.getElementById('keyboard');
        const outputDiv = document.getElementById('output');
        keyboardDiv.innerHTML = ''; // Maak de bestaande inhoud leeg

        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, layout.length);

        let tileIndex = 0;

        // Voeg toetsen toe vanaf de eerste tegel
        for (let i = startIndex; i < endIndex; i++) {
            const keyElement = document.createElement('a');
            keyElement.innerText = layout[i];
            keyElement.id = `key${i + 1}`;
            keyElement.classList.add('keyboard-key');

            // Voeg een event listener toe voor elke toets
            keyElement.addEventListener('click', () => {
                const letterDiv = document.createElement('div');
                letterDiv.innerText = keyElement.innerText;
                letterDiv.classList.add('output-letter'); // Voeg eventueel klassen toe voor styling
                outputDiv.appendChild(letterDiv);

                // Scroll automatisch naar het einde van de output div
                outputDiv.scrollLeft = outputDiv.scrollWidth;
            });

            keyboardDiv.appendChild(keyElement);
            tileIndex++;
        }

        // Voeg "Volgende" knop toe rechtsonderin (25e positie)
        if (endIndex < layout.length) {
            while (tileIndex < 24) {
                const emptyTile = document.createElement('a');
                emptyTile.classList.add('keyboard-key', 'empty-tile');
                keyboardDiv.appendChild(emptyTile);
                tileIndex++;
            }

            const nextTile = document.createElement('a');
            nextTile.innerText = "Volgende";
            nextTile.className = 'pagination-next';
            nextTile.addEventListener('click', () => {
                currentPage++;
                generateKeyboard(layout, currentPage);
            });
            keyboardDiv.appendChild(nextTile);
        } else {
            // Als er geen "Volgende" nodig is, voeg een lege tegel toe
            while (tileIndex < 24) {
                const emptyTile = document.createElement('a');
                emptyTile.classList.add('keyboard-key', 'empty-tile');
                keyboardDiv.appendChild(emptyTile);
                tileIndex++;
            }

            const emptyTile = document.createElement('a');
            emptyTile.classList.add('keyboard-key', 'empty-tile');
            keyboardDiv.appendChild(emptyTile);
        }

        // Voeg "Terug" knop toe linksboven (1e positie) als we niet op de eerste pagina zijn
        if (page > 0) {
            const backTile = document.createElement('a');
            backTile.innerText = "Terug";
            backTile.className = 'pagination-back';
            backTile.addEventListener('click', () => {
                currentPage--;
                generateKeyboard(layout, currentPage);
            });
            keyboardDiv.insertBefore(backTile, keyboardDiv.firstChild);
        }
    }
    if(window.location.pathname === '/toetsenbord.html') {  
        generateKeyboard(keyboardLayout[selectedLayout], currentPage); // Gebruik de gekozen layout
    }
});
