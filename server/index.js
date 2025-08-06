import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import sanitizeHtml from 'sanitize-html';
import Chat from './models/Chat.js';

dotenv.config();
mongoose.connect(process.env.MONGO_URI);
const app = express();
const server = http.createServer(app);

// CORS setup
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100
});
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('Mongo Error:', err));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ username, role }) => {
    socket.join('chatroom');
    const joinMsg = {
      user: 'System',
      text: `${sanitizeHtml(username)} (${sanitizeHtml(role)}) joined the chat`,
      time: new Date().toLocaleTimeString()
    };
    io.to('chatroom').emit('chatMessage', joinMsg);
  });

  socket.on('chatMessage', async (msg) => {
    const cleanMsg = {
      user: sanitizeHtml(msg.user),
      text: sanitizeHtml(msg.text),
      time: new Date().toLocaleTimeString()
    };
    await Chat.create(cleanMsg);
    io.to('chatroom').emit('chatMessage', cleanMsg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/api/messages', async (req, res) => {
  const messages = await Chat.find().limit(100);
  res.json(messages);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));