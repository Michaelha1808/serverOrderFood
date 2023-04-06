const { Router } = require("express");
const User = require("../models/userModel");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const router = require("express").Router();

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post(
  "/signUp",
  authController.protect,
  authController.restrictTo("admin"),
  userController.createAccounts
);
router.post(
  "/getAccount",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAccount
);
// GET ALL ACCOUNT

router.get(
  "/getAllAccounts",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllAccounts
);
router.delete(
  "/deleteAccount/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteAccount
);
router.post(
  "/changePassword",
  authController.protect,
  userController.checkCurrentPassword,
  userController.changePassword
);
router.post(
  "/updateAccount",
  authController.protect,
  authController.restrictTo("admin"),
  userController.updateAccount
);

function importDB(Model, datas, index) {
  var collect = new Model(datas[index]);
  collect.save(function (err, data) {
    if (index + 1 < datas.length) importDB(Model, datas, index + 1);
    else console.log("Import complete!");
  });
}

function loadFile(filePath, Model) {
  var s = fs.readFileSync(filePath, "utf-8");
  s = s.split("\r\n");
  for (var i = 0; i < s.length; i++) {
    s[i] = s[i].split("\t");
  }
  var datas = [];
  for (var i = 1; i < s.length; i++) {
    var data = {};
    for (var j = 0; j < s[0].length; j++) {
      data[s[0][j]] = s[i][j];
    }
    data.password = "111";
    datas.push(data);
  }
  importDB(Model, datas, 0);
}
// loadFile("./private/user.txt", mongoose.model("User"));

module.exports = router;
