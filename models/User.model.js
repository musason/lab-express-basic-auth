// User model here
const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const SignupModel = mongoose.model("Signup", UserSchema);
module.exports = SignupModel;