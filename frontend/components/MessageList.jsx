import React from 'react';

import Message from "./Message.jsx";

const MessageList = ({ messages, room }) => (
    <div className='messages'>
      <h2> 채팅방 - {room} </h2>
      {messages.map((message, i) => (
        <Message key={i} user={message.user} text={message.text} />
      ))}
    </div>
  );
  
export default MessageList;