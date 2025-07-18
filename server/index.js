import express from 'express';
import userRouter from './routes/userRoute.js';
import snippetRouter from './routes/snippetRoute.js';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'


dotenv.config();

const app = express();
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8000',
  credentials: true,
}));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user',userRouter)
app.use('/snippets',snippetRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});