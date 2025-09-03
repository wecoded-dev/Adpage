const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active users and rooms
const users = new Map();
const rooms = new Map();

// Default room
rooms.set('general', {
  id: 'general',
  name: 'General',
  messages: [],
  users: new Set()
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', ({ username, room = 'general' }) => {
    const user = {
      id: socket.id,
      username,
      room
    };
    
    users.set(socket.id, user);
    socket.join(room);
    
    // Add user to room
    if (!rooms.has(room)) {
      rooms.set(room, {
        id: room,
        name: room,
        messages: [],
        users: new Set()
      });
    }
    
    rooms.get(room).users.add(socket.id);
    
    // Notify user joined
    socket.to(room).emit('user_joined', {
      username,
      message: `${username} joined the chat`,
      timestamp: new Date().toISOString()
    });
    
    // Send room data to user
    socket.emit('room_data', {
      room: rooms.get(room),
      users: Array.from(rooms.get(room).users).map(id => users.get(id))
    });
    
    // Send recent messages
    socket.emit('message_history', rooms.get(room).messages);
  });

  // Handle sending messages
  socket.on('send_message', ({ message, room }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const messageData = {
      id: uuidv4(),
      username: user.username,
      message,
      timestamp: new Date().toISOString(),
      room
    };

    // Store message in room
    if (rooms.has(room)) {
      rooms.get(room).messages.push(messageData);
      
      // Keep only last 100 messages
      if (rooms.get(room).messages.length > 100) {
        rooms.get(room).messages = rooms.get(room).messages.slice(-100);
      }
    }

    // Broadcast message to room
    io.to(room).emit('receive_message', messageData);
  });

  // Handle user typing
  socket.on('typing', ({ room, isTyping }) => {
    const user = users.get(socket.id);
    if (!user) return;

    socket.to(room).emit('user_typing', {
      username: user.username,
      isTyping
    });
  });

  // Handle room creation
  socket.on('create_room', ({ roomName }) => {
    const roomId = roomName.toLowerCase().replace(/\s+/g, '-');
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        name: roomName,
        messages: [],
        users: new Set()
      });
    }
    
    socket.emit('room_created', rooms.get(roomId));
  });

  // Handle joining different room
  socket.on('join_room', ({ room }) => {
    const user = users.get(socket.id);
    if (!user) return;

    // Leave current room
    socket.leave(user.room);
    if (rooms.has(user.room)) {
      rooms.get(user.room).users.delete(socket.id);
    }

    // Join new room
    user.room = room;
    socket.join(room);
    
    if (!rooms.has(room)) {
      rooms.set(room, {
        id: room,
        name: room,
        messages: [],
        users: new Set()
      });
    }
    
    rooms.get(room).users.add(socket.id);
    
    // Notify room change
    socket.to(room).emit('user_joined', {
      username: user.username,
      message: `${user.username} joined the chat`,
      timestamp: new Date().toISOString()
    });
    
    // Send room data
    socket.emit('room_data', {
      room: rooms.get(room),
      users: Array.from(rooms.get(room).users).map(id => users.get(id))
    });
    
    socket.emit('message_history', rooms.get(room).messages);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      // Remove from room
      if (rooms.has(user.room)) {
        rooms.get(user.room).users.delete(socket.id);
        
        // Notify others
        socket.to(user.room).emit('user_left', {
          username: user.username,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString()
        });
      }
      
      users.delete(socket.id);
    }
    
    console.log('User disconnected:', socket.id);
  });

  // Get available rooms
  socket.on('get_rooms', () => {
    const roomList = Array.from(rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.size
    }));
    
    socket.emit('rooms_list', roomList);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});