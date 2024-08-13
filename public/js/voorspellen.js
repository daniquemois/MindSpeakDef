document.addEventListener('DOMContentLoaded', () => {
    const aiToggle = document.getElementById('aiToggle');
    const outputContainer = document.getElementById('output');
    const loaderContainer = document.getElementById('loadercontainer'); // Pak de loadercontainer op
    const mainElement = document.querySelector('main');

    const handleNewWord = async () => {

        const woorden = Array.from(outputContainer.children).map(child => child.innerText.trim());
        const zin = woorden.join(' ');
        const lastWord = woorden[woorden.length - 1];
        console.log('Laatste woord:', lastWord);
        console.log('Zin:', zin);

        if (aiToggle.checked && lastWord && zin) {
            try {
                loaderContainer.style.display = 'flex'; // Toon de loadercontainer (flexbox zorgt voor centrering als dat in de CSS is ingesteld)
                if (mainElement) {
                    mainElement.classList.add('blur');
                }
                const response = await fetch('/api/suggestions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt: zin })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Voorspelde woorden:', data.suggestions);

                loadSuggestions(data.suggestions);

            } catch (error) {
                console.error('Fout bij het ophalen van suggesties:', error);
            } finally {
                loaderContainer.style.display = 'none'; // Verberg de loadercontainer
                if (mainElement) {
                    mainElement.classList.remove('blur');
                }
            }
        }
    };

    function loadSuggestions(suggestions) {
        const availableSlots = Array.from(document.querySelectorAll('.dynamic a'))
            .filter(a => !a.id.includes('categorie') && !a.classList.contains('ja') && !a.classList.contains('nee'));

        const limitedSuggestions = suggestions.slice(0, availableSlots.length);

        limitedSuggestions.forEach((suggestion, index) => {
            if (availableSlots[index]) {
                availableSlots[index].innerHTML = '';

                availableSlots[index].className = '';

                if (suggestion.afbeelding) {
                    const img = document.createElement('img');
                    img.src = `/images/${suggestion.afbeelding}`;
                    img.alt = suggestion.woord;
                    availableSlots[index].appendChild(img);
                }

                const textNode = document.createTextNode(suggestion.woord);
                availableSlots[index].appendChild(textNode);

                if (suggestion.woordsoort) {
                    availableSlots[index].classList.add(suggestion.woordsoort);
                }

                availableSlots[index].classList.add('ai');
                availableSlots[index].href = '#';
            }
        });
    }

    const observer = new MutationObserver(() => {
        handleNewWord();
    });

    observer.observe(outputContainer, { childList: true, subtree: true });

    console.log('MutationObserver is ingesteld en actief.');
});
