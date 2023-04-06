const mongoose = require("mongoose");
const { object } = require("promisify");
const OrderSchema = mongoose.Schema({
  createTime: {
    type: Date,
  },
  idUser: {
    type: String,
  },
  username: {
    type: String,
  },
  dishes: {
    type: Array,
    item: [
      {
        type: object,
        properties: {
          _id: {
            type: String,
          },
          name: {
            type: String,
            // unique: true,
          },
          description: { type: String },
          price: {
            type: String,
          },
          unit: {
            type: String,
          },
          quantity: {
            type: Number,
            min: 1,
          },
          photos: {
            type: String,
          },
          tag: {
            type: String,
          },
        },
      },
    ],
  },
});
module.exports = mongoose.model("Order", OrderSchema);
