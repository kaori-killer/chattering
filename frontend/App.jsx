import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';
  
import UsersList from './components/UsersList.jsx';
import ChangeNameForm from './components/ChangeNameForm.jsx';
import MessageList from './components/MessageList.jsx';
import MessageForm from './components/MessageForm.jsx';

const socket = io.connect();

const ChatApp = ({ room }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
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

  const handleChangeName = (newName) => {
    const oldName = user;
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
      <MessageList messages={filteredMessages} room={room} />
      <MessageForm onMessageSubmit={handleMessageSubmit} user={user} room={room} />
    </div>
  );
};

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [textField, setTextField] = useState('');

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
      <div>
        <h1>채팅방 목록</h1>

        <input
          type="text"
          placeholder="찾을 방"
          value={textField}
          onChange={(e) => setTextField(e.target.value)}
        />
        <button type="button" onClick={handleSearchRooms}>
          검색
        </button>

        <ul>
          {filteredRooms.map((room, index) => (
            <li key={index}>
              <span>{room}</span>
              <button onClick={() => setSelectedRoom(room)}>입장하기</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {selectedRoom ? (
          <ChatApp room={selectedRoom} />
        ) : (
          <div>채팅방을 선택해주세요</div>
        )}
      </div>
    </div>
  );
}