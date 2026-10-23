import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { dataStore } from './services/dataStore.js';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or cwd
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection attempt
connectDB();

// Root endpoint: returns HTTP 200 JSON
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Learnora backend is running',
  });
});

// Health check endpoint (for Render / uptime monitoring): returns HTTP 200 JSON
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Learnora backend is running',
  });
});

// Health & System status API endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    brand: 'Learnora',
    tagline: 'Learn  Grow  Achieve',
    storageMode: dataStore.getStorageMode(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 Route handler for unknown API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on Learnora server.`,
  });
});

// Centralized Error Handling Middleware (Always guarantees valid JSON response)
app.use((err, req, res, next) => {
  console.error('[Learnora Server Error]:', err.message);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format received in request body.',
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`  LEARNORA — AI-Powered Personalized LMS API`);
  console.log(`  Tagline: Learn  Grow  Achieve`);
  console.log(`  Host: ${HOST}`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Storage Mode: ${dataStore.getStorageMode()}`);
  console.log(`====================================================`);
});
