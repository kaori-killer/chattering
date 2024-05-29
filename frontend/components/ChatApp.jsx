import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';
  
import UsersList from './UsersList.jsx';
import MessageList from './MessageList.jsx';
import MessageForm from './MessageForm.jsx';

const socket = io.connect();

const ChatApp = ({ room, users, user }) => {
    const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
  
    const filteredMessages = messages.filter((message)=> message.room === room);
    
    useEffect(() => {
      socket.emit('join:room', room);
      socket.on('send:message', messageReceive);
      
      return () => {
        localStorage.setItem('messages',  JSON.stringify(messages));
        socket.off('send:message', messageReceive);
      };
    }, [room]);
  
    const messageReceive = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    
    const handleMessageSubmit = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit('send:message', message);
    };
  
    return (
      <div className='center'>
        <UsersList users={users} />
        <MessageList messages={filteredMessages} room={room} user={user} />
        <MessageForm onMessageSubmit={handleMessageSubmit} user={user} room={room} />
      </div>
    );
  };
  
  export default ChatApp;