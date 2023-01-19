import { Router } from "express";
import {
  registerUser,
  loginUser,
  logOutUser,
  getCurrentUser,
  checkUserStatus,
  updateUserProfile,
  updateUserPassword,
  forgotPassword,
  resetPassword
} from "../controllers/user.controllers.js";
import { authenticateUser } from "../middleware/auth.js";
const userRouter = Router();

userRouter
  .post("/register", registerUser)
  .post("/login", loginUser)
  .get("/logout", logOutUser)
  .get("/user", authenticateUser, getCurrentUser)
  .get("/dashboard", checkUserStatus)
  .patch("/edit", authenticateUser, updateUserProfile)
  .patch("/edit/password", authenticateUser, updateUserPassword)
  .patch("/forgotpassword", forgotPassword)
  .patch("/resetpassword/:restToken", resetPassword);

export default userRouter;
