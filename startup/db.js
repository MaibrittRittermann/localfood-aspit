const config = require("config");
const mongoose = require("mongoose");
const debug = require("debug")("app:db");

module.exports = function () {
  console.log(config.get("db"));
  mongoose
    .connect(config.get("db"))
    .then(() => debug("Connected to db"))
    .catch((err) => debug("DB problem: " + err));
};
