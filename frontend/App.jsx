import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

import ChattingList from './components/ChattingList.jsx';
import ChatApp from './components/ChatApp.jsx';
import LoginForm from './components/LoginForm.jsx';
import SignUpForm from './components/SignUpForm.jsx';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const ErrorMessage = styled.p`
  width: 500px;
  height: 400px;
  color: red;
`;

const ButtonLink = styled.button`
  height: 30px;
  width: 130px;
  border: none;
  border-radius: 3px;
  background-color: transparent;
  margin: 7px;
`;

export default function App() {
  const socketRef = useRef();
  if (!socketRef.current) {
    socketRef.current = io.connect();
  }
  const socket = socketRef.current;

  const [userList, setUserList] = useState(JSON.parse(localStorage.getItem('userList')) || {});
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState('');

  const [rooms, setRooms] = useState(JSON.parse(localStorage.getItem('rooms')) || []);
  const [usersByRoom, setUsersByRoom] = useState(JSON.parse(localStorage.getItem('usersByRoom')) || {});

  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [textField, setTextField] = useState('');

  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
    localStorage.setItem('usersByRoom', JSON.stringify(usersByRoom));
    localStorage.setItem('userList', JSON.stringify(userList));
  }, [rooms, usersByRoom, userList]);

  const userChangedName = (data) => {
    const { oldName, newName } = data;

    setUsers((prevUsers) =>
      prevUsers.map((user) => (user === oldName ? newName : user))
    );
  };

  useEffect(() => {
    socket.on('change:name', userChangedName);

    return () => {
      socket.off('change:name', userChangedName);
    };
  }, [socket]);

  const handleSearchRooms = () => {
    const filtered = rooms.filter((room) => room.includes(textField));

    if (filtered.length > 0) {
      setFilteredRooms(filtered);
    } else {
      const createNewRoom = window.confirm("방을 새로 만드시겠습니까?");
      if (createNewRoom) {
        const newRooms = [...rooms, textField];
        setRooms(newRooms);
        setFilteredRooms([]);
        setSelectedRoom(textField);

        if (!Object.keys(usersByRoom).includes(textField)) {
          setUsersByRoom({ ...usersByRoom, [textField]: [user] });
        }
      }
    }
  };

  const handleLogin = (newName, newPassword) => {
    if (userList[newName] && userList[newName] === newPassword) {
      setUser(newName);
    } else {
      alert("유효하지 않은 아이디 혹은 비밀번호입니다.");
    }
  };

  const handleSignUp = (newName, newPassword) => {
    console.log(userList);
    if (!userList[newName]) {
      const updatedUserList = { ...userList, [newName]: newPassword };
      setUserList(updatedUserList);
      setIsLogin(true);
    } else {
      alert("이미 존재하는 계정입니다.");
    }
  };

  return (
    <div>
      <h1>인천대 채팅 애플리케이션 💬</h1>
      {isLogin ? 
        <LoginForm user={user} onChange={handleLogin} text="로그인" />
        :  
        <SignUpForm user={user} onChange={handleSignUp} text="회원가입" />
      }
      {!user ? 
        <div>
          <ButtonLink onClick={() => setIsLogin(false)}>회원가입으로 이동</ButtonLink>
          <ButtonLink onClick={() => setIsLogin(true)}>로그인으로 이동</ButtonLink>
        </div>
        :
        <br/>
      }
      <Container>
        {user ?
          <ChattingList 
            textField={textField} 
            setTextField={setTextField}
            filteredRooms={filteredRooms} 
            handleSearchRooms={handleSearchRooms}
            setSelectedRoom={setSelectedRoom}
            setUsersByRoom={setUsersByRoom}
            user={user}
          />
          :
            <br/>
        }
        {selectedRoom ? 
          (
            <ChatApp socket={socket} room={selectedRoom} usersByRoom={usersByRoom} user={user} />
          ) : 
          (
            <div>
              <ErrorMessage>현재 입장된 채팅방이 없습니다.</ErrorMessage>
            </div>
          )}
      </Container>
    </div>
  );
}
