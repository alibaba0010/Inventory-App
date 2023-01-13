import BadRequestError from "../errors/badRequest.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password))
    throw new BadRequestError("Please fill all required field");
  if (password.length < 6)
    throw new BadRequestError("Password must be 6 or more characters");
  const checkEmailExist = await User.findOne({ email });
  if (checkEmailExist) throw new BadRequestError("Email already exists");
  const user = await User.create({ name, email, password });
  if (user) {
    const { name, _id, email, image, contact, bio } = user;
    res.status(StatusCodes.CREATED).json({ name, email, id: user._id }); //_id: user.id
  } else {
    throw new BadRequestError("Invalid User data");
  }
};
