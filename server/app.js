import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import { connectDB } from './db/index.js';
import { config } from 'dotenv';
config({path: './.env'});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5173', 'https://task-assign-gamma.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());
app.use(cookieParser());


connectDB();

import userRouter from './router/user.routes.js';
import taskRouter from './router/task.routes.js';

app.use('/user', userRouter);
app.use('/tasks', taskRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));