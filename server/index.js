import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

// Validate environment variables strictly
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('AIzaSyDlf7U')) {
  throw new Error("Missing or invalid GEMINI_API_KEY in server/.env file. Please add a real key.");
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
  ].filter(Boolean),
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Scripture API Server — Clean Architecture ✦' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
