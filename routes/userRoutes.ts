import express from "express";
import UserController from "../controllers/userController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser, UserController.getUsers);

router.get("/:userId", authenticateUser, UserController.getUserById);

router.post("/", UserController.createUser);

router.put("/:userId", authenticateUser, UserController.updateUserById);

router.delete("/:userId", authenticateUser, UserController.deleteUserById);

export default router;
