const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const auth = require("../routes/login");
const seller = require("../routes/seller");
const product = require("../routes/product");
const user = require("../routes/user");

module.exports = function (app) {

  const corsOptions = {
    exposedHeaders: 'Authorization',
  };
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(compression());
  app.use(cors(corsOptions));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.use("/api/login", auth);
  app.use("/api/user", user);
  app.use("/api/seller", seller);
  app.use("/api/products", product);
};
