const mongoose = require("mongoose");

const timeandbudgetSchema = mongoose.Schema({
  time_order: { type: String },
  budget: { type: String },
  time_now: { type: Date },
  url: { type: String },
});
module.exports = mongoose.model("timeandbudget", timeandbudgetSchema);
