import React, { useState } from 'react';

import styled from 'styled-components';

const Input = styled.input`
    width: 150px;
    height: 25px;
`;

const ChangeNameForm = ({ onChangeName }) => {
    const [newName, setNewName] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onChangeName(newName);
      setNewName('');
    };
  
    return (
      <div className='change_name_form'>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder='입장할 아이디 입력'
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
          />
        </form>
      </div>
    );
  };

  export default ChangeNameForm;