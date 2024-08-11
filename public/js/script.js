import './categories.js';
import './vocabulaire.js';
import './toetsenbord.js';
import './account.js';
import './voorspellen.js';
import './nav.js';
import './edit.js';

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
                      }
                  });
              }
          }
      }
  }
  
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
  