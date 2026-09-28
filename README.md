# 🎓 EduGenie – Google Gemini Powered Learning Assistant

*Your AI-Powered Learning Companion*

## Description
EduGenie is a full-stack web app that helps students learn with Google Gemini: ask questions, get topic explanations, summarize notes, take quizzes, build study plans and practice with flashcards.

## Features
- **AI Tutor** – chat with follow-up questions
- **Explain Topic** – Beginner / Intermediate / Advanced explanations with examples
- **Summarizer** – short summary, key points, important terms
- **Quiz Generator** – multiple-choice, one question at a time, final score and answers
- **Study Planner** – day-by-day plan from exam date and daily hours
- **Flashcards** – flip cards with Next / Previous
- **Dashboard** – questions asked, quizzes completed, average score, sessions, recent activity (stored in your browser)

## Technologies
React 18, Vite, JavaScript, CSS, Node.js + Express, Google Gemini REST API.

## Project structure
```
edugenie/
├── backend/server.js        Express API + Gemini integration
├── frontend/                React app (index.html, src/components, src/styles)
├── vite.config.js           Vite config + /api proxy
├── .env.example             Template for your API key
├── .gitignore
└── package.json
```

## Installation
1. Install [Node.js 18+](https://nodejs.org).
2. In the project folder run: `npm install`

## Configure your Gemini API key
1. Get a free key at https://aistudio.google.com/app/apikey
2. Copy `.env.example` to a new file named `.env`
3. Edit `.env`: `GEMINI_API_KEY=your_real_key`
4. Restart the app after changing `.env`.

The key stays on the backend only; the browser never sees it. The dashboard shows a warning if the key is missing.

## Run in VS Code
1. **File → Open Folder…** and choose the `edugenie` folder.
2. Open the terminal (**Ctrl+`**) and run `npm install`, then `npm run dev`.
3. Open http://localhost:5173

## Upload to GitHub
```
git init
git add .
git commit -m "Initial commit: EduGenie"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/edugenie.git
git push -u origin main
```
Create the empty repository on github.com first. Before pushing, run `git status` and confirm `.env` is **not** listed.

## Security note
API keys are passwords. Anyone who sees your key can use your quota, and bots scan GitHub for leaked keys within minutes. That's why the key lives in `.env`, which `.gitignore` excludes, and only `.env.example` (with a placeholder) is committed. If you ever commit a key by accident, revoke it in Google AI Studio and create a new one.

## Troubleshooting
- "API key is missing" → check `.env` exists in the project root and restart.
- Model errors → set `GEMINI_MODEL` in `.env` to another available Gemini model.
