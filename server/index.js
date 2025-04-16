import express from 'express';
import userRouter from './routes/userRoute.js';
import snippetRouter from './routes/snippetRoute.js';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();
connectDB();


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user',userRouter)
app.use('/snippet',snippetRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});