import React from "react";
import { User } from "../utils/encryption";

type Props = {
  user: User;
};

const UserListItem: React.FC<Props> = ({ user }) => {
  return (
    <li>
      <span>{user.digitalId}</span>
      <span>{user.name}</span>
      <span>{user.email}</span>
    </li>
  );
};

export default UserListItem;
