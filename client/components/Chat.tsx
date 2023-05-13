import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { GunDB } from '../utils/gunSetup';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import { DigitalID } from '../utils/digitalId';
import { socket } from '../utils/socket';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
}

interface Props {
  user: DigitalID;
}

const Chat: React.FC<Props> = ({ user }) => {
  const history = useHistory();
  const [recipient, setRecipient] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [gun, setGun] = useState<GunDB | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const recipientRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      history.push('/login');
    } else {
      const gun = GunDB();
      setGun(gun);

      gun.on('auth', () => {
        if (!gun.user().is) {
          history.push('/login');
        }
      });

      gun.on('online', () => setIsOnline(true));
      gun.on('offline', () => setIsOnline(false));
    }
  }, [user, history]);

  useEffect(() => {
    if (gun && recipient) {
      const chat = gun.user(recipient);
      const messageListener = chat.get('messages').map().on((data, key) => {
        const decrypted = decryptMessage(data.content, user.privateKey);
        setMessages((messages) =>
          messages.concat({
            id: key,
            sender: data.sender,
            recipient: data.recipient,
            content: decrypted,
            timestamp: data.timestamp,
          })
        );
      });

      return () => {
        chat.get('messages').map().off();
        messageListener.off();
      };
    }
  }, [gun, user, recipient]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (gun && recipient && message) {
      const encrypted = encryptMessage(message, recipient, user.privateKey);
      const timestamp = Date.now();

      const messageData = {
        sender: user.publicKey,
        recipient: recipient,
        content: encrypted,
        timestamp: timestamp,
      };

      const messageId = gun
        .user()
        .get('messages')
        .set(messageData, null, { opt: { pin: false } });

      socket.emit('message', {
        recipient: recipient,
        messageId: messageId,
        senderPublicKey: user.publicKey,
      });

      setMessage('');
    }
  };

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSignOut = () => {
    if (gun) {
      gun.user().leave();
    }
  };

  const renderMessage = (message: Message) => {
    const className = message.sender === user.publicKey ? 'sent' : 'received';
    return (
      <div className={`message ${className}`} key={message.id}>
        <span>{message.content}</span>
      </div>
    );
  };


const handleGunOffline = () => {
    if (gun) {
      gun.get('offline').put({ status: true });
      console.log('App is offline');
    }
  };

  const handleGunOnline = () => {
    if (gun) {
      gun.get('offline').put({ status: false });
      console.log('App is online');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const messages = await getMessages();
        setMessages(messages);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (gun) {
      gun.on('auth', () => {
        console.log('User authenticated with Gun');
        setAuthenticated(true);
      });

      gun.on('disconnect', () => {
        handleGunOffline();
      });

      gun.on('out', () => {
        handleGunOnline();
      });

      gun.on('hi', peer => {
        console.log('Peer connected:', peer);
      });

      gun.on('bye', peer => {
        console.log('Peer disconnected:', peer);
      });

      gun.get('messages').on(message => {
        if (message && message.id && message.content && message.sender) {
          console.log('New message received:', message);
          setMessages(prevState => [...prevState, message]);
        }
      });
    }

    return () => {
      if (gun) {
        gun.off();
      }
    };
  }, [gun]);

  const handleSendMessage = async (message: string) => {
    try {
      const encryptedMessage = await encryptMessage(message, user.publicKey);
      const newMessage: Message = {
        id: uuidv4(),
        content: encryptedMessage,
        sender: user.publicKey,
        receiver: receiver?.publicKey,
        timestamp: new Date().toISOString(),
      };
      if (gun) {
        gun.get('messages').set(newMessage);
      }
      setMessages(prevState => [...prevState, newMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <UserList users={users} setUser={setReceiver} selectedUser={receiver} />
      </div>
      <div className="chat-messages">
        {loading ? (
          <div className="loading">
            <CircularProgress />
          </div>
        ) : (
          messages.map(renderMessage)
        )}
      </div>
      {authenticated && receiver && (
        <MessageForm sender={user.publicKey} receiver={receiver.publicKey} sendMessage={handleSendMessage} />
      )}
    </div>
  );
};

export default Chat;
