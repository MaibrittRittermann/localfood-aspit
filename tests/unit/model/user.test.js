const { User } = require("../../../model/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

test("user.generateAuthToken - should return a valid JWT", () => {
  const id = new mongoose.Types.ObjectId();
  const user = new User({ _id: id });
  const token = user.generateAuthToken();
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  expect(decoded).toMatchObject({ _id: id });
});
