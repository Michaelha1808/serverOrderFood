const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please provide a vaild username"],
  },
  phoneNumber: {
    type: String,
    unique: true,
    require: [true, "Please provide a vaild phone number"],
    minLength: 10,
    maxLength: 10,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  status: {
    type: Number,
    default: 1,
  },
});
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

module.exports = mongoose.model("User", UserSchema);
