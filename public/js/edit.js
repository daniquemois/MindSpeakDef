document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.dynamic a');
    const editPopup = document.getElementById('editPopup');
    const penToolButton = document.getElementById('pentool');
    const mainElement = document.querySelector('main'); // Get the main element
    let currentTile = null;

    // Voeg een "edit" knop toe aan elke tegel
    tiles.forEach((tile, index) => {
        const editButton = document.createElement('button');
        editButton.textContent = '';
        editButton.classList.add('edit-button');
        tile.appendChild(editButton);

        // Voeg een unieke data-tile-id toe als deze nog niet bestaat
        if (!tile.dataset.tileId) {
            tile.dataset.tileId = `tile-${index}`; // Unieke ID voor elke tegel
        }

        editButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Voorkom dat de tegel zelf ook klikt
            currentTile = tile;

            const tileLabel = document.getElementById('tileLabel');
            const tileImage = document.getElementById('tileImage');

            // Check if the tileLabel and tileImage elements exist
            if (tileLabel) {
                tileLabel.value = tile.querySelector('span') ? tile.querySelector('span').textContent : '';
            } else {
                console.error("tileLabel input element not found");
            }

            if (tileImage) {
                tileImage.value = tile.querySelector('img') ? tile.querySelector('img').src : '';
            } else {
                console.error("tileImage input element not found");
            }

            const tileUpload = document.getElementById('tileUpload');
            if (tileUpload) {
                tileUpload.value = ''; // Reset de file input
            }

            if (editPopup) {
                editPopup.classList.add('active');
            } else {
                console.error("editPopup element not found");
            }

            // Add the blur class to the main element
            if (mainElement) {
                mainElement.classList.add('blur');
            }
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
                newImageUrl = e.target.result; // Gebruik de base64 data URL voor de afbeelding
                updateTile(currentTile, newLabel, newImageUrl);
                saveTileData(currentTile.dataset.tileId, newLabel, newImageUrl);
            };
            reader.readAsDataURL(tileUpload.files[0]);
        } else {
            updateTile(currentTile, newLabel, newImageUrl);
            saveTileData(currentTile.dataset.tileId, newLabel, newImageUrl);
        }

        // Sluit de popup
        if (editPopup) {
            editPopup.classList.remove('active');
        }

        // Remove the blur class from the main element
        if (mainElement) {
            mainElement.classList.remove('blur');
        }
    });

    // Annuleren van bewerken
    document.getElementById('cancelEdit').addEventListener('click', () => {
        if (editPopup) {
            editPopup.classList.remove('active');
        }

        // Remove the blur class from the main element
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
        const tileId = tile.dataset.tileId; // Gebruik de data-attribute als ID
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

    // Toggle de bewerkingsmodus aan/uit wanneer op de pentool-knop wordt geklikt
    penToolButton.addEventListener('click', () => {
        document.body.classList.toggle('edit-mode');
    });

    // Event listener voor de verwijderknop om de localStorage te wissen
    const clearLocalStorageButton = document.getElementById('looptool');
    if (clearLocalStorageButton) {
        clearLocalStorageButton.addEventListener('click', () => {
            localStorage.clear();
            // Herlaad de pagina om de wijzigingen door te voeren
            location.reload();
        });
    }
});
