document.addEventListener('DOMContentLoaded', () => {
    const aiToggle = document.getElementById('aiToggle');
    const outputContainer = document.getElementById('output');
  
    const handleNewWord = async () => {
      const woorden = outputContainer.textContent.trim().split(/\s+/);
      const lastWord = woorden[woorden.length - 1];
      console.log('Laatste woord:', lastWord);
  
      if (aiToggle.checked && lastWord) {
        try {
          const response = await fetch('/api/suggestions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: lastWord })
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log('Voorspelde woorden:', data.suggestions);
  
          loadSuggestions(data.suggestions);
  
        } catch (error) {
          console.error('Fout bij het ophalen van suggesties:', error);
        }
      }
  
      // Grammatica controle uitvoeren, ongeacht de AI Toggle status
    //   await checkGrammar(outputContainer.textContent.trim());
    };
  
    function loadSuggestions(suggestions) {
        const availableSlots = Array.from(document.querySelectorAll('.dynamic a'))
            .filter(a => !a.id.includes('categorie') && !a.classList.contains('ja') && !a.classList.contains('nee'));
    
        const limitedSuggestions = suggestions.slice(0, availableSlots.length);
    
        limitedSuggestions.forEach((suggestion, index) => {
            if (availableSlots[index]) {
                // Clear existing content
                availableSlots[index].innerHTML = '';
    
                // Remove all existing classes
                availableSlots[index].className = '';
    
                // Add the image if available
                if (suggestion.afbeelding) {
                    const img = document.createElement('img');
                    img.src = `/images/${suggestion.afbeelding}`; // Assuming images are stored in a directory named 'images'
                    img.alt = suggestion.woord;
                    availableSlots[index].appendChild(img);
                }
    
                // Add the word as text content
                const textNode = document.createTextNode(suggestion.woord);
                availableSlots[index].appendChild(textNode);
    
                // Add the word type as a class
                if (suggestion.woordsoort) {
                    availableSlots[index].classList.add(suggestion.woordsoort);
                }
    
                // Add the "ai" class
                availableSlots[index].classList.add('ai');
    
                // Set href and other attributes if needed
                availableSlots[index].href = '#';
            }
        });
    }
    
    
  
    // async function checkGrammar(text) {
    //   try {
    //     const response = await fetch('/api/check-grammar', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ text: text })
    //     });
  
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
  
    //     const data = await response.json();
    //     console.log('Gecorrigeerde tekst:', data.correctedText);
  
    //     // Update the output container with the corrected text
    //     outputContainer.textContent = data.correctedText;
  
    //   } catch (error) {
    //     console.error('Fout bij het controleren van grammatica:', error);
    //   }
    // }
  
    const observer = new MutationObserver(() => {
      handleNewWord();
    });
  
    observer.observe(outputContainer, { childList: true, subtree: true });
  
    console.log('MutationObserver is ingesteld en actief.');
  });
  