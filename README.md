# Scripture ✦

A modern, production-ready Bible web application built with React (Vite) + Tailwind CSS.

## Features

- 📖 **Read** — Browse any book/chapter with per-verse audio playback and AI explanation
- 🔍 **Smart Search** — Search by keyword (love, faith, peace) or reference (John 3:16). Highlights matched terms.
- 🤖 **AI Explanations** — Click "Explain" on any verse to get a concise, modern explanation via Claude AI
- 📅 **Verse of the Day** — Daily rotating verse on the homepage
- 🎧 **Audio Bible** — Text-to-speech for any verse or full chapter, with playing indicator
- 🌍 **Multi-Version** — KJV, WEB, BBE, and Gujarati (curated dataset)
- 🎨 **Poster Generator** — Create beautiful downloadable verse images with custom backgrounds, fonts, colors
- 🌙 **Dark Mode** — Full dark/light theme support with system preference detection

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS 3
- **Routing**: React Router v6
- **Bible Data**: [bible-api.com](https://bible-api.com) (free, no API key needed)
- **AI**: Claude API (Anthropic)
- **Audio**: Web Speech API (built-in browser)
- **Image Export**: html2canvas
- **Icons**: Lucide React

## Setup

```bash
# Install dependencies
cd client && npm install

# Development
npm run dev

# Build for production
npm run build
```

### Server (optional)

- **Install & run**: Run server dependencies and start the Express backend:

	```bash
	cd server && npm install
	npm run dev
	```

- **Environment**: Copy `server/.env.example` to `server/.env` and set your Gemini API key:

	```bash
	GEMINI_API_KEY=your_gemini_api_key_here
	```

- **Notes**: The server already loads `.env` via `dotenv`; `.env` is ignored by git. On Vercel, set `GEMINI_API_KEY` in project environment variables instead of committing an `.env` file.

## Deployment (Vercel)

1. Connect your GitHub repo to Vercel
2. Set **Build Command**: `cd client && npm run build`
3. Set **Output Directory**: `client/dist`
4. Deploy — no environment variables needed for core features

## Project Structure

```
bible-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Sticky navbar with version selector + dark mode
│   │   │   ├── VerseCard.jsx       # Verse display with audio, copy, share, AI explain
│   │   │   ├── ExplainModal.jsx    # AI explanation modal
│   │   │   ├── PosterGenerator.jsx # Verse poster designer + PNG download
│   │   │   └── SearchBar.jsx       # Search input with quick topics
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Verse of the Day + feature cards
│   │   │   ├── SearchPage.jsx      # Full search experience
│   │   │   ├── ReadPage.jsx        # Chapter reader
│   │   │   └── PosterPage.jsx      # Poster creation page
│   │   ├── services/
│   │   │   ├── bibleService.js     # Bible API + Gujarati dataset
│   │   │   └── aiService.js        # Claude AI explanations
│   │   ├── context/
│   │   │   └── AppContext.jsx      # Dark mode, version, audio state
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   └── utils/
│   │       └── cn.js               # Tailwind class merging
│   └── ...
└── server/                          # Optional Express backend
```
