import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';

// Detailed environment variable check
console.log('Environment Variables Check:', {
    PORT: process.env.PORT,
    MONGO_USER: process.env.MONGO_USER ? 'exists' : 'missing',
    MONGO_PASS: process.env.MONGO_PASS ? 'exists' : 'missing',
    MONGO_CLUSTER: process.env.MONGO_CLUSTER ? 'exists' : 'missing',
    MONGO_DB: process.env.MONGO_DB ? 'exists' : 'missing',
    JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'missing',
    // Check if .env is being loaded
    NODE_ENV: process.env.NODE_ENV,
    // Check the actual MongoDB URI being constructed
    MONGODB_URI: process.env.MONGO_USER && process.env.MONGO_PASS && process.env.MONGO_CLUSTER && process.env.MONGO_DB 
        ? `mongodb+srv://${process.env.MONGO_USER}:****@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}`
        : 'incomplete'
});

import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use('/api/tasks', taskRouter);

app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
