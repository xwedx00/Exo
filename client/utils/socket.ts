import io from 'socket.io-client';
import Gun from 'gun';
import GunSEA from 'gun/sea';
import { gun, getUserKeyPair } from './gunSetup';
import { encryptMessage, decryptMessage } from './encryption';

const socketUrl = process.env.SOCKET_URL || 'http://localhost:3001';
const socket = io(socketUrl);

socket.on('connect', () => {
  console.log('Connected to server through socket');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server through socket');
});

// Send a message over socket
export const sendMessage = async (message: string, recipient: string) => {
  const senderKeyPair = getUserKeyPair();
  const encryptedMessage = await encryptMessage(message, senderKeyPair, recipient);
  socket.emit('message', { encryptedMessage, recipient });
};

// Listen for incoming messages over socket
export const receiveMessage = async (cb: (message: string, sender: string) => void) => {
  socket.on('message', async ({ encryptedMessage, sender }) => {
    const recipientKeyPair = getUserKeyPair();
    const decryptedMessage = await decryptMessage(encryptedMessage, recipientKeyPair, sender);
    cb(decryptedMessage, sender);
  });
};

// Register the user's public key with the socket server for peer discovery
export const registerPublicKey = () => {
  const user = gun.user();
  const { pub } = user.pair();
  socket.emit('publicKey', pub);
};

// Discover other users' public keys through the socket server
export const discoverPublicKeys = (cb: (publicKeys: string[]) => void) => {
  socket.emit('discoverPublicKeys');
  socket.on('publicKeys', cb);
};

// Get the user's Digital ID from the socket server
export const getDigitalId = async (): Promise<string> => {
  const user = gun.user();
  const { pub } = user.pair();
  const { epriv } = await GunSEA.pair();
  return new Promise((resolve) => {
    socket.emit('getDigitalId', { pub, epriv }, (digitalId: string) => {
      resolve(digitalId);
    });
  });
};
