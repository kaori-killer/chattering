import React, { useState } from 'react';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
    width: 50%;
    height: 25px;
    margin-left: 25%;
    margin-top: 5px;
`;

const Button = styled.button`
    height: 30px;
    width: 130px;
    background-color: #53BAD1;
    border: none;
    border-radius: 3px;
    margin: 7px;
`;


const ChangeNameForm = ({ onChange, text }) => {
    const [newName, setNewName] = useState('');
    const [newPassword, setPassword] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onChange(newName, newPassword);
      setNewName('');
      setPassword('');
    };
  
    return (
      <div className='change_name_form'>
        <form onSubmit={handleSubmit}>
          <Container>
            <Input
              type="text"
              placeholder='아이디 입력'
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
            />
            <Input
              type="password"
              placeholder='비밀번호 입력'
              onChange={(e) => setPassword(e.target.value)}
              value={newPassword}
            />
          </Container>
            <div>
              <Button>{text}</Button>
            </div>
        </form>
      </div>
    );
  };

  export default ChangeNameForm;