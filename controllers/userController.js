const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userController = function () {};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const creatSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  // remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 1,
    token,
    message: "Đăng nhập thành công!",
    data: {
      user,
    },
  });
};
userController.prototype.login = async (req, res, next) => {
  console.log('login');
  if (req.body.phoneNumber.length < 9 || req.body.password < 1) {
    return res.json({
      status: 0,
      message: "Đăng nhập thất bại",
    });
  } else {
    try {
      const user = await User.find({
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
      });

      if (user.length == 1 && user[0].phoneNumber == req.body.phoneNumber) {
        creatSendToken(user[0], 200, res);
      } else {
        res.json({
          status: 0,
          message: "Đăng nhập thất bại",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(user);
};
userController.prototype.logout = async (req, res, next) => {
  res.clearCookie("token");
  // res.send("Logged out successfully");
};
userController.prototype.createAccounts = async (req, res, next) => {
  try {
    const user = new User({
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role,
    });
    await user.save();
    res.status(200).json({
      status: 1,
      message: "sign up success",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Số điện thoại đã tồn tại hoặc không đủ",
    });
  }
};

userController.prototype.getAllAccounts = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json({
      status: 1,
      data: user,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      error: error,
    });
  }
};
userController.prototype.getAccount = async (req, res, next) => {
  console.log(req.body.phoneNumber);
  try {
    const user = await User.find({
      $or: [{ phoneNumber: req.body.phoneNumber }, { name: req.body.name }],
    });
    console.log(user);
    res.status(200).json({
      status: 1,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Số điện thoại hoặc tên không tồn tại",
    });
  }
};
userController.prototype.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 1,
      message: "Delete success",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Delete 0 success",
    });
  }
};
userController.prototype.checkCurrentPassword = async (req, res, next) => {
  try {
    const user = await User.findOne(req.user._id).select("+password");
    if (req.body.newPassword != req.body.repeatPassword) {
      return res.status(200).json({
        status: 0,
        message: "Nhập lại mật khẩu mới không chính xác",
      });
    } else if (user.password == req.body.oldPassword) {
      next();
    } else {
      return res.status(200).json({
        status: 0,
        message: "Mật khẩu cũ không chính xác",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
userController.prototype.changePassword = async (req, res, next) => {
  try {
    const user = await User.findOne(req.user._id);
    user.password = req.body.newPassword;
    await user.save();
    res.status(200).json({
      status: 1,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Update 0 success",
    });
  }
};
userController.prototype.updateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.body._id);
    user.phoneNumber = req.body.phoneNumber;
    user.name = req.body.name;
    user.password = req.body.password;
    user.role = req.body.role;
    await user.save();
    res.status(200).json({
      status: 1,
      message: "Update success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: "Update 0 success",
    });
  }
};

module.exports = new userController();
