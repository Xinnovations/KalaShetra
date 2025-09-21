import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import aiRoutes from './routes/ai.js';
import productRoutes from './routes/products.js';
import artisanRoutes from './routes/artisans.js';
import uploadRoutes from './routes/upload.js';
import voiceRoutes from './routes/voice.js';
import serviceRoutes from './routes/services.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure required directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(__dirname, 'uploads', 'videos');
const dataDir = path.join(__dirname, 'data');
const audioDir = path.join(__dirname, 'audio');

await fs.ensureDir(uploadsDir);
await fs.ensureDir(videosDir);
await fs.ensureDir(dataDir);
await fs.ensureDir(audioDir);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration - Must be before other middleware
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving
app.use('/uploads', express.static(uploadsDir));
app.use('/audio', express.static(audioDir));

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/services', serviceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'KalaShetra Backend is running successfully',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KalaShetra API - Empowering Artisans with AI',
    documentation: '/api/health',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'Please upload a smaller image (max 10MB)',
      maxSize: '10MB'
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
    message: 'We encountered an issue processing your request. Please try again.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
    availableRoutes: ['/api/health', '/api/ai', '/api/products', '/api/artisans', '/api/upload', '/api/voice', '/api/services']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎨 KalaShetra Backend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads Directory: ${uploadsDir}`);
  console.log(`🎵 Audio Directory: ${audioDir}`);
});
