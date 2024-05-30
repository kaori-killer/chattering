import React from 'react';

import ChangeNameForm from './ChangeNameForm.jsx';

export default function LoginForm({ user, handleChangeName }) {
    return (
      <div>
      {user ?
        <h1>어서오세요, {user}님</h1>
        :
        <ChangeNameForm onChangeName={handleChangeName} />
      }
      </div>
    )
  }