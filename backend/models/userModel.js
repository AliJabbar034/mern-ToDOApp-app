import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const user = new mongoose.Schema({
  fName: {
    type: String,
    required: [true, "Name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    validate: [validator.isEmail, "Enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Pass Word is Required"],
    minLength: [6, "Password Length should be greater than 6 characters"],

    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  created_At: {
    type: Date,
    default: Date.now(),
  },
  // otp: {
  //   type: Number,
  // },
  // otp_Expirey: {
  //   type: Date,
  // },
  verified: {
    type: Boolean,
    default: false,
  },
  passReset_Otp: {
    type: Number,
  },
  passReset_Otp_Expirey: {
    type: Date,
  },
});
// user.index(
//   {
//     otp: 1,
//   },
//   {
//     expireAfterSeconds: 0,
//   }
// );

user.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

user.methods.getJwtToken = function () {
  const token = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: Date.now() + process.env.JWT_SECRET_EXPIRATION * 86400000,
  });

  return token;
};

user.methods.checkPassward = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export const User = mongoose.model("User", user);
