import React, { useState, useEffect } from 'react';
import { GunDB } from '../utils/gunSetup';
import { decryptMessage } from '../utils/encryption';
import { Message } from '../types';

interface Props {
  digitalId: string;
}

const MessageList: React.FC<Props> = ({ digitalId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Set up GunDB and subscribe to messages for this user
    const gun = GunDB();
    const userMessages = gun.get('users').get(digitalId).get('messages');

    userMessages.on((message: any, messageId: string) => {
      // Decrypt message and add it to state
      const decryptedMessage = decryptMessage(message, userMessages);
      setMessages((prevMessages) => [...prevMessages, decryptedMessage]);
    });

    // Unsubscribe on component unmount
    return () => {
      userMessages.off();
    };
  }, [digitalId]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.text}</p>
          <p>From: {message.senderDigitalId}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
