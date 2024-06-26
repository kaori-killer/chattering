import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';
  
import UsersList from './UsersList.jsx';
import MessageList from './MessageList.jsx';
import MessageForm from './MessageForm.jsx';

const socket = io.connect();

const ChatApp = ({ room, usersByRoom, user }) => {
    const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
  
    const filteredMessages = messages.filter((message)=> message.room === room);
    
    useEffect(() => {
      socket.emit('join:room', room);
      socket.on('send:message', messageReceive);

      localStorage.setItem('messages',  JSON.stringify(messages));
      
      return () => {
        socket.off('send:message', messageReceive);
      };
    }, [messages]);
  
    const messageReceive = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    
    const handleMessageSubmit = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit('send:message', message);
    };
  
    return (
      <div className='center'>
        <UsersList users={usersByRoom[room]} />
        <MessageList messages={filteredMessages} room={room} user={user} />
        <MessageForm onMessageSubmit={handleMessageSubmit} user={user} room={room} />
      </div>
    );
  };
  
  export default ChatApp;