import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import ChattingList from './components/ChattingList.jsx';
import ChangeNameForm from './components/ChangeNameForm.jsx';
import ChatApp from './components/ChatApp.jsx';

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

  console.log(users, usersByRoom);

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
      if (!result) {
        return alert('동일한 아이디가  이미 존재합니다. 다른 아이디로 만들어주세요.');
      }

      setUsers((prevUsers) => [...prevUsers, newName]);
      setUser(newName);
    });
  };

  return (
    <div>
      <div>
        <h1>회원가입 - {user}</h1>
        <ChangeNameForm onChangeName={handleChangeName} />
        <h1>로그인 - {user}</h1>
        <ChangeNameForm onChangeName={handleChangeName} />
      </div>
      <ChattingList 
        textField={textField} 
        setTextField={setTextField}
        filteredRooms={filteredRooms} 
        handleSearchRooms={handleSearchRooms}
        setSelectedRoom={setSelectedRoom}
        setUsersByRoom={setUsersByRoom}
        user={user}
      />
      {selectedRoom ? 
        (
          <ChatApp socket={socket} room={selectedRoom} usersByRoom={usersByRoom} user={user} />
        ) : 
        (
          <div>현재 입장된 채팅방이 없습니다.</div>
        )}
    </div>
  );
}
