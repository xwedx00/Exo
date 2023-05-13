import { GunSetup } from './utils/gunSetup';
import { GunOffline } from './utils/gunOffline';
import { DigitalId } from './utils/digitalId';
import { Socket } from './utils/socket';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Chat } from './components/Chat';

// Initialize Gun and create the user's DigitalID
const gunSetup = new GunSetup();
const digitalId = new DigitalId();

// Initialize Socket
const socket = new Socket();

// Initialize components
const login = new Login(socket);
const register = new Register(socket, gunSetup);
const chat = new Chat(gunSetup, digitalId);

// Initialize GunOffline
const gunOffline = new GunOffline(gunSetup, digitalId, socket);

// Start the app
const startApp = () => {
  login.render();
  register.render();
  chat.render();
  gunOffline.start();
};

// Check if the user is already authenticated
socket.emit('checkAuth', (isAuthenticated: boolean) => {
  if (isAuthenticated) {
    startApp();
  } else {
    login.render();
  }
});

// Handle authentication events
socket.on('authenticated', () => {
  startApp();
});

socket.on('unauthorized', () => {
  login.render();
});
