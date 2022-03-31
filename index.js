require("express-async-errors");
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();
const error = require("./middleware/error");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

require("./startup/db")();
require("./startup/routes")(app);

app.use(error);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = server;
