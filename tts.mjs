import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.TTS_PORT || 3001;
const host = process.env.HOST || 'localhost';

// Gebruik CORS om verzoeken van andere domeinen toe te staan
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));

app.use(express.json());

app.post('/api/tts', async (req, res) => {
    let { text, voice } = req.body;

    console.log('Received text:', text);

    // Fallback naar 'Nova' als er geen specifieke stem is opgegeven
    voice = voice || 'Nova';

    console.log('Using voice:', voice);

    try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'tts-1',
                voice: voice,
                input: text,
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer(); // Lees de respons als een ArrayBuffer
        const audioContent = Buffer.from(arrayBuffer).toString('base64'); // Converteer naar base64

        res.json({ audioContent, mimeType: 'audio/mpeg' }); // Voeg expliciet mimeType toe voor debugging
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, host, () => {
    console.log(`TTS Server running on http://${host}:${port}`);
});
