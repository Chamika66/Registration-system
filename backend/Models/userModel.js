const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  role: {
    type: String,
    enum: ["admin", "coadmin"],
    default: "coadmin"
  }
}, { timestamps: true });

const ProfileModel = mongoose.model("Profile", UserSchema);

module.exports = ProfileModel;
