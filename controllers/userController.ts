import { Request, Response } from "express";
import { User } from "../models/user";
import { encrypt, decrypt } from "../utils/encryption";
import { generateKeyPair } from "../utils/keyManagement";

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, email } = req.body;

    // Generate a keypair for the user
    const { publicKey, privateKey } = await generateKeyPair();

    // Encrypt the private key with the user's password
    const encryptedPrivateKey = await encrypt(privateKey, password);

    // Create a new user with the encrypted private key
    const user = new User({
      username,
      password,
      fullName,
      email,
      publicKey,
      encryptedPrivateKey,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while registering the user" });
  }
};

// Get a user's public key by their username
export const getUserPublicKey = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ publicKey: user.publicKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while getting the user's public key" });
  }
};
