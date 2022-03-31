const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../model/user");

route.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Ugyldig brugernavn og adgangskode");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Ugyldig brugernavn og adgangskode");

  res.send(user.generateAuthToken());
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = route;
