const Foods = require("../models/foodsModel");
const TimeAndBudget = require("../models/timeandbudget");
const jwt = require("jsonwebtoken");
const { deleteMany, insertMany } = require("../models/foodsModel");
const axios = require("axios");

// const mongoose = require("mongoose");

const foodController = function () {};

foodController.prototype.getAllFoods = async (req, res, next) => {
  // console.log(req.user);
  try {
    const timeandbudget = await TimeAndBudget.find();
    console.log(timeandbudget);
    const foods = await Foods.find();
    if (timeandbudget[0] !== "") {
      res.json({
        username: req.user.name,
        phoneNumber: req.user.phoneNumber,
        role: req.user.role,
        foods: foods,
        time_order: timeandbudget[0].time_order,
        budget: timeandbudget[0].budget,
        time_now: timeandbudget[0].time_now,
      });
    } else {
      res.json({
        username: req.user.name,
        phoneNumber: req.user.phoneNumber,
        role: req.user.role,
        foods: foods,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
// foodController.prototype.setTimeAndBudget = async (req, res, next) => {
//   // console.log(req.user);
//   try {

//     res.json({
//       username: req.user.name,
//       phoneNumber: req.user.phoneNumber,
//       role: req.user.role,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

foodController.prototype.updateFoods = async (req, res, next) => {
  try {
    await TimeAndBudget.deleteMany();
    const timeandbudget = new TimeAndBudget({
      time_order: req.body.time_order,
      budget: req.body.budget,
      time_now: req.body.time_now,
      url: req.body.url,
    });
    timeandbudget.save();
    await Foods.deleteMany();
    axios
      .get(
        `https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=${req.body.url}`,
        {
          headers: {
            authority: " gappapi.deliverynow.vn",
            method: " GET",
            // path: " /api/delivery/get_from_url?url=ho-chi-minh/bep-ba-muoi-an-vat-online",
            scheme: " https",
            accept: " application/json, text/plain, */*",
            "accept-encoding": " gzip, deflate, br",
            "accept-language":
              " vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            origin: " https://shopeefood.vn",
            referer: " https://shopeefood.vn/",
            "sec-ch-ua":
              ' "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            "sec-ch-ua-mobile": " ?0",
            "sec-ch-ua-platform": ' "Windows"',
            "sec-fetch-dest": " empty",
            "sec-fetch-mode": " cors",
            "sec-fetch-site": " cross-site",
            "user-agent":
              " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "x-foody-access-token": "",
            "x-foody-api-version": " 1",
            "x-foody-app-type": " 1004",
            "x-foody-client-id": "",
            "x-foody-client-language": " vi",
            "x-foody-client-type": " 1",
            "x-foody-client-version": " 3.0.0",
          },
        }
      )
      .then((response1) => {
        axios
          .get(
            `https://gappapi.deliverynow.vn/api/dish/get_delivery_dishes?id_type=2&request_id=${response1.data.reply.delivery_id}`,
            {
              headers: {
                authority: " gappapi.deliverynow.vn",
                method: " GET",
                // path: " /api/delivery/get_from_url?url=ho-chi-minh/bep-ba-muoi-an-vat-online",
                scheme: " https",
                accept: " application/json, text/plain, */*",
                "accept-encoding": " gzip, deflate, br",
                "accept-language":
                  " vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
                origin: " https://shopeefood.vn",
                referer: " https://shopeefood.vn/",
                "sec-ch-ua":
                  ' "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                "sec-ch-ua-mobile": " ?0",
                "sec-ch-ua-platform": ' "Windows"',
                "sec-fetch-dest": " empty",
                "sec-fetch-mode": " cors",
                "sec-fetch-site": " cross-site",
                "user-agent":
                  " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
                "x-foody-access-token": "",
                "x-foody-api-version": " 1",
                "x-foody-app-type": " 1004",
                "x-foody-client-id": "",
                "x-foody-client-language": " vi",
                "x-foody-client-type": " 1",
                "x-foody-client-version": " 3.0.0",
              },
            }
          )
          .then((response2) => {
            // Foods.insertMany(req.body);
            // console.log(response2.data.reply.menu_infos);
            var arr1 = response2.data.reply.menu_infos;
            var arr2 = [];
            for (let i = 0; i < arr1.length; i++) {
              const elm1 = arr1[i];
              if (elm1.dish_type_id == -1) {
                continue;
              }
              elm1.dishes.forEach((elm2) => {
                arr2.push({
                  _id: elm2.id,
                  name: elm2.name,
                  description: elm2.description,
                  price: elm2.price.value,
                  unit: elm2.price.unit,
                  is_available: elm2.is_available,
                  photos: elm2.photos[elm2.photos.length - 2].value,
                });
              });
            }

            console.log("Updated list foods successfuly!");
            Foods.insertMany(arr2);
            res.json({
              status: 1,
              message: "Updated list foods successfuly!",
            });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = new foodController();
