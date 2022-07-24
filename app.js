const config = require("./utils/config");
const express = require("express");
const cors = require("cors");
const app = express();

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const helmet = require("helmet");

const itemRouter = require("./routers/item.router");
const userRouter = require("./routers/user.router");
const orderRouter = require("./routers/order.router");
const voucherRouter = require("./routers/voucher.router");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to mongodb");
  })
  .catch((err) => {
    logger.error("error connecting to mongodb", err.message);
  });

// middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);
app.use(helmet());

// routes
app.use("/api/items", itemRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/vouchers", voucherRouter);

// validation middlewares
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
