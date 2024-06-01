import React from 'react';

import Message from "./Message.jsx";

const MessageList = ({ messages, room, user }) => (
    <div className='messages'>
      <h2> ⭐️ {room} ⭐️</h2>
      <div className='message_list'>
        {messages.map((message, i) => (
          <Message key={i} user={message.user} text={message.text} isOwnMessage={user === message.user} />
        ))}
      </div>
    </div>
  );
  
export default MessageList;