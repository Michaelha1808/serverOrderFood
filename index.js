const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Router } = require("express");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
var cors = require("cors");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 8386;
const cookieParser = require("cookie-parser");
// init middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());


// init router
app.get("/", function(req, res) {
    res.send("Hello World");
});
const routerFoods = require("./routes/foodRoute");
const routerOrders = require("./routes/orderRoute");
const routerUsers = require("./routes/userRoute");
app.use("/foods", routerFoods);
app.use("/orders", routerOrders);
app.use("/users", routerUsers);
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// init db
const db = require("./config/db/index");
db.connect();
app.use(globalErrorHandler);


//server
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});