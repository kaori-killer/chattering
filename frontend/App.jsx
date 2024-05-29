import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';
  
import ChattingList from './components/ChattingList.jsx';
import UsersList from './components/UsersList.jsx';
import ChangeNameForm from './components/ChangeNameForm.jsx';
import MessageList from './components/MessageList.jsx';
import MessageForm from './components/MessageForm.jsx';

const socket = io.connect();

const ChatApp = ({ room }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
  const [user, setUser] = useState('');

  const filteredMessages = messages.filter((message)=> message.room === room);
  
  useEffect(() => {
    socket.emit('join:room', room);
    
    socket.on('init', initialize);
    socket.on('send:message', messageReceive);
    socket.on('user:join', userJoined);
    socket.on('user:left', userLeft);
    socket.on('change:name', userChangedName);
    
    return () => {
      localStorage.setItem('messages',  JSON.stringify(messages));
      socket.off('init', initialize);
      socket.off('send:message', messageReceive);
      socket.off('user:join', userJoined);
      socket.off('user:left', userLeft);
      socket.off('change:name', userChangedName);
    };
  }, [room]);

  const initialize = (data) => {
    const { users, name } = data;
    setUsers(users);
    setUser(name);
  };

  const messageReceive = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // 신규 등록
  const userJoined = (data) => {
    const { name } = data;
    setUsers((prevUsers) => [...prevUsers, name]);
  };

  const userLeft = (data) => {
    const { name } = data;
    setUsers((prevUsers) => prevUsers.filter((user) => user !== name));
  };

  const userChangedName = (data) => {
    const { oldName, newName } = data;
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user === oldName ? newName : user))
    );
  };

  const handleMessageSubmit = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit('send:message', message);
  };

  // 로그인
  const handleChangeName = (newName) => {
    socket.emit('change:name', { name: newName }, (result) => {
      if (!result) {
        return alert('There was an error changing your name');
      }

      setUsers([...users, newName]);
      setUser(newName);
    });
  };

  return (
    <div className='center'>
      <UsersList users={users} />
      <ChangeNameForm onChangeName={handleChangeName} />
      <MessageList messages={filteredMessages} room={room} user={user} />
      <MessageForm onMessageSubmit={handleMessageSubmit} user={user} room={room} />
    </div>
  );
};

export default function App() {
  const [rooms, setRooms] = useState(JSON.parse(localStorage.getItem('rooms')) || []);
  const [filteredRooms, setFilteredRooms] = useState(JSON.parse(localStorage.getItem('rooms')) || []);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [textField, setTextField] = useState('');

  localStorage.setItem('rooms',  JSON.stringify(rooms));

  const handleSearchRooms = () => {
    const filtered = rooms.filter((room) => room.includes(textField));

    if (filtered.length > 0) {
      setFilteredRooms(filtered);
    } else {
      const createNewRoom = confirm("방을 새로 만드시겠습니까?");
      if (createNewRoom) {
        const newRooms = [...rooms, textField];
        setRooms(newRooms);
        setFilteredRooms([]);
        setSelectedRoom(textField);
      }
    }
  };

  return (
    <div>
      <ChattingList 
        textField={textField} 
        setTextField={setTextField}
        filteredRooms={filteredRooms} 
        handleSearchRooms={handleSearchRooms}
        setSelectedRoom={setSelectedRoom}
      />
      {selectedRoom ? 
        (
          <ChatApp room={selectedRoom} />
        ) : 
        (
          <div>채팅방이 없습니다.</div>
        )}
    </div>
  );
}

