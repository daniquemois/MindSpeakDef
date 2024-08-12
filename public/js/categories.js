let currentPage = 0;
const itemsPerPage = 23; // Number of items per page excluding fixed items

// Function to dynamically identify the category from the URL
function getCategoryFromURL() {
    const path = window.location.pathname;
    const parts = path.split('/');
    const category = parts[parts.length - 1].replace('.html', '');
    return category; // Returns the category name, e.g., "mensen"
}

// Check if the page does not contain "toetsenbord" or "account" in the URL
function shouldRunScript() {
    const path = window.location.pathname.toLowerCase();
    return !path.includes('toetsenbord') && !path.includes('account');
}

if (shouldRunScript()) {
    async function fetchData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            console.log('Fetched data:', data); // Log fetched data for debugging

            const category = getCategoryFromURL();
            console.log('Category:', category); // Log the detected category

            // Process the data for the dynamically detected category
            processData(data, category);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function processData(data, category) {
        const filteredWords = [];
        let specialTile5Word = null;
        let specialTile10Word = null;

        // Search for words with the dynamically detected category
        for (let row of data) {
            if (row.length > 3) { // Check if the row has at least 4 columns
                const categories = row[3].split(',').map(category => category.trim()); // Split the categories and remove any spaces

                const wordData = {
                    word: row[0],
                    wordType: row[1], // Assume the word type is in the second column
                    imageUrl: row[5] ? `/images/${row[5]}` : null, // Assume the image is in the sixth column (F)
                    isCategory: row[4] && row[4].toLowerCase() === 'ja', // Check if the column exists and contains 'ja'
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

        // Sort the words: first categories, then alphabetically within those groups
        filteredWords.sort((a, b) => {
            if (a.isCategory && !b.isCategory) {
                return -1; // a comes before b
            } else if (!a.isCategory && b.isCategory) {
                return 1; // b comes before a
            } else {
                return a.word.localeCompare(b.word); // Sort alphabetically
            }
        });

        renderPage(filteredWords, currentPage, specialTile5Word, specialTile10Word);
    }

    function renderPage(words, page, specialTile5Word, specialTile10Word) {
        const tiles = document.querySelectorAll('.dynamic a'); // Select all buttons in the .dynamic section
        
        console.log('Tiles found:', tiles.length);
        console.log('Words to display:', words.length);

        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, words.length);

        // Clear and reset the tiles
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.className = ''; // Reset classes
            tile.id = ''; // Reset ID if needed
            tile.removeAttribute('href'); // Remove href if it's not a link
            tile.innerHTML = ''; // Clear the content for new elements like images
            tile.onclick = null; // Remove previous event listeners
        });

        let tileIndex = 0;
        let wordIndex = startIndex;

        while (wordIndex < endIndex && tileIndex < tiles.length) {
            // Handle special tiles (5 and 10)
            if (tileIndex === 4 && specialTile5Word) {
                setTileContent(tiles[4], specialTile5Word);
                tileIndex++;
                continue; // Skip to the next tile
            } else if (tileIndex === 9 && specialTile10Word) {
                setTileContent(tiles[9], specialTile10Word);
                tileIndex++;
                continue; // Skip to the next tile
            }

            // Skip over the "Volgende" and "Terug" buttons
            if ((tileIndex === tiles.length - 1 && endIndex < words.length) || (tileIndex === 0 && page > 0)) {
                tileIndex++;
                continue; // Skip to the next tile
            }

            const tile = tiles[tileIndex];
            
            if (!tile) {
                console.error(`No tile found for index ${tileIndex}.`);
                continue;
            }

            const word = words[wordIndex];
            console.log(`Assigning word "${word.word}" to tile index ${tileIndex}`);

            setTileContent(tile, word);

            tileIndex++;
            wordIndex++;
        }

        // Add a "Terug" button if we're not on the first page
        if (page > 0) {
            const backTile = tiles[0];
            if (backTile) {
                backTile.innerHTML = ''; // Clear any existing content
                const imgElement = document.createElement('img');
                imgElement.src = '/images/terug.svg'; // Path to your back icon image
                imgElement.alt = "Terug";
                imgElement.classList.add('nav-image');
                backTile.appendChild(imgElement);

                const textElement = document.createElement('span');
                textElement.innerText = "Terug";
                backTile.appendChild(textElement);

                backTile.className = '';
                backTile.classList.add('pagination-back');
                backTile.onclick = (event) => {
                    event.preventDefault(); // Prevent default link behavior
                    currentPage--;
                    renderPage(words, currentPage, specialTile5Word, specialTile10Word);
                };
            } else {
                console.error('Back tile not found.');
            }
        }

        // Add a "Volgende" button if there are more words
        if (endIndex < words.length) {
            const nextTile = tiles[tiles.length - 1];
            if (nextTile) {
                nextTile.innerHTML = ''; // Clear any existing content
                const imgElement = document.createElement('img');
                imgElement.src = '/images/volgende.svg'; // Path to your next icon image
                imgElement.alt = "Volgende";
                imgElement.classList.add('nav-image');
                nextTile.appendChild(imgElement);

                const textElement = document.createElement('span');
                textElement.innerText = "Volgende";
                nextTile.appendChild(textElement);

                nextTile.className = '';
                nextTile.classList.add('pagination-next');
                nextTile.onclick = (event) => {
                    event.preventDefault(); // Prevent default link behavior
                    currentPage++;
                    renderPage(words, currentPage, specialTile5Word, specialTile10Word);
                };
            } else {
                console.error('Next tile not found.');
            }
        }
    }

    // Helper function to set the content of a tile
    function setTileContent(tile, word) {
        if (word.imageUrl) {
            const imgElement = document.createElement('img');
            imgElement.src = word.imageUrl;
            imgElement.alt = word.word;
            imgElement.classList.add('tile-image'); // Add a CSS class for styling
            tile.appendChild(imgElement);
        }

        const textElement = document.createElement('span');
        textElement.innerText = word.word;
        tile.appendChild(textElement);

        if (word.wordType) {
            tile.classList.add(word.wordType);
        }

        if (word.isCategory) {
            tile.id = 'categorie';
            if (word.link) {
                const cleanLink = word.link.startsWith('/') ? word.link : `/${word.link}`;
                tile.href = cleanLink;
                tile.style.cursor = 'pointer';
            }
        } else {
            tile.id = ''; // Reset ID if it's not a category
        
            // Add an event listener for non-category tiles
            tile.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
        
                const outputDiv = document.getElementById('output');
                if (outputDiv) {
                    const newDiv = document.createElement('div');
                    newDiv.innerText = tile.innerText; // Put the content of the tile in the new div
                    outputDiv.appendChild(newDiv); // Add the new div to the output div
                    outputDiv.scrollLeft = outputDiv.scrollWidth; // Scroll automatically to the end
                } else {
                    console.error('Output div not found.');
                }
            });
        }
    }

    // Call fetchData when the page loads
    window.onload = fetchData;
}
