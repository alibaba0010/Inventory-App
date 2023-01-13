import pkg from "mongoose";
const { Schema, model } = pkg;

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
export default model("User", UserSchema);
