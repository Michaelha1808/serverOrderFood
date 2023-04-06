const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("./../utils/appError");
const authController = function () {};

authController.prototype.protect = async (req, res, next) => {
  // console.log(req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("Your are not logged in please log in to get access", 401)
    );
    res.status(401).json({
      status: 0,
      message: "Your are not logged in please log in to get access",
    });
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  const currentUser = await User.findById(decoded.id);
  // console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does not exist", 401)
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  req.user = currentUser;
  next();
};
authController.prototype.restrictTo = (roles) => {
  return (req, res, next) => {
    // role ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
module.exports = new authController();
