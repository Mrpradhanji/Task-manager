import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detailed environment variable check
console.log('Environment Variables Check:', {
    PORT: process.env.PORT,
    MONGO_USER: process.env.MONGO_USER ? 'exists' : 'missing',
    MONGO_PASS: process.env.MONGO_PASS ? 'exists' : 'missing',
    MONGO_CLUSTER: process.env.MONGO_CLUSTER ? 'exists' : 'missing',
    MONGO_DB: process.env.MONGO_DB ? 'exists' : 'missing',
    JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'missing',
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGO_USER && process.env.MONGO_PASS && process.env.MONGO_CLUSTER && process.env.MONGO_DB 
        ? `mongodb+srv://${process.env.MONGO_USER}:****@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}`
        : 'incomplete'
});

import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://task-manager-4-kf4p.onrender.com',
    'https://task-manager-pearl-six-74.vercel.app',
    'https://task-manager-kappa-woad.vercel.app',
    'https://task-manager-3-37o6.vercel.app',
    'https://task-manager.vercel.app',
    'https://task-manager-git-main.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Database Connection
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use('/api/auth', userRouter);
app.use('/api/tasks', taskRouter);

app.get('/', (req, res) => {
    res.send('API Working');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
    console.log('Uploads directory:', uploadsPath);
});
