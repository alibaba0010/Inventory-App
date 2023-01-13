import pkg from "mongoose";
const { Schema, model } = pkg;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: [true, "Email already in use"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: [6, "Password must be up to 6 characters"],
    },
    image: {
      type: String,
      required: [true, "Please provide password"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    contact: {
      type: String,
    },
    bio: {
      type: String,
      minlength: [100, "Bio must not be more than 100 characters"],
    },
  },
  { timestamps: true }
);

// To hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next(); //{}
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  //next()
});

UserSchema.methods.createJWT = async function () {
  const signInToken = jwt.sign(
    { userId: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SEC,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  // const redisStorage = await redisClient.set(signInToken, id);

  return signInToken;
  // return { signInToken, redisStorage };
};
export default model("User", UserSchema);
