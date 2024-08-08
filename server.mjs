import express from 'express';
import { google } from 'googleapis';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Laad de omgevingsvariabelen
dotenv.config();

// Maak de express-app
const app = express();
const PORT = process.env.PORT || 3000;

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

// API route to get data
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchSheetData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Google Sheets' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'public/index.html'));
});

// TTS route
app.post('/api/tts', async (req, res) => {
  const { text } = req.body;
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
      res.json({ audioContent: data.audioContent });
    } else {
      res.status(500).json({ error: 'Failed to synthesize speech' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start de server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
