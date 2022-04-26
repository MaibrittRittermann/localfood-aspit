const express = require("express");
const debug = require("debug")("app:http");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, validate } = require("../model/user");

const route = express.Router();

route.get("/", async (req, res) => {
  res.send(await User.find().sort("name"));
});

route.post("/register/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Bruger findes allerede");

  user = new User({
    ...req.body,
  });

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const token = jwt.sign(
      { _id: user._id, access: user.access },
      config.get("jwtPrivateKey")
    );
    await user.save();
    res
      .header("x-auth-token", token)
      .send({ name: user.name, email: user.email });
  } catch (err) {
    debug(err);
  }
});

module.exports = route;
