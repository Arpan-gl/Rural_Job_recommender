import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import recommenderRoutes from './routes/recommender.routes.js';

dotenv.config({
    path:"./.env"
});

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], // Vite's default ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/recommender', recommenderRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});