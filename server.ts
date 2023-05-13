import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { userRoutes } from './routes/userRoutes';
import { authRoutes } from './routes/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);

// Error handler middleware
app.use(errorHandler);

// Socket.io server setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // handle incoming messages
  socket.on('message', (data) => {
    console.log('received message: ', data);
    io.emit('message', data);
  });
});

httpServer.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
