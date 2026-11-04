import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import { initializeDatabase } from './db.js';
import path from 'path';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4201;

// CORS Configuration
app.use(cors({
  origin: [
    'https://rent-nest.vercel.app',
    'https://rentnest-frontend-qe6j.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Health Check
app.get('/api/ping', (req, res) => {
  res.json({ message: 'RentNest API online' });
});

// Home Route
app.get('/', (req, res) => {
  res.json({
    message: 'RentNest API is running. Use /api/auth or /api/properties.'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
initializeDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`RentNest server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });