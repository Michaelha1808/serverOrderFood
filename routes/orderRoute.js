const { Router } = require("express");
const router = require("express").Router();
const Orders = require("../models/orderModel");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
// GET LIST FOOD
router.get(
  "/getListOrders",
  authController.protect,
  orderController.getListOrders
);
router.post("/getOrder", authController.protect, orderController.getOrder);
router.get("/getTimeOrder", orderController.getTimeOrder);

router.get(
  "/getHistoryOrders",
  authController.protect,
  orderController.getHistoryOrders
);
router.post("/create", authController.protect, orderController.create);
router.delete(
  "/cancelOrders/:id",
  authController.protect,
  orderController.cancelOrders
);

router.delete("/delete/:id", authController.protect, orderController.delete);
router.get(
  "/getStatistics",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.getStatistics
);

router.get('/test',orderController.test)


module.exports = router;
