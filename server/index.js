import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import modelRoutes from "./routes/modelRoutes.js"
dotenv.config();
connectDB();

const app = express();

app.use(cors());
// app.use(cors({
//     origin: 'http://ec2-13-127-98-0.ap-south-1.compute.amazonaws.com:5173',
//     credentials: true
//   }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/transactions', transferRoutes);
app.use('/api/models',modelRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
