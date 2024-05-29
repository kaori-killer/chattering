import React from 'react';

export default function UsersList({ users }) {
  console.log(users);
  
  return(
    <div className='users'>
      <h3> 참여자들 </h3>
      <ul>
        {users.map((user, i) => (
          <li key={i}>
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};