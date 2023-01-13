import asyncHandler from "express-async-handler";
import BadRequestError from "../errors/badRequest.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import UnAuthenticatedError from "../errors/unaunthenticated.js"

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password))
    throw new BadRequestError("Please fill all required field");
  if (password.length < 6)
    throw new BadRequestError("Password must be 6 or more characters");
  const checkEmailExist = await User.findOne({ email });
  if (checkEmailExist) throw new BadRequestError("Email already exists");

  const user = await User.create({ name, email, password });

  const token = await user.createJWT();

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { name, _id, email, image, contact, bio } = user;
    res.status(StatusCodes.CREATED).json({ name, email, id: user._id, token }); //_id: user.id
  } else {
    throw new BadRequestError("Invalid User data");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password))
    throw new BadRequestError("Please fill all required field");
  const checkUsers = await User.findOne({ email });
  if (!checkUsers) throw new UnAuthenticatedError("Invalid Credentials");

  const checkPassword = await checkUsers.comparePassword(password);
  if (!checkPassword) throw new UnAuthenticatedError("Invalid Password");

  const token = await checkUsers.createJWT();

  res.status(StatusCodes.OK).json({ email: checkUsers.email, token });
});
