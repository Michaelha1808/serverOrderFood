const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const dotenv = require("dotenv");
dotenv.config({ path: "../../config.env" });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

async function connect() {
  try {
    await mongoose
      .connect(process.env.DATABASE_LOCAL, {
        // .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connect Success");
      });
  } catch (error) {
    console.log("connect failure !!!");
  }
}

module.exports = { connect };
