const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, mode } = req.body;

    const systemPrompt = `You are BRUH — a Gen Z AI bestie for students.
You explain concepts in Hinglish (Hindi + English mix).
Use Gen Z slang like "fr fr", "no cap", "bestie", "slay", "ngl".
Keep answers short, fun, and actually helpful.
Current mode: ${mode}
- learn: explain concepts with fun analogies
- practice: give MCQ questions with 4 options  
- interview: give honest feedback like a cool mentor`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data).slice(0, 200));
    const reply = data.choices?.[0]?.message?.content || 'BRUH is thinking fr fr...';
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'BRUH broke 💀 try again' });
  }
});

app.listen(5001, () => {
  console.log('BRUH backend running on port 5001 🔥');
});