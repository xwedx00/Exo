import React from 'react';
import UserListItem from './UserListItem';
import { User } from '../utils/encryption';
import { getDigitalId } from '../utils/digitalId';
import { useStore } from '../utils/store';

interface Props {
  users: User[];
}

const UserList: React.FC<Props> = ({ users }) => {
  const currentUser = useStore(state => state.currentUser);

  return (
    <div>
      <h2>Users</h2>
      {users.map(user => {
        if (user.digitalId === getDigitalId(currentUser)) {
          return null;
        }
        return <UserListItem key={user.id} user={user} />;
      })}
    </div>
  );
};

export default UserList;
