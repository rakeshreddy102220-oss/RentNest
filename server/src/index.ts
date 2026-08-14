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

app.use(cors({
  origin: 'https://rentnestx-frontend-qe6j.onrender.com',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/ping', (req, res) => {
  res.json({ message: 'RentNest API online' });
});

app.get('/', (req, res) => {
  res.json({ message: 'RentNest API is running. Use /api/auth or /api/properties.' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`RentNest server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
