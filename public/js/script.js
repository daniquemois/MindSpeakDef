import './categories.js';
import './vocabulaire.js';
import './toetsenbord.js';
import './account.js';
import './voorspellen.js';
import './nav.js';
import './edit.js';
import './fallback.js';
import './add.js';

async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        processData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function processData(data) {
    const homepageWords = [];
    for (let row of data) {
        if (row.length > 3) {
            const categories = row[3].split(',');
            if (categories.includes('homepage')) {
                const tileId = `tile-${row[0].toLowerCase().replace(/\s+/g, '-')}`;
                homepageWords.push({
                    word: row[0],
                    priority: parseInt(row[2]),
                    wordType: row[1],
                    imageUrl: row[5] ? `/images/${row[5]}` : null,
                    isCategory: row[4] === 'ja',
                    link: row[6] || null,
                    tileId: tileId
                });
            }
        }
    }

    homepageWords.sort((a, b) => a.priority - b.priority);

    for (let i = 0; i < homepageWords.length; i++) {
        const tile = document.getElementById(`hp${homepageWords[i].priority}`);
        if (tile) {
            tile.dataset.tileId = homepageWords[i].tileId;

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

                        updateCookieWithOutput(); // Update the cookie when the output changes
                    }
                });
            }
        }
    }
}

function updateCookieWithOutput() {
    const outputContainer = document.getElementById('output');
    const woorden = Array.from(outputContainer.children).map(child => child.innerText.trim());
    const zin = woorden.join(' ');
    document.cookie = `zin=${encodeURIComponent(zin)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadOutputFromCookie() {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('zin='));
    if (cookieValue) {
        const zin = decodeURIComponent(cookieValue.split('=')[1]);
        const outputDiv = document.getElementById('output');
        if (outputDiv && zin) {
            outputDiv.innerHTML = ''; // Clear current output
            const words = zin.split(' ');
            words.forEach(word => {
                const newDiv = document.createElement('div');
                newDiv.innerText = word;
                outputDiv.appendChild(newDiv);
            });
            outputDiv.scrollLeft = outputDiv.scrollWidth;
        }
    }
}

// Load the output from the cookie on page load
document.addEventListener('DOMContentLoaded', loadOutputFromCookie);

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
