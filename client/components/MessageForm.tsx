import React, { useState } from 'react';
import { sendMessage } from '../utils/socket';
import { encryptMessage } from '../utils/encryption';

interface Props {
  senderName: string;
  receiverId: string;
}

const MessageForm: React.FC<Props> = ({ senderName, receiverId }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encryptedMessage = encryptMessage(message);
    sendMessage(senderName, receiverId, encryptedMessage);
    setMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={handleChange}
        placeholder="Type your message here"
        required
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;
