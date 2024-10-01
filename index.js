import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import postRoutes from './routes/postRoutes.js';
import paymentSubRoutes from './routes/paymentSubRoutes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


   // Create an HTTP server and bind the Socket.io service to it    
   const server = http.createServer(app);
   const io = new SocketIOServer(server); // Initialize Socket.io

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
app.use('/api/payment', paymentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/payment-sub', paymentSubRoutes);


// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
