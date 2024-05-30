import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import styled from 'styled-components';

import ChattingList from './components/ChattingList.jsx';
import ChatApp from './components/ChatApp.jsx';
import LoginForm from './components/LoginForm.jsx';

export default function App() {
  const socketRef = useRef();
  if (!socketRef.current) {
    socketRef.current = io.connect();
  }
  const socket = socketRef.current;

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState('');

  const [rooms, setRooms] = useState(JSON.parse(localStorage.getItem('rooms')) || []);
  const [usersByRoom, setUsersByRoom] = useState(JSON.parse(localStorage.getItem('usersByRoom')) || {});

  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [textField, setTextField] = useState('');

  const ErrorMessage = styled.p`
    color: red;
 `;

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
    localStorage.setItem('usersByRoom', JSON.stringify(usersByRoom));
  }, [rooms, usersByRoom]);

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

        if(!Object.keys(usersByRoom).includes(textField)){
          setUsersByRoom({...usersByRoom, [textField]: [user]});
        }
      }
    }
  };

  const handleChangeName = (newName) => {
    socket.emit('change:name', { name: newName }, (result) => {
      if(!newName){
        return alert('아이디는 최소 1글자 이상으로 만들어주세요.');
      }
      if (!result) {
        return alert('동일한 아이디가 이미 존재합니다. 다른 아이디로 만들어주세요.');
      }

      setUsers((prevUsers) => [...prevUsers, newName]);
      setUser(newName);
    });
  };

  return (
    <div>
      <h1>인천대 채팅 애플리케이션 💬</h1>
      <LoginForm user={user} handleChangeName={handleChangeName} />
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
            <hr/>
            <ErrorMessage>현재 입장된 채팅방이 없습니다.</ErrorMessage>
          </div>
        )}
    </div>
  );
}
