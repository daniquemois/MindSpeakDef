const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Google Sheets API setup
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
//   keyFile: 'path/to/your-service-account-file.json', // Update this path
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Fetch data from Google Sheets
async function fetchSheetData() {
  const authClient = await auth.getClient();
  const spreadsheetId = 'your-spreadsheet-id'; // Update this ID
  const range = 'Sheet1!A1:E10'; // Update this range

  const response = await sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId,
    range,
  });

  return response.data.values;
}

app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchSheetData();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching data from Google Sheets');
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});