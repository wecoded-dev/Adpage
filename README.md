# 💬 Full-Stack Chat Application

A modern, real-time chat application built with React, Node.js, Express, and Socket.IO. Features a beautiful, responsive UI with real-time messaging, multiple chat rooms, typing indicators, and user presence.

![Chat App Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Modern+Chat+App)

## ✨ Features

- **Real-time messaging** with Socket.IO
- **Multiple chat rooms** with room creation
- **User authentication** (username-based)
- **Typing indicators** to see when others are typing
- **User presence** showing online users
- **Message history** with persistent storage
- **Beautiful modern UI** with smooth animations
- **Responsive design** for mobile and desktop
- **System notifications** for user join/leave events

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

3. **Start the application**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000) concurrently.

### Manual Setup

If you prefer to run the servers separately:

1. **Start the backend server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm install
   npm start
   ```

## 🏗️ Project Structure

```
fullstack-chat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main chat application
│   │   ├── App.css        # Styling
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server with Socket.IO
│   └── package.json
├── package.json           # Root package.json with scripts
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React** with TypeScript
- **Socket.IO Client** for real-time communication
- **Lucide React** for beautiful icons
- **CSS3** with modern styling and animations

### Backend
- **Node.js** with Express
- **Socket.IO** for WebSocket communication
- **UUID** for unique message IDs
- **CORS** for cross-origin requests

## 📱 Usage

1. **Join the Chat**
   - Enter your username on the login screen
   - Click "Join Chat" to enter the default "General" room

2. **Send Messages**
   - Type your message in the input field
   - Press Enter or click the send button
   - Messages appear instantly for all users in the room

3. **Switch Rooms**
   - Click on any room in the sidebar to join it
   - Create new rooms using the "+" button

4. **View Online Users**
   - See all users currently online in the sidebar
   - User avatars show the first letter of their username

## 🎨 Features in Detail

### Real-time Messaging
- Messages are delivered instantly using WebSocket connections
- Message history is maintained for each room
- System messages notify when users join or leave

### Room Management
- Default "General" room for all users
- Create custom rooms with unique names
- Switch between rooms seamlessly
- Room-specific message history

### User Experience
- Typing indicators show when others are typing
- Smooth animations and transitions
- Auto-scroll to latest messages
- Responsive design for all screen sizes

### Modern UI
- Beautiful gradient backgrounds
- Card-based design with shadows
- Hover effects and smooth transitions
- Clean, intuitive interface

## 🔧 Configuration

### Environment Variables

You can customize the application by setting these environment variables:

**Server (.env in server directory):**
```env
PORT=5000
```

**Client:**
The client connects to `http://localhost:5000` by default. To change this, modify the socket connection in `client/src/App.tsx`:

```typescript
const newSocket = io('http://your-server-url:port');
```

## 🚀 Deployment

### Backend Deployment
1. Deploy the `server` directory to your preferred hosting service
2. Set the `PORT` environment variable
3. Ensure WebSocket connections are supported

### Frontend Deployment
1. Build the React app: `cd client && npm run build`
2. Deploy the `build` directory to a static hosting service
3. Update the Socket.IO connection URL to your backend server

### Full-Stack Deployment Options
- **Heroku**: Deploy both frontend and backend
- **Vercel**: Frontend with Heroku/Railway for backend
- **Netlify**: Frontend with Heroku/Railway for backend
- **DigitalOcean**: Full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Connection Issues:**
- Ensure both frontend and backend servers are running
- Check that ports 3000 and 5000 are available
- Verify CORS settings in the backend

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure Node.js version is 14 or higher

**Styling Issues:**
- Clear browser cache
- Check for CSS conflicts
- Ensure all CSS files are properly imported

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information
4. Include error messages and steps to reproduce

## 🌟 Acknowledgments

- Socket.IO for real-time communication
- React team for the amazing framework
- Lucide for beautiful icons
- The open-source community for inspiration

---

**Happy Chatting! 💬**