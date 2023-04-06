const { Router } = require("express");
const foodsController = require("../controllers/foodController");
const authController = require("../controllers/authController");
const router = require("express").Router();

// GET LIST FOOD
router.get("/", authController.protect, foodsController.getAllFoods);
router.post("/updateFoods",authController.protect,foodsController.updateFoods);



// foods.save();
module.exports = router;
