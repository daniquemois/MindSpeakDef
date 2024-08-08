let currentPage = 0;
const itemsPerPage = 23; // Aantal items per pagina exclusief vaste items

// Functie om de categorie dynamisch te identificeren
function getCategoryFromURL() {
    const path = window.location.pathname;
    const parts = path.split('/');
    const category = parts[parts.length - 1].replace('.html', '');
    return category; // Geeft de naam van de categorie terug, bijvoorbeeld "mensen"
}

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

    // Zoek naar woorden met de dynamisch gedetecteerde categorie
    for (let row of data) {
        if (row.length > 3) { // Controleer of de rij minstens 4 kolommen heeft
            const categories = row[3].split(',').map(category => category.trim()); // Verdeel de categorieën en verwijder eventuele spaties
            console.log('Categories:', categories); // Log de categorieën van elke rij

            if (categories.includes(category)) { // Controleer of de gedetecteerde categorie een van de categorieën is
                console.log('Adding word:', row[0], 'with categories:', categories);
                filteredWords.push({
                    word: row[0],
                    wordType: row[1], // Veronderstel dat de woordsoort in de tweede kolom zit
                    isCategory: row[4] && row[4].toLowerCase() === 'ja', // Controleer of de kolom bestaat en 'ja' bevat
                    link: row[6] ? row[6].replace('categories/', '') : null // Verwijder onjuiste "categories/" als het al in de link staat
                });
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

    renderPage(filteredWords, currentPage);
}

function renderPage(words, page) {
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
        tile.onclick = null; // Verwijder eerdere event listeners
    });

    let tileIndex = 0;

    for (let i = startIndex; i < endIndex && tileIndex < tiles.length; i++) {
        if (tileIndex === 4 || tileIndex === 9) {
            tileIndex++;
        }

        const tile = tiles[tileIndex];
        
        if (!tile) {
            console.error(`No tile found for index ${tileIndex}.`);
            continue;
        }

        console.log(`Assigning word "${words[i].word}" to tile index ${tileIndex}`);
        tile.innerText = words[i].word;

        if (words[i].wordType) {
            tile.classList.add(words[i].wordType);
        }

        if (words[i].isCategory) {
            tile.id = 'categorie';
            if (words[i].link) {
                tile.href = `${words[i].link}`;
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
    }

    // Zet "Alle thema's" op tegel 5 (index 4)
    const tile5 = tiles[4];
    if (tile5) {
        tile5.innerText = "Alle thema's";
        tile5.className = '';
        tile5.classList.add('custom-class-theme');
        tile5.id = '';
    } else {
        console.error('Tile 5 (index 4) not found.');
    }

    // Zet "Persoonlijk" op tegel 10 (index 9)
    const tile10 = tiles[9];
    if (tile10) {
        tile10.innerText = "Persoonlijk";
        tile10.className = '';
        tile10.classList.add('custom-class-personal');
        tile10.id = '';
    } else {
        console.error('Tile 10 (index 9) not found.');
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
                renderPage(words, currentPage);
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
                renderPage(words, currentPage);
            };
        } else {
            console.error('Back tile not found.');
        }
    }
}


// Roep fetchData aan wanneer de pagina geladen is
window.onload = fetchData;
