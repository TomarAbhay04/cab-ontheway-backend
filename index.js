import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userSubRoutes from './routes/userSubRoutes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server and Socket.IO setup
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',  // Allow all origins (you can restrict this to your frontend's origin)
  }
});

// Middleware to attach `io` to the `req` object
app.use((req, res, next) => {
    req.io = io;  // Attach Socket.IO instance to request
    next();
  });
   
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected…'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process if database connection fails
    });

// Define API routes


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle basic root request
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// cabonway

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/payment-sub', userSubRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;


