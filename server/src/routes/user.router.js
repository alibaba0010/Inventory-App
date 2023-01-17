import { Router } from "express";
import {
  registerUser, 
  loginUser,
  loginOutUser,
  getCurrentUser,
  checkUserStatus,
  updateUserProfile
} from "../controllers/user.controllers.js";
import { authenticateUser } from "../middleware/auth.js";
const userRouter = Router();

userRouter
  .post("/register", registerUser)
  .post("/login", loginUser)
  .get("/logout", loginOutUser)
  .get("/user",authenticateUser, getCurrentUser)
  .get("/dashboard", checkUserStatus)
  .patch("/edit ", authenticateUser, updateUserProfile)

export default userRouter;
