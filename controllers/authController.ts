import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { generateRandomString } from "../utils/randomGenerator";
import { createDigitalId } from "../utils/digitalId";
import { encrypt } from "../utils/encryption";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Generate digital ID
    const digitalId = createDigitalId();

    // Create new user object
    const newUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      digitalId,
    });

    // Save user to the database
    await newUser.save();

    // Generate token
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);

    // Encrypt digital ID and send response
    const encryptedDigitalId = encrypt(digitalId, req.body.password);
    res.json({ token, digitalId: encryptedDigitalId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    // Encrypt digital ID and send response
    const encryptedDigitalId = encrypt(user.digitalId, req.body.password);
    res.json({ token, digitalId: encryptedDigitalId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
