import { Request, Response } from "express";
import { encryptMessage, decryptMessage } from "../utils/encryption";
import { sendMessage, getMessages } from "../utils/gunSetup";
import { User } from "../models/user";

export const postMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(400).json({ error: "Invalid sender or receiver" });
    }

    const encryptedMessage = await encryptMessage(message, receiver.publicKey);
    const decryptedMessage = await decryptMessage(encryptedMessage, sender.privateKey);

    const result = await sendMessage(sender.digitalId, receiver.digitalId, encryptedMessage);

    return res.status(200).json({ message: decryptedMessage, result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getMessagesByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    const messages = await getMessages(userId);

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};
