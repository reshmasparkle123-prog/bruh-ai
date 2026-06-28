# 💀 BRUH — Your AI Bestie for Students

> Learn. Practice. Get Hired. No Cap.

BRUH is a Gen Z–coded AI study companion that explains concepts, quizzes you, and runs mock interviews — all in Hinglish, with zero boring textbook energy. Built solo end-to-end: frontend, backend, AI integration, and deployment.

🔗 **Live demo:** [bruh-ai.vercel.app](https://bruh-ai.vercel.app)

---

## Features

- 🧠 **Learn mode** — concepts explained with relatable analogies, not jargon
- 💪 **Practice mode** — MCQs with instant feedback
- 🎤 **Interview mode** — mock interview practice with honest, constructive feedback
- 💀 **FAAAHHH Legacy mode** — high-intensity quiz mode with audio feedback on wrong answers
- 🏆 Streaks, XP, badges, and a leaderboard to keep users engaged
- 🎮 Custom gaming-inspired dark UI built from scratch (no UI library)

## Tech Stack

**Frontend:** React, Axios, Web Audio API
**Backend:** Node.js, Express
**AI:** Groq API (Llama 3.3 70B) for conversational responses
**Deployment:** Vercel (frontend) + Railway (backend)
**Version control:** Git/GitHub

## Architecture

User → React frontend → Express API → Groq (Llama 3.3 70B) → Response → Sound/UI feedback

The frontend sends the user's message and selected mode (learn/practice/interview/legacy) to the backend, which builds a mode-specific system prompt and forwards it to Groq. Responses are parsed client-side to trigger contextual sound effects and UI state (streaks, XP, badges).

## Running Locally

Backend:
cd backend
npm install
echo "GROQ_API_KEY=your_key_here" > .env
node index.js

Frontend (new terminal):
cd frontend
npm install
npm start

## What I Learned

Building BRUH end-to-end meant working across the full stack — designing a system prompt that consistently stays in character, debugging CORS and audio-autoplay restrictions in the browser, handling secret leaks during deployment (and learning to scrub them from git history), and configuring two separate hosting platforms (Vercel + Railway) to talk to each other in production.

## Author

**Reshma K** — [GitHub](https://github.com/reshmasparkle123-prog)