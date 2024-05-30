import React from 'react';

export default function ChattingList({ textField, setTextField, filteredRooms, handleSearchRooms, setSelectedRoom, setUsersByRoom, user, usersByRoom }) {
  const handleEnterRoom = (room) => {
    if(!user){
      return alert('로그인이 필요합니다.');
    }

    setSelectedRoom(room);

    setUsersByRoom((prevUsersByRoom) => {
      if (!prevUsersByRoom[room]) {
        return { ...prevUsersByRoom, [room]: [user] };
      } else if (!prevUsersByRoom[room].includes(user)) {
        return { ...prevUsersByRoom, [room]: [...prevUsersByRoom[room], user] };
      } else {
        return prevUsersByRoom;
      }
    });
  };

    return (
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
            <button onClick={() => handleEnterRoom(room)}>입장하기</button>
          </li>
        ))}
      </ul>
    </div>
    )
  }