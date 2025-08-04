# 💬 Full Stack Chat Application

A modern, real-time chat application built with React, Node.js, Express, and Socket.IO. Features a beautiful UI with real-time messaging, typing indicators, user avatars, and responsive design.

## ✨ Features

- **Real-time messaging** with Socket.IO
- **User authentication** with custom usernames
- **Typing indicators** to show when users are typing
- **Online user list** with avatars
- **Message timestamps** and user identification
- **Responsive design** for mobile and desktop
- **Beautiful modern UI** with smooth animations
- **Auto-generated avatars** using DiceBear API
- **Message history** (last 50 messages on join)
- **Connection status indicator**

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Socket.IO Client** for real-time communication
- **CSS3** with modern styling and animations
- **Responsive design** with mobile-first approach

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time communication
- **CORS** for cross-origin requests
- **UUID** for unique message IDs
- **In-memory storage** (easily replaceable with database)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fullstack-chat-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Alternative: Start servers separately

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
fullstack-chat-app/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.tsx       # Main React component
│   │   ├── App.css       # Styling
│   │   └── ...
│   ├── package.json      # Frontend dependencies
│   └── .env             # Frontend environment variables
├── package.json          # Root package.json with scripts
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend Environment Variables (.env)
```env
REACT_APP_SERVER_URL=http://localhost:5000
```

## 📡 API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/messages` - Retrieve message history

## 🔌 Socket Events

### Client to Server
- `join` - Join the chat room with username
- `send_message` - Send a new message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client
- `welcome` - User successfully joined (with user data and message history)
- `new_message` - New message received
- `users_update` - Updated list of online users
- `user_joined` - New user joined notification
- `user_left` - User left notification
- `user_typing` - Typing indicator updates

## 🎨 Features in Detail

### Real-time Messaging
- Messages are instantly delivered to all connected users
- Message history is maintained in memory
- Each message includes timestamp, user info, and unique ID

### User Management
- Auto-generated avatars using DiceBear API
- Unique user identification
- Online status tracking
- User join/leave notifications

### Typing Indicators
- Shows when users are typing
- Automatic timeout after 1 second of inactivity
- Multiple users typing support

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Collapsible sidebar on mobile

## 🔄 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use a process manager like PM2
3. Set up a reverse proxy (nginx)
4. Use a real database instead of in-memory storage

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve static files with a web server
3. Update `REACT_APP_SERVER_URL` to production backend URL

### Database Integration
The current implementation uses in-memory storage. For production, consider:
- **MongoDB** with Mongoose
- **PostgreSQL** with Sequelize
- **Redis** for session management

## 🛡️ Security Considerations

For production deployment, consider:
- Input validation and sanitization
- Rate limiting
- Authentication and authorization
- HTTPS/WSS connections
- CORS configuration
- Environment variable security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- [ ] User registration and authentication
- [ ] Private messaging
- [ ] File/image sharing
- [ ] Message reactions and emojis
- [ ] Chat rooms/channels
- [ ] Message search
- [ ] Push notifications
- [ ] Database persistence
- [ ] User profiles
- [ ] Message encryption

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Enjoy chatting! 💬✨**