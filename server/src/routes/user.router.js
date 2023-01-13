import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post("/register", registerUser).post("/login", loginUser);

export default userRouter;
