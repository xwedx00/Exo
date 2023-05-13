import express from 'express';
import { messageController } from '../controllers/messageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Get all messages
router.get('/', authMiddleware, messageController.getAllMessages);

// Get messages between two users
router.get('/:userId', authMiddleware, messageController.getMessagesWithUser);

// Send message
router.post('/:userId', authMiddleware, messageController.sendMessage);

export { router as messageRoutes };
