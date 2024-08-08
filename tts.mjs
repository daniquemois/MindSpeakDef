import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';  // Importeer CORS

dotenv.config();

const app = express();
const port = 3001;

// Gebruik CORS om verzoeken van andere domeinen toe te staan
app.use(cors({
    origin: 'http://localhost:3000', // Stel de origin in die je wilt toestaan
}));

app.use(express.json());

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
                voice: 'nova', // Kies een beschikbare stem
                input: text,
            })
        });

        const arrayBuffer = await response.arrayBuffer(); 
        const audioBuffer = Buffer.from(arrayBuffer);

        res.set('Content-Type', 'audio/mpeg');
        res.send(audioBuffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`TTS Server running on http://localhost:${port}`);
});
