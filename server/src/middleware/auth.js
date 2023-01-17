import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UnauthenticatedError from "../errors/unaunthenticated.js";
import UnAuthorizedError from "../errors/unauthorized.js";

import User from "../models/User.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = await req.cookies.token;
  try {
    if (!token)
      throw new UnauthenticatedError("Please login in to create a token");
    const decode = jwt.verify(token, process.env.JWT_SEC);

    req.user = { userId: decode.userId };
    const user = await User.findById(req.user.userId).select("-password");
// req.user = user
    if (user) {
      next();
    } else {
      throw new UnAuthorizedError("Access Denied");
    }
  } catch (err) {
    throw new UnauthenticatedError("Unable to authorize access");
  }
});
