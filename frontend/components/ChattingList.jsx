import React from 'react';

export default function ChattingList({ textField, setTextField, filteredRooms, handleSearchRooms, setSelectedRoom, user }) {
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
            <button onClick={() => setSelectedRoom(room)}>입장하기</button>
          </li>
        ))}
      </ul>
    </div>
    )
  }