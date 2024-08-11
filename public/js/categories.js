let currentPage = 0;
const itemsPerPage = 23; // Aantal items per pagina exclusief vaste items

// Functie om de categorie dynamisch te identificeren
function getCategoryFromURL() {
    const path = window.location.pathname;
    const parts = path.split('/');
    const category = parts[parts.length - 1].replace('.html', '');
    return category; // Geeft de naam van de categorie terug, bijvoorbeeld "mensen"
}

// Controleer of de pagina geen "toetsenbord" of "account" in de URL bevat
function shouldRunScript() {
    const path = window.location.pathname.toLowerCase();
    return !path.includes('toetsenbord') && !path.includes('account');
}

if (shouldRunScript()) {
    async function fetchData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            console.log('Fetched data:', data); // Log fetched data voor debugging

            const category = getCategoryFromURL();
            console.log('Category:', category); // Log de gedetecteerde categorie

            // Verwerk de data voor de dynamisch gedetecteerde categorie
            processData(data, category);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function processData(data, category) {
        const filteredWords = [];
        let specialTile5Word = null;
        let specialTile10Word = null;
    
        // Zoek naar woorden met de dynamisch gedetecteerde categorie
        for (let row of data) {
            if (row.length > 3) { // Controleer of de rij minstens 4 kolommen heeft
                const categories = row[3].split(',').map(category => category.trim()); // Verdeel de categorieën en verwijder eventuele spaties
    
                const wordData = {
                    word: row[0],
                    wordType: row[1], // Veronderstel dat de woordsoort in de tweede kolom zit
                    imageUrl: row[5] ? `/images/${row[5]}` : null, // Veronderstel dat de afbeelding in de zesde kolom zit (F)
                    isCategory: row[4] && row[4].toLowerCase() === 'ja', // Controleer of de kolom bestaat en 'ja' bevat
                    link: row[6]
                };
    
                if (row[0] === "Alle thema's") {
                    specialTile5Word = wordData;
                } else if (row[0] === "Persoonlijk") {
                    specialTile10Word = wordData;
                } else if (categories.includes(category)) {
                    filteredWords.push(wordData);
                }
            }
        }
    
        // Sorteer de woorden: eerst categorieën, dan alfabetisch binnen die groepen
        filteredWords.sort((a, b) => {
            if (a.isCategory && !b.isCategory) {
                return -1; // a komt vóór b
            } else if (!a.isCategory && b.isCategory) {
                return 1; // b komt vóór a
            } else {
                return a.word.localeCompare(b.word); // Sorteer alfabetisch
            }
        });
    
        renderPage(filteredWords, currentPage, specialTile5Word, specialTile10Word);
    }
    
    function renderPage(words, page, specialTile5Word, specialTile10Word) {
        const tiles = document.querySelectorAll('.dynamic a'); // Selecteer alle knoppen in de .dynamic sectie
        
        console.log('Tiles found:', tiles.length);
        console.log('Words to display:', words.length);
    
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, words.length);
        
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.className = ''; // Reset classes
            tile.id = ''; // Reset ID indien nodig
            tile.removeAttribute('href'); // Verwijder href als het geen link heeft
            tile.innerHTML = ''; // Maak de inhoud leeg voor nieuwe elementen zoals afbeeldingen
            tile.onclick = null; // Verwijder eerdere event listeners
        });
    
        let tileIndex = 0;
        let wordIndex = startIndex;
    
        while (wordIndex < endIndex && tileIndex < tiles.length) {
            if (tileIndex === 4 || tileIndex === 9) {
                // Sla tegel 5 en 10 over voor de standaard items
                tileIndex++;
            }
    
            const tile = tiles[tileIndex];
            
            if (!tile) {
                console.error(`No tile found for index ${tileIndex}.`);
                continue;
            }
    
            const word = words[wordIndex];
            console.log(`Assigning word "${word.word}" to tile index ${tileIndex}`);
    
            // Voeg de afbeelding toe als er een is
            if (word.imageUrl) {
                const imgElement = document.createElement('img');
                imgElement.src = word.imageUrl;
                imgElement.alt = word.word;
                imgElement.classList.add('tile-image'); // Voeg een CSS-klasse toe voor styling
                tile.appendChild(imgElement);
            }
    
            // Voeg de tekst toe
            const textElement = document.createElement('span');
            textElement.innerText = word.word;
            tile.appendChild(textElement);
    
            if (word.wordType) {
                tile.classList.add(word.wordType);
            }
    
            if (word.isCategory) {
                tile.id = 'categorie';
                if (word.link) {
                    // Controleer en pas de link aan om onbedoelde toevoegingen te voorkomen
                    tile.href = `${word.link.startsWith('/') ? word.link : '/' + word.link}`;
                    tile.style.cursor = 'pointer';
                }
            } else {
                tile.id = ''; // Reset ID als het geen categorie is
            
                // Voeg een event listener toe voor niet-categorie tegels
                tile.addEventListener('click', (event) => {
                    event.preventDefault(); // Voorkom standaard linkgedrag
            
                    const outputDiv = document.getElementById('output');
                    if (outputDiv) {
                        const newDiv = document.createElement('div');
                        newDiv.innerText = tile.innerText; // Zet de inhoud van de tegel in de nieuwe div
                        outputDiv.appendChild(newDiv); // Voeg de nieuwe div toe aan de output div
                        outputDiv.scrollLeft = outputDiv.scrollWidth; // Scroll automatisch naar het einde
                    } else {
                        console.error('Output div not found.');
                    }
                });
            }
            
    
            tileIndex++;
            wordIndex++;
        }
    
        // Zet het specifieke woord op tegel 5 (index 4)
        const tile5 = tiles[4];
        if (tile5 && specialTile5Word) {
            tile5.innerText = specialTile5Word.word;
            tile5.className = '';
            tile5.classList.add('custom-class-theme');
            tile5.id = 'categorie';
            if (specialTile5Word.imageUrl) {
                const imgElement = document.createElement('img');
                imgElement.src = specialTile5Word.imageUrl;
                imgElement.alt = specialTile5Word.word;
                imgElement.classList.add('tile-image');
                tile5.appendChild(imgElement);
            }
            if (specialTile5Word.link) {
                tile5.href = specialTile5Word.link;
                tile5.style.cursor = 'pointer';
            }
        }
    
        // Zet het specifieke woord op tegel 10 (index 9)
        const tile10 = tiles[9];
        if (tile10 && specialTile10Word) {
            tile10.innerText = specialTile10Word.word;
            tile10.className = '';
            tile10.classList.add('custom-class-personal');
            tile10.id = 'categorie';
            if (specialTile10Word.imageUrl) {
                const imgElement = document.createElement('img');
                imgElement.src = specialTile10Word.imageUrl;
                imgElement.alt = specialTile10Word.word;
                imgElement.classList.add('tile-image');
                tile10.appendChild(imgElement);
            }
            if (specialTile10Word.link) {
                tile10.href = specialTile10Word.link;
                tile10.style.cursor = 'pointer';
            }
        }
    
        // Voeg een "Volgende" knop toe als er meer woorden zijn
        if (endIndex < words.length) {
            const nextTile = tiles[tiles.length - 1];
            if (nextTile) {
                nextTile.innerText = "Volgende";
                nextTile.className = '';
                nextTile.classList.add('pagination-next');
                nextTile.onclick = () => {
                    currentPage++;
                    renderPage(words, currentPage, specialTile5Word, specialTile10Word);
                };
            } else {
                console.error('Next tile not found.');
            }
        }
    
        // Voeg een "Terug" knop toe op tegel 1 als we niet op de eerste pagina zijn
        if (page > 0) {
            const backTile = tiles[0];
            if (backTile) {
                backTile.innerText = "Terug";
                backTile.className = '';
                backTile.classList.add('pagination-back');
                backTile.onclick = () => {
                    currentPage--;
                    renderPage(words, currentPage, specialTile5Word, specialTile10Word);
                };
            } else {
                console.error('Back tile not found.');
            }
        }
    }
    
    // Roep fetchData aan wanneer de pagina geladen is
    window.onload = fetchData;
}
