import asyncHandler from "express-async-handler";
import BadRequestError from "../errors/badRequest.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import notFoundError from "../errors/notFound.js";
import UnAuthenticatedError from "../errors/unaunthenticated.js";
import jwt from "jsonwebtoken";
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // if ((!name|| !email ||password))
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
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: false,
  });
  if (user) {
    const { name, id, email, image, contact, bio } = user;
    res
      .status(StatusCodes.CREATED)
      .json({ name, email, id, token, image, contact, bio }); //_id: user.id
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
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: false,
  });
  res.status(StatusCodes.OK).json({ email: checkUsers.email, token });
});

export const loginOutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: false,
  });
  return res.status(StatusCodes.OK).json({ msg: "Successfully logged out" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId);
  if (!user) throw new notFoundError("Unable to get User");

  const { name, id, email, image, contact, bio } = user;

  return res
    .status(StatusCodes.OK)
    .json({ id, name, email, image, contact, bio });
});

export const checkUserStatus = asyncHandler(async (req, res) => {
  const token = await req.cookies.token;
  if (!token) res.json(false);
  const decode = jwt.verify(token, process.env.JWT_SEC);
  if (!decode) res.json(false);
  return res.json(true);
});
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId);
  if (!user) throw new notFoundError("Unable to get User");

  const { name, image, contact, bio } = req.body;
  user.email = user.email;
  user.name = name || user.name;
  user.image = image || user.image;
  user.contact = contact || user.contact;
  user.bio = bio || user.bio;

  const updatedUser = await user.save();
  return res.status(StatusCodes.OK).json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    image: updatedUser.image,
    contact: updatedUser.contact,
    bio: updatedUser.bio,
  });
});

export const updateUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword && !newPassword)
    throw new BadRequestError("Please fill all required field");

  const user = await User.findById(userId);
  if (!user) throw new notFoundError("Unable to get User");

  const checkPassword = await user.comparePassword(oldPassword);
  if (!checkPassword) throw new UnAuthenticatedError("Invalid Password");
  user.password = newPassword;
  console.log(user.password);
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password change successful" });
});
