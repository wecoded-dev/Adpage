const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
let messages = [];
let users = new Map();
let typingUsers = new Set();

// API Routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user join
  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username || `User_${socket.id.slice(0, 6)}`,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${socket.id}`,
      joinedAt: new Date().toISOString()
    };
    
    users.set(socket.id, user);
    
    // Send welcome message
    socket.emit('welcome', {
      user,
      messages: messages.slice(-50) // Send last 50 messages
    });
    
    // Broadcast user joined to others
    socket.broadcast.emit('user_joined', user);
    
    // Send updated user list to all clients
    io.emit('users_update', Array.from(users.values()));
    
    console.log(`${user.username} joined the chat`);
  });

  // Handle new message
  socket.on('send_message', (messageData) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: uuidv4(),
      text: messageData.text,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    messages.push(message);
    
    // Keep only last 1000 messages in memory
    if (messages.length > 1000) {
      messages = messages.slice(-1000);
    }

    // Broadcast message to all clients
    io.emit('new_message', message);
    
    console.log(`Message from ${user.username}: ${message.text}`);
  });

  // Handle typing indicators
  socket.on('typing_start', () => {
    const user = users.get(socket.id);
    if (!user) return;
    
    typingUsers.add(socket.id);
    socket.broadcast.emit('user_typing', {
      userId: socket.id,
      username: user.username,
      isTyping: true
    });
  });

  socket.on('typing_stop', () => {
    const user = users.get(socket.id);
    if (!user) return;
    
    typingUsers.delete(socket.id);
    socket.broadcast.emit('user_typing', {
      userId: socket.id,
      username: user.username,
      isTyping: false
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`${user.username} disconnected`);
      
      // Remove user from typing users
      typingUsers.delete(socket.id);
      
      // Remove user from users list
      users.delete(socket.id);
      
      // Broadcast user left to others
      socket.broadcast.emit('user_left', user);
      
      // Send updated user list to all clients
      io.emit('users_update', Array.from(users.values()));
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
});