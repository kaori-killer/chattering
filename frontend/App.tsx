import { useState, useEffect } from 'react';

import io from 'socket.io-client';
  
import UsersList from './components/UsersList';
import ChangeNameForm from './components/ChangeNameForm';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

const socket = io.connect();

const ChatApp = ({ room }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');

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
      setUsers((prevUsers) => prevUsers.map((user) => (user === oldName ? newName : user)));
      setUser(newName);
    });
  };


  return (
    <div className='center'>
      <UsersList users={users} />
      <ChangeNameForm onChangeName={handleChangeName} />
      <MessageList messages={messages} />
      <MessageForm onMessageSubmit={handleMessageSubmit} user={user} />
    </div>
  );
};

export default function App() {
  const [room, setRoom] = useState('');
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [rooms, setRooms] = useState([]);

 let filteredRooms = rooms.filter((room) => rooms.includes(room));


  const handleCreateRoom = () => {
    if (room) {
		setRooms((prevRooms) => [...prevRooms, room]);
		setIsRoomSelected(true);
    } else {
      alert('방 이름을 입력하세요.');
    }
  };

  return (
    <div>
        <div>
          <input
            placeholder='찾을 방'
            value={room}
            onChange={(e) => setRoom(e.target.value)}
			/>
          <button onClick={handleCreateRoom}>방 생성</button>
          <h3>방 목록</h3>
          <ul>
            {filteredRooms.map((room, i) => (
				<li key={i} onClick={() => { setRoom(room); setIsRoomSelected(true); }}>
                {room}
              </li>
            ))}
          </ul>
        </div>
		<div>
		{isRoomSelected ? 
    	    <ChatApp room={room} />
			: 
			<div></div>
		}
		</div>
    </div>
  );
}
