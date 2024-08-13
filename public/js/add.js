document.addEventListener('DOMContentLoaded', () => {
    // Controleer of de huidige pagina mijnklas.html of lievelingseten.html is
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const allowedPages = ['mijnklas', 'lievelingseten', 'vrienden', 'familienamen'];
    if (!allowedPages.includes(currentPage)) {
        return; // Als de pagina niet overeenkomt, voer de code niet uit
    }

    const tilesContainer = document.querySelector('.dynamic');
    const tiles = document.querySelectorAll('.dynamic a');
    const editPopup = document.getElementById('editPopup');
    const penToolButton = document.getElementById('pentool');
    const mainElement = document.querySelector('main');
    const outputContainer = document.getElementById('output'); // De container waar output aan wordt toegevoegd
    let currentTile = null;

    // Voeg een "edit" knop toe aan elke bestaande tegel
    tiles.forEach((tile, index) => {
        const editButton = document.createElement('button');
        editButton.textContent = '';
        editButton.classList.add('edit-button');
        tile.appendChild(editButton);

        // Voeg een unieke data-tile-id toe als deze nog niet bestaat
        if (!tile.dataset.tileId) {
            tile.dataset.tileId = `${currentPage}-tile-${index}`;
        }

        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            currentTile = tile;

            const tileLabel = document.getElementById('tileLabel');
            const tileImage = document.getElementById('tileImage');

            if (tileLabel) {
                tileLabel.value = tile.querySelector('span') ? tile.querySelector('span').textContent : '';
            }

            if (tileImage) {
                tileImage.value = tile.querySelector('img') ? tile.querySelector('img').src : '';
            }

            const tileUpload = document.getElementById('tileUpload');
            if (tileUpload) {
                tileUpload.value = '';
            }

            if (editPopup) {
                editPopup.classList.add('active');
            }

            if (mainElement) {
                mainElement.classList.add('blur');
            }
        });

        // Voeg een click event toe aan de tegel om de inhoud aan de output toe te voegen
        tile.addEventListener('click', (event) => {
            event.preventDefault(); // Voorkom standaard navigatie
            addToOutput(tile);
        });
    });

    // Opslaan van wijzigingen
    document.getElementById('saveTile').addEventListener('click', () => {
        const tileLabel = document.getElementById('tileLabel');
        const tileImage = document.getElementById('tileImage');
        let newLabel = tileLabel ? tileLabel.value : '';
        let newImageUrl = tileImage ? tileImage.value : '';

        const tileUpload = document.getElementById('tileUpload');
        if (tileUpload && tileUpload.files && tileUpload.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newImageUrl = e.target.result;
                updateTile(currentTile, newLabel, newImageUrl);
                saveTileData(currentTile.dataset.tileId, newLabel, newImageUrl);
            };
            reader.readAsDataURL(tileUpload.files[0]);
        } else {
            updateTile(currentTile, newLabel, newImageUrl);
            saveTileData(currentTile.dataset.tileId, newLabel, newImageUrl);
        }

        if (editPopup) {
            editPopup.classList.remove('active');
        }

        if (mainElement) {
            mainElement.classList.remove('blur');
        }
    });

    // Annuleren van bewerken
    document.getElementById('cancelEdit').addEventListener('click', () => {
        if (editPopup) {
            editPopup.classList.remove('active');
        }

        if (mainElement) {
            mainElement.classList.remove('blur');
        }
    });

    // Update de tegel met nieuw label en afbeelding
    function updateTile(tile, label, imageUrl) {
        if (label) {
            let spanElement = tile.querySelector('span');
            if (!spanElement) {
                spanElement = document.createElement('span');
                tile.appendChild(spanElement);
            }
            spanElement.textContent = label;
        }
        if (imageUrl) {
            let imgElement = tile.querySelector('img');
            if (!imgElement) {
                imgElement = document.createElement('img');
                tile.insertBefore(imgElement, tile.firstChild);
            }
            imgElement.src = imageUrl;
        }
    }

    // Sla de tegelgegevens op in localStorage
    function saveTileData(tileId, label, imageUrl) {
        const tileData = {
            label: label,
            imageUrl: imageUrl
        };
        localStorage.setItem(tileId, JSON.stringify(tileData));
    }

    // Laad opgeslagen tegels uit localStorage
    tiles.forEach(tile => {
        const tileId = tile.dataset.tileId;
        const savedTileData = JSON.parse(localStorage.getItem(tileId));
        if (savedTileData) {
            if (savedTileData.label) {
                let spanElement = tile.querySelector('span');
                if (!spanElement) {
                    spanElement = document.createElement('span');
                    tile.appendChild(spanElement);
                }
                spanElement.textContent = savedTileData.label;
            }
            if (savedTileData.imageUrl) {
                let imgElement = tile.querySelector('img');
                if (!imgElement) {
                    imgElement = document.createElement('img');
                    tile.insertBefore(imgElement, tile.firstChild);
                }
                imgElement.src = savedTileData.imageUrl;
            }
        }
    });

    // Voeg de inhoud van de tegel toe aan de output container
    function addToOutput(tile) {
        const label = tile.querySelector('span') ? tile.querySelector('span').textContent : '';
        const imageUrl = tile.querySelector('img') ? tile.querySelector('img').src : '';

        if (outputContainer && (label || imageUrl)) {
            const outputItem = document.createElement('div');
            outputItem.classList.add('output-item');

            if (imageUrl) {
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                outputItem.appendChild(imgElement);
            }

            if (label) {
                const textElement = document.createElement('p');
                textElement.textContent = label;
                outputItem.appendChild(textElement);
            }

            outputContainer.appendChild(outputItem);
        }
    }

    // Toggle de bewerkingsmodus aan/uit wanneer op de pentool-knop wordt geklikt
    penToolButton.addEventListener('click', () => {
        if (mainElement) {
            mainElement.classList.toggle('edit-mode');
        }
    });

    // Event listener voor de verwijderknop om de localStorage te wissen
    const clearLocalStorageButton = document.getElementById('looptool');
    if (clearLocalStorageButton) {
        clearLocalStorageButton.addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
    }
});
