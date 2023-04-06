const mongoose = require("mongoose");

const foodsSchema = mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: String },
  discount_price: { type: String },
  photos: { type: String },
  unit: { type: String },
  is_available: { type: Boolean },
  total_like: { type: String },
  _id: { type: String },
});
module.exports = mongoose.model("Food", foodsSchema);
