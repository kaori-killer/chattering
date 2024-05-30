import React from 'react';

import styled from 'styled-components';

const Input = styled.input`
    width: 150px;
    height: 25px;
`;

const Button = styled.button`
    height: 30px;
    width: 59px;
    background-color: #53BAD1;
    border: none;
    border-radius: 3px;
    margin: 3px;
`;

const Li = styled.li`
    list-style: none;
`;

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
      <hr/>
      <h2>{user}의 채팅방 목록 📝</h2>
  
      <Input
        type="text"
        placeholder="찾을 방"
        value={textField}
        onChange={(e) => setTextField(e.target.value)}
      />
      <Button type="button" onClick={handleSearchRooms}>
        검색
      </Button>
  
      <ul>
        {filteredRooms.map((room, index) => (
          <Li key={index}>
            <span>{room}</span>
            <Button onClick={() => handleEnterRoom(room)}>입장하기</Button>
          </Li>
        ))}
      </ul>
    </div>
    )
  }