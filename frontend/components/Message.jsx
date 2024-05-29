import React from 'react';

export default function Message({ user, text, isOwnMessage }) {



  return( 
    <div className={`message, ${ isOwnMessage ? 'message_item_end' : 'message_item_start'}`}>
      <strong>{user} :</strong>
      <span>{text}</span>
    </div>
  );
}