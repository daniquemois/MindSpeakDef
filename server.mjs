import express from 'express';
import {
  google
} from 'googleapis';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import NodeCache from 'node-cache'; // Voeg NodeCache import toe

dotenv.config();

// Maak de express-app
const app = express();
const PORT = process.env.PORT || 3000;

// Setup cache
const cache = new NodeCache({
  stdTTL: 600
}); // Cache items voor 10 minuten

// Zorg dat express JSON kan parsen
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(path.resolve(), 'public')));

// Google Sheets API setup
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(path.resolve(), 'mindspeak.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Fetch data from Google Sheets
async function fetchSheetData() {
  try {
    const authClient = await auth.getClient();
    const spreadsheetId = '16PQ7jdlmx96Gs0djg4xtMR7Va9V13jNw4UVBV7p40Ew';
    const range = 'mindspeakdata!A1:G2008';

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// API route to get data from Google Sheets
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchSheetData();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching data from Google Sheets'
    });
  }
});

// TTS route
app.post('/api/tts', async (req, res) => {
  const {
    text
  } = req.body;
  console.log('Received text:', text);
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'alloy', // Kies een beschikbare stem
        input: text,
      })
    });

    const data = await response.json();
    if (data.audioContent) {
      res.json({
        audioContent: data.audioContent
      });
    } else {
      res.status(500).json({
        error: 'Failed to synthesize speech'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

app.post('/api/suggestions', async (req, res) => {
  const prompt = req.body.prompt.toLowerCase();
  console.log('Received prompt:', prompt);

  try {
    // Haal de benodigde kolommen uit de Google Sheet
    async function fetchWordsAndData() {
      try {
        const authClient = await auth.getClient();
        const spreadsheetId = '16PQ7jdlmx96Gs0djg4xtMR7Va9V13jNw4UVBV7p40Ew';
        const range = 'mindspeakdata!A:G'; // Haal de kolommen op: woord, afbeelding, woordsoort

        const response = await sheets.spreadsheets.values.get({
          auth: authClient,
          spreadsheetId,
          range,
        });

        const rows = response.data.values;
        const wordsData = rows.map(row => ({
          woord: row[0] ? row[0].toLowerCase() : null,
          afbeelding: row[5] || null,
          woordsoort: row[1] || null,
        })).filter(entry => entry.woord);

        return wordsData;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }
    // Haal alle woorden en bijbehorende data op
    const wordsData = await fetchWordsAndData();

    // Gebruik AI om meerdere suggesties te genereren
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
            role: 'system',
            content: `Je bent een taalassistent. Je ontvangt een woord en je moet een lijst met maximaal 25 woorden geven die er logisch op volgen in een kindvriendelijke zin. Houd er rekening mee dat alle werkwoorden in hun infinitiefvorm staan in de dataset, dat betekent dus dat je rekening hoeft te houden met dat "ik willen" bijvoorbeeld grammaticaal niet klopt.`
          },
          {
            role: 'user',
            content: `Wat zijn mogelijke woorden die kunnen volgen op het woord "${prompt}"?`
          }
        ],
        max_tokens: 100,
        n: 5, // Vraag om 5 verschillende sets suggesties
        stop: ["\n"]
      })
    });

    const aiData = await aiResponse.json();

    // Combineer alle suggesties uit de verschillende keuzes en maak ze uniek
    let aiSuggestions = aiData.choices.map(choice => choice.message.content.trim().split(/[ ,\n]+/))
      .flat()
      .filter(word => word && isNaN(word) && word !== '1.');

    // Verwijder duplicaten
    aiSuggestions = [...new Set(aiSuggestions)];
    console.log('AI suggestions:', aiSuggestions);

    // Filter AI-suggesties die niet in Google Sheets voorkomen
    aiSuggestions = aiSuggestions.map(suggestion => {
      const wordEntry = wordsData.find(entry => entry.woord === suggestion.toLowerCase());
      return wordEntry ? wordEntry.woord : null;
    }).filter(Boolean);

    // Zoek de bijbehorende data in Google Sheets
    const finalSuggestions = aiSuggestions.map(suggestion => {
      const wordEntry = wordsData.find(entry => entry.woord === suggestion);
      return {
        woord: wordEntry ? wordEntry.woord : suggestion,
        afbeelding: wordEntry ? wordEntry.afbeelding : null,
        woordsoort: wordEntry ? wordEntry.woordsoort : null
      };
    }).slice(0, 25); // Beperk tot maximaal 25 suggesties

    console.log('Final suggestions:', finalSuggestions);

    res.json({
      suggestions: finalSuggestions
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

// app.post('/api/check-grammar', async (req, res) => {
//   const { text } = req.body;
//   console.log('Received text for grammar check:', text);

//   try {
//     const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: 'gpt-4',
//         messages: [
//           { role: 'system', content: 'Je bent een grammatica controle assistent. Corrigeer de volgende zin als dat nodig is, en pas het aan. Doe anders niks. Hij hoeft niet volledig te zijn. Dit is het enige wat je hoeft te doen.' },
//           { role: 'user', content: text }
//         ],
//         max_tokens: 100,
//         n: 1,
//         stop: ["\n"]
//       })
//     });

//     const aiData = await aiResponse.json();
//     const correctedText = aiData.choices[0].message.content.trim();

//     console.log('Gecorrigeerde tekst:', correctedText);
//     res.json({ correctedText });

//   } catch (error) {
//     console.error('Error checking grammar:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Start de server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});