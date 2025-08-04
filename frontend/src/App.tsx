import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import './App.css';

interface User {
  id: string;
  username: string;
  avatar: string;
  joinedAt: string;
}

interface Message {
  id: string;
  text: string;
  user: User;
  timestamp: string;
  type: string;
}

interface TypingUser {
  userId: string;
  username: string;
  isTyping: boolean;
}

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setIsJoined(false);
    });

    newSocket.on('welcome', (data: { user: User; messages: Message[] }) => {
      setCurrentUser(data.user);
      setMessages(data.messages);
      setIsJoined(true);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('users_update', (usersList: User[]) => {
      setUsers(usersList);
    });

    newSocket.on('user_joined', (user: User) => {
      console.log(`${user.username} joined the chat`);
    });

    newSocket.on('user_left', (user: User) => {
      console.log(`${user.username} left the chat`);
    });

    newSocket.on('user_typing', (data: TypingUser) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.username);
        } else {
          newSet.delete(data.username);
        }
        return newSet;
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && usernameInput.trim()) {
      socket.emit('join', { username: usernameInput.trim() });
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && messageInput.trim()) {
      socket.emit('send_message', { text: messageInput.trim() });
      setMessageInput('');
      
      // Stop typing indicator
      socket.emit('typing_stop');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (socket && isJoined) {
      // Start typing indicator
      socket.emit('typing_start');
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop');
      }, 1000);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isConnected) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className="app">
        <div className="join-form">
          <div className="join-card">
            <h1>💬 Join Chat</h1>
            <form onSubmit={joinChat}>
              <input
                type="text"
                placeholder="Enter your username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                maxLength={20}
                required
              />
              <button type="submit">Join Chat</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Online Users ({users.length})</h3>
          </div>
          <div className="users-list">
            {users.map(user => (
              <div key={user.id} className="user-item">
                <img src={user.avatar} alt={user.username} className="user-avatar" />
                <span className="username">{user.username}</span>
                {user.id === currentUser?.id && <span className="you-badge">You</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <h2>💬 Chat Room</h2>
            <div className="connection-status">
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className="messages-container">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.user.id === currentUser?.id ? 'own-message' : ''}`}
              >
                <img src={message.user.avatar} alt={message.user.username} className="message-avatar" />
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-username">{message.user.username}</span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))}
            
            {typingUsers.size > 0 && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">
                  {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={handleMessageInputChange}
                className="message-input"
                maxLength={500}
              />
              <button type="submit" disabled={!messageInput.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
