import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getMongoConnectionConfig } from './config/db.js';
import apiRouter from './routes/api.js';
import { seedDatabase } from './seed/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req: any, res: any) => {
  res.json({
    message: "🚀 Jeeva's Life OS — Backend API",
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: [
      '/api/health',
      '/api/dashboard',
      '/api/transactions',
      '/api/loans',
      '/api/skills',
      '/api/tasks',
      '/api/fitness',
      '/api/projects',
      '/api/reviews',
      '/api/ideas'
    ]
  });
});

app.use('/api', apiRouter);

// Start server immediately so API is responsive without waiting for DB timeout
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Life OS Backend API running on: http://localhost:${PORT}`);
  console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
  const { uri, dbName } = getMongoConnectionConfig();
  const masked = uri.replace(/:([^:@]+)@/, ':****@');
  console.log(`📦 Configured MongoDB: ${masked} (DB: ${dbName})`);
  console.log(`======================================================\n`);
  
  // Connect to MongoDB asynchronously
  connectDB().then((connected) => {
    if (connected) {
      seedDatabase().catch((err) => console.error('Seed error:', err));
    }
  });
});
