const express = require("express");
const auth = require("../routes/login");
const farmer = require("../routes/farmer");
const product = require("../routes/product");
const user = require("../routes/user");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/login", auth);
  app.use("/api/user", user);
  app.use("/api/farmer", farmer);
  app.use("/api/products", product);
};
