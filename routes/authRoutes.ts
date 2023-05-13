import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { generateDigitalID } from '../utils/digitalId';
import { encrypt } from '../utils/encryption';
import { createBackup } from '../utils/cloudBackup';
import { config } from '../config';

const router = express.Router();

// POST /auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const digitalID = generateDigitalID();

      const user = new User({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        digitalID,
      });

      await user.save();

      // Create backup of user data
      const encryptedData = encrypt(JSON.stringify(user), user.privateKey);
      await createBackup(encryptedData);

      const token = jwt.sign({ userId: user.id }, config.jwtSecret);

      return res.status(201).json({ token, user: { name, email, digitalID } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong, please try again later' });
    }
  },
);

// POST /auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.id }, config.jwtSecret);

      return res.json({ token, user: { name: user.name, email: user.email, digitalID: user.digitalID } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong, please try again later' });
    }
  },
);

export default router;
