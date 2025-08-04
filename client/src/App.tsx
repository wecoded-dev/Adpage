import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Send, Users, Hash, Plus, Settings } from 'lucide-react';
import './App.css';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  room: string;
}

interface Room {
  id: string;
  name: string;
  userCount?: number;
}

interface User {
  id: string;
  username: string;
  room: string;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('receive_message', (messageData: Message) => {
      setMessages(prev => [...prev, messageData]);
    });

    newSocket.on('message_history', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('user_joined', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        username: 'System',
        message: data.message,
        timestamp: data.timestamp,
        room: currentRoom
      }]);
    });

    newSocket.on('user_left', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        username: 'System',
        message: data.message,
        timestamp: data.timestamp,
        room: currentRoom
      }]);
    });

    newSocket.on('room_data', (data) => {
      setUsers(data.users);
    });

    newSocket.on('rooms_list', (roomList: Room[]) => {
      setRooms(roomList);
    });

    newSocket.on('room_created', (room: Room) => {
      setRooms(prev => [...prev, room]);
      joinRoom(room.id);
    });

    newSocket.on('user_typing', ({ username, isTyping }) => {
      if (isTyping) {
        setTypingUsers(prev => [...prev.filter(u => u !== username), username]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== username));
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && socket) {
      socket.emit('join', { username: username.trim(), room: currentRoom });
      socket.emit('get_rooms');
      setIsJoined(true);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('send_message', { message: message.trim(), room: currentRoom });
      setMessage('');
      handleTyping(false);
    }
  };

  const joinRoom = (roomId: string) => {
    if (socket && roomId !== currentRoom) {
      socket.emit('join_room', { room: roomId });
      setCurrentRoom(roomId);
      setMessages([]);
    }
  };

  const createRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && socket) {
      socket.emit('create_room', { roomName: newRoomName.trim() });
      setNewRoomName('');
      setShowNewRoomModal(false);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (socket) {
      socket.emit('typing', { room: currentRoom, isTyping: typing });
      setIsTyping(typing);
      
      if (typing) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          handleTyping(false);
        }, 3000);
      }
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!isTyping) {
      handleTyping(true);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isJoined) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>💬 ChatApp</h1>
            <p>Join the conversation</p>
          </div>
          <form onSubmit={joinChat} className="login-form">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
              required
            />
            <button type="submit" className="join-btn">
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>💬 ChatApp</h2>
          <div className="user-info">
            <span className="username">@{username}</span>
          </div>
        </div>
        
        <div className="rooms-section">
          <div className="section-header">
            <Hash size={16} />
            <span>Rooms</span>
            <button 
              className="add-room-btn"
              onClick={() => setShowNewRoomModal(true)}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="rooms-list">
            {rooms.map(room => (
              <div
                key={room.id}
                className={`room-item ${currentRoom === room.id ? 'active' : ''}`}
                onClick={() => joinRoom(room.id)}
              >
                <Hash size={14} />
                <span>{room.name}</span>
                {room.userCount && (
                  <span className="user-count">{room.userCount}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="users-section">
          <div className="section-header">
            <Users size={16} />
            <span>Online ({users.length})</span>
          </div>
          <div className="users-list">
            {users.map(user => (
              <div key={user.id} className="user-item">
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="main-chat">
        <div className="chat-header">
          <div className="room-info">
            <Hash size={20} />
            <h3>{rooms.find(r => r.id === currentRoom)?.name || currentRoom}</h3>
          </div>
          <div className="chat-actions">
            <button className="action-btn">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.username === 'System' ? 'system-message' : ''}`}>
              {msg.username !== 'System' && (
                <div className="message-avatar">
                  {msg.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="message-content">
                <div className="message-header">
                  <span className="message-username">{msg.username}</span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-text">{msg.message}</div>
              </div>
            </div>
          ))}
          
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="message-form">
          <input
            type="text"
            placeholder={`Message #${rooms.find(r => r.id === currentRoom)?.name || currentRoom}`}
            value={message}
            onChange={handleMessageChange}
            className="message-input"
          />
          <button type="submit" className="send-btn" disabled={!message.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* New Room Modal */}
      {showNewRoomModal && (
        <div className="modal-overlay" onClick={() => setShowNewRoomModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Room</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNewRoomModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={createRoom} className="modal-form">
              <input
                type="text"
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="room-name-input"
                required
                autoFocus
              />
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowNewRoomModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
