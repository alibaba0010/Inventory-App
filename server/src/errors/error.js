import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();

export async function errorHandler(err, req, res, next) {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, //name: "ali" || process.env.name
    msg: err.message || "Something went wrong try again later",
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  };

  if (err.name === "ValidationError") {
    console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    console.log(customError.msg);
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  return res
    .status(customError.statusCode)
    .json({ msg: customError.msg, stack: customError.stack });
}
