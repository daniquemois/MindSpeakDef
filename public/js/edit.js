document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.dynamic a');
    const editPopup = document.getElementById('editPopup');
    const penToolButton = document.getElementById('pentool');
    let currentTile = null;

    // Voeg een "edit" knop toe aan elke tegel
    tiles.forEach((tile, index) => {
        const editButton = document.createElement('button');
        editButton.textContent = '+';
        editButton.classList.add('edit-button');
        tile.appendChild(editButton);

        // Voeg een unieke data-tile-id toe als deze nog niet bestaat
        if (!tile.dataset.tileId) {
            tile.dataset.tileId = `tile-${index}`; // Unieke ID voor elke tegel
        }

        editButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Voorkom dat de tegel zelf ook klikt
            currentTile = tile;
            document.getElementById('tileLabel').value = tile.querySelector('span') ? tile.querySelector('span').textContent : '';
            document.getElementById('tileImage').value = tile.querySelector('img') ? tile.querySelector('img').src : '';
            editPopup.classList.add('active');
        });
    });

    // Opslaan van wijzigingen
    document.getElementById('saveTile').addEventListener('click', () => {
        const newLabel = document.getElementById('tileLabel').value;
        const newImageUrl = document.getElementById('tileImage').value;

        // Update de tegel
        if (newLabel) {
            let spanElement = currentTile.querySelector('span');
            if (!spanElement) {
                spanElement = document.createElement('span');
                currentTile.appendChild(spanElement);
            }
            spanElement.textContent = newLabel;
        }

        if (newImageUrl) {
            let imgElement = currentTile.querySelector('img');
            if (!imgElement) {
                imgElement = document.createElement('img');
                currentTile.insertBefore(imgElement, currentTile.firstChild);
            }
            imgElement.src = newImageUrl;
        }

        // Sla de wijzigingen op in localStorage
        const tileId = currentTile.dataset.tileId;
        const tileData = {
            label: newLabel,
            imageUrl: newImageUrl
        };
        localStorage.setItem(tileId, JSON.stringify(tileData));

        // Sluit de popup
        editPopup.classList.remove('active');
    });

    // Annuleren van bewerken
    document.getElementById('cancelEdit').addEventListener('click', () => {
        editPopup.classList.remove('active');
    });

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
