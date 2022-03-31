const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const auth = require("../routes/login");
const farmer = require("../routes/farmer");
const product = require("../routes/product");
const user = require("../routes/user");

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(express.json());
  app.use("/api/login", auth);
  app.use("/api/user", user);
  app.use("/api/farmer", farmer);
  app.use("/api/products", product);
};
