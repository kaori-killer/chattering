import React from 'react';

import styled from 'styled-components';

const Ul = styled.ul`
  padding: 8px;
`;
export default function UsersList({ users }) {
  return(
    <div className='users'>
      <h3> 참여자들 </h3>
      <Ul>
        {users.map((user, i) => (
          <li key={i}>
            {user}
          </li>
        ))}
      </Ul>
    </div>
  );
};