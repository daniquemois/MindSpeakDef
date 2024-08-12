import './categories.js';
import './vocabulaire.js';
import './toetsenbord.js';
import './account.js';
import './voorspellen.js';
import './nav.js';
import './edit.js';
import './fallback.js';

async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        // Verwerk de data
        processData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function processData(data) {
    const homepageWords = [];

    // Zoek naar woorden met de categorie "homepage"
    for (let row of data) {
        if (row.length > 3) {
            const categories = row[3].split(',');
            if (categories.includes('homepage')) {
                const tileId = `tile-${row[0].toLowerCase().replace(/\s+/g, '-')}`; // Uniek ID gebaseerd op het woord
                homepageWords.push({
                    word: row[0],
                    priority: parseInt(row[2]),
                    wordType: row[1],
                    imageUrl: row[5] ? `/images/${row[5]}` : null,
                    isCategory: row[4] === 'ja',
                    link: row[6] || null,
                    tileId: tileId // Voeg tileId toe
                });
            }
        }
    }

    // Sorteer de woorden op prioriteit
    homepageWords.sort((a, b) => a.priority - b.priority);

    // Voeg de woorden en afbeeldingen toe aan de juiste tegels
    for (let i = 0; i < homepageWords.length; i++) {
        const tile = document.getElementById(`hp${homepageWords[i].priority}`);
        if (tile) {
            tile.dataset.tileId = homepageWords[i].tileId; // Voeg tileId toe aan de tegel

            const savedTileData = JSON.parse(localStorage.getItem(tile.dataset.tileId));
            if (savedTileData) {
                homepageWords[i].word = savedTileData.label || homepageWords[i].word;
                homepageWords[i].imageUrl = savedTileData.imageUrl || homepageWords[i].imageUrl;
            }

            if (homepageWords[i].imageUrl && homepageWords[i].word.toLowerCase() !== 'ja' && homepageWords[i].word.toLowerCase() !== 'nee') {
                const imgElement = document.createElement('img');
                imgElement.src = homepageWords[i].imageUrl;
                imgElement.alt = homepageWords[i].word;
                imgElement.classList.add('tile-image');
                tile.appendChild(imgElement);
            }

            const textElement = document.createElement('span');
            textElement.innerText = homepageWords[i].word;
            tile.appendChild(textElement);

            tile.classList.add(homepageWords[i].wordType);
            if (homepageWords[i].isCategory) {
                tile.id = 'categorie';
            }
            if (homepageWords[i].link) {
                tile.href = homepageWords[i].link;
                tile.style.cursor = 'pointer';
            } else {
                tile.removeAttribute('href');
                tile.addEventListener('click', () => {
                    const outputDiv = document.getElementById('output');
                    if (outputDiv) {
                        const newDiv = document.createElement('div');
                        newDiv.innerText = tile.innerText;
                        outputDiv.appendChild(newDiv);
                        outputDiv.scrollLeft = outputDiv.scrollWidth;
                        console.log('Added word to output:', tile.innerText);

                        checkOrSetCookies();

                    }
                });
            }
        }
    }
}

function checkOrSetCookies() {

    const outputContainer = document.getElementById('output');
    const woorden = Array.from(outputContainer.children).map(child => child.innerText.trim());
    const zin = woorden.join(' ');
    const lastWord = woorden[woorden.length - 1]; // Pak het laatste woord

    console.log('checkOrSetCookies with zin:', zin);

    // check if the cookie exists
    if (document.cookie.indexOf('zin=') === -1) {
        // if it doesn't exist, create it
        document.cookie = `zin=${zin}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        console.log('Cookie created:', `zin=${zin}; expires=Fri, 31 Dec 9999 23:59:59 GMT`);
    } else {
        // if it exists, update it
        document.cookie = `zin=${zin}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        console.log('Cookie updated:', `zin=${zin}; expires=Fri, 31 Dec 9999 23:59:59 GMT`);
    }

    // console log our zin cookie
    console.log('Zin cookie:', document.cookie);
}

// Check if cookie is set and if so, update the output
function checkCookie() {
    // check if the cookie exists
    if (document.cookie.indexOf('zin=') !== -1) {
        // if it exists, update the output
        const zin = document.cookie.split('=')[1];
        const outputDiv = document.getElementById('output');
        if (outputDiv) {
            const newDiv = document.createElement('div');
            newDiv.innerText = zin;
            outputDiv.appendChild(newDiv);
            outputDiv.scrollLeft = outputDiv.scrollWidth;
            console.log('Added word to output:', zin);
        }
    }
}

// Check for cookies on page load
checkCookie();


if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    window.onload = fetchData;
}

document.addEventListener('DOMContentLoaded', () => {
    const storedTheme = localStorage.getItem('selectedTheme');
    const storedFont = localStorage.getItem('selectedFont');
    const storedFontWeight = localStorage.getItem('selectedFontWeight');

    if (storedTheme) {
        document.body.className = '';
        document.body.classList.add(storedTheme);
    }

    if (storedFont && storedFontWeight) {
        document.querySelectorAll('*').forEach(element => {
            element.style.fontFamily = storedFont;
            element.style.fontWeight = storedFontWeight;
        });
    }
});
