const jwt = require("jsonwebtoken");
const config = require("config");
const debug = require("debug")("app:http");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Adgang nægtet - du er ikke logget på");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (err) {
    debug(err);
    res.status(400).send("Ugyldigt token");
  }
};
