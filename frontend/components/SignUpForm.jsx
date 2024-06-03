import React from 'react';

import ChangeNameForm from './ChangeNameForm.jsx';

export default function LoginForm({ user, onChange, text }) {
    return (
      <div>
      {user ?
        <h3>🎉 어서오세요, {user}님 🎉</h3>
        :
        <ChangeNameForm onChange={onChange} text={text}/>
      }
      </div>
    )
  }