import './categories.js';
import './vocabulaire.js';
import './toetsenbord.js';
import './account.js';

async function fetchData() {
  try {
      const response = await fetch('/api/data');
      const data = await response.json();
      console.log('Fetched data:', data); // Log fetched data voor debugging

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
      if (row.length > 3) { // Controleer of de rij minstens 4 kolommen heeft
          const categories = row[3].split(','); // Veronderstel dat de categorie in de vierde kolom zit
          if (categories.includes('homepage')) {
              homepageWords.push({
                  word: row[0],
                  priority: parseInt(row[2]), // Veronderstel dat prioriteit in de derde kolom zit
                  wordType: row[1], // Veronderstel dat de woordsoort in de tweede kolom zit
                  isCategory: row[4] === 'ja', // Veronderstel dat 'Is het een categorie' in de vijfde kolom zit
                  link: row[6] || null // Veronderstel dat de link in de zevende kolom zit (G)
              });
          }
      }
  }

  // Sorteer de woorden op prioriteit
  homepageWords.sort((a, b) => a.priority - b.priority);

  // Voeg de woorden toe aan de juiste tegels en voeg woordsoort als class en categorie ID toe
  for (let i = 0; i < homepageWords.length; i++) {
      const tile = document.getElementById(`hp${homepageWords[i].priority}`);
      if (tile) {
          tile.innerText = homepageWords[i].word;
          tile.classList.add(homepageWords[i].wordType); // Voeg de woordsoort als class toe
          if (homepageWords[i].isCategory) {
              tile.id = 'categorie'; // Voeg de ID 'categorie' toe als het een categorie is
          }
          if (homepageWords[i].link) {
              tile.href = homepageWords[i].link; // Stel de href direct in
              tile.style.cursor = 'pointer'; // Voeg een pointer cursor toe om aan te geven dat het klikbaar is
          } else {
              tile.removeAttribute('href'); // Verwijder href als er geen link is

              // Voeg een event listener toe voor tegels zonder link
              tile.addEventListener('click', () => {
                  const outputDiv = document.getElementById('output');
                  if (outputDiv) {
                      const newDiv = document.createElement('div');
                      newDiv.innerText = tile.innerText; // Zet de inhoud van de tegel in de nieuwe div
                      outputDiv.appendChild(newDiv); // Voeg de nieuwe div toe aan de output div
                      outputDiv.scrollLeft = outputDiv.scrollWidth; // Scroll automatisch naar het einde
                  }
              });
          }
      }
  }
}

if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
  window.onload = fetchData;
}
