const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const TimeAndBudget = require("../models/timeandbudget");
const Food = require("../models/foodsModel")
const { count } = require("console");
// const mongoose = require("mongoose");

const orderController = function () { };
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

orderController.prototype.create = async (req, res, next) => {
  try {
    const timeandbudget = await TimeAndBudget.find();
    var countDownDate = addMinutes(
      new Date(timeandbudget[0].time_now),
      Number(timeandbudget[0].time_order)
    );
    var distance = countDownDate.getTime() - new Date().getTime();
    if (distance < 0) {
      return res.status(200).json({
        status: 0,
        message: "Đã hết thời gian đặt hàng",
      });
    }
    const order = new Order({
      idUser: req.user.id,
      username: req.user.name,
      createTime: new Date(),
      dishes: JSON.parse(req.body.dishes),
    });
    order.save();
    console.log(order.dishes);
    res.status(200).json({
      status: 1,
      message: "order success",
    });
  } catch (error) {
    if (error) {
      res.status(500).json({
        status: 0,
        message: "order 0 success",
      });
    }
  }
};

orderController.prototype.delete = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    const user = await User.findById(order.idUser);
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 1,
      message: "delete success",
      DeleteBy: user.name,
    });
  } catch (error) {
    if (error) {
      res.status(200).json({
        status: 0,
        message: "delete 0 success",
      });
    }
  }
};
orderController.prototype.cancelOrders = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 1,
      message: "delete success",
      // DeleteBy: user.name,
    });
  } catch (error) {
    if (error) {
      res.status(200).json({
        status: 0,
        message: "delete 0 success",
      });
    }
  }
};
orderController.prototype.getHistoryOrders = async (req, res, next) => {
  try {
    const order = await Order.find({ idUser: req.user._id });
    let renderlist = [];
    order.forEach((elm) => {
      // console.log(elm.photos);
      renderlist.push({
        id: elm._id,
        createTime: elm.createTime,
        idUser: elm.idUser,
        username: elm.username,
        dishes: elm.dishes,
      });
    });
    // console.log(renderlist);
    res.status(200).json({
      status: 1,
      length: renderlist.length,
      list_order: renderlist,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      status: 0,
      message: error,
    });
  }
};
orderController.prototype.getListOrders = async (req, res, next) => {
  try {
    const order = await Order.find();
    // console.log(order);
    let renderlist = [];
    order.forEach((elm) => {
      // console.log(elm.photos);
      renderlist.push({
        id: elm._id,
        createTime: elm.createTime,
        idUser: elm.idUser,
        username: elm.username,
        dishes: elm.dishes,
      });
    });
    // console.log(renderlist);
    res.status(200).json({
      status: 1,
      length: renderlist.length,
      list_order: renderlist,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      status: 0,
      message: error,
    });
  }
};
orderController.prototype.getOrder = async (req, res, next) => {
  try {
    // console.log(req.body.username);
    const order = await Order.find({
      username: { $regex: req.body.username, $options: "i" },
    });
    console.log(order);
    let renderlist = [];
    order.forEach((elm) => {
      // console.log(elm.photos);
      renderlist.push({
        id: elm._id,
        createTime: elm.createTime,
        idUser: elm.idUser,
        username: elm.username,
        dishes: elm.dishes,
      });
    });
    // console.log(renderlist);
    res.status(200).json({
      status: 1,
      length: renderlist.length,
      list_order: renderlist,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      status: 0,
      message: error,
    });
  }
};
orderController.prototype.getTimeOrder = async (req, res, next) => {
  try {
    // console.log(req.body.username);
    const timeandbudget = await TimeAndBudget.find();
    // console.log(renderlist);
    res.status(200).json({
      status: 1,
      time_order: timeandbudget[0].time_order,
      time_now: timeandbudget[0].time_now,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      status: 0,
      message: error,
    });
  }
};

orderController.prototype.getStatistics = async (req, res, next) => {
  try {
    const food = await Food.find()
    const group = [
      {
        $unwind: "$dishes",
      },
      {
        $lookup: {
          from: "foods",
          localField: "dishes.name",
          foreignField: "name",
          as: "food"
        }
      },
      // {
      //   $unwind: "$food"
      // },
      // {
      //   $unwind: "$list_order",
      // },
      // {
      // },
      // {
      //   $group: {
      //     _id: "$dishes._id",
      //     createTime: { $first: "$list_order.createTime" },
      //     name: { $first: "$dishes.name" },
      //     quantity: { $sum: "$dishes.quantity" },

      //     total: { $sum: { $toInt: "$dishes.price" } },
      //     unit: { $first: "$dishes.unit" },
      //     // abc: { $push: "$$ROOT" }
      //   }
      // },
      {
        $group: {
          _id: {
            id: "$dishes._id",
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createTime" },
            },
          },
          // createTime: { $first: "$list_order.createTime" },
          name: { $first: "$dishes.name" },
          quantity: { $sum: { $toInt: "$dishes.quantity" } },
          // total:{
          //  $multiply: [{ $toInt: "$dishes.price" }, 80]
          // } ,

          price: { $first: { $toInt: "$dishes.price" } },
          unit: { $first: "$dishes.unit" },
          // food_name: { $first: "$food.name" }
          // abc: { $push: "$$ROOT" }
        },

      },
      {
        $sort: { "name": 1 }
      }
    ];
    const timeandbudget = await TimeAndBudget.find();
    var url_food = "";
    if (!timeandbudget.length == 0) {
      url_food = timeandbudget[0].url;
    }
    Order.aggregate(group, function (err, result) {
      res.status(200).json({
        status: "success",
        length: result.length,
        foods: food,
        list_order: result,
        url: url_food,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

orderController.prototype.test = async (req, res, next) => {
  try {
    const group = [
      {
        $unwind: "$dishes",
      },
    ];
    const timeandbudget = await TimeAndBudget.find();
    var url_food = "";
    if (!timeandbudget.length == 0) {
      url_food = timeandbudget[0].url;
    }
    Order.aggregate(group, function (err, result) {
      res.status(200).json({
        status: "success",
        length: result.length,
        list_order: result,
        url: url_food,
      });
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = new orderController();
