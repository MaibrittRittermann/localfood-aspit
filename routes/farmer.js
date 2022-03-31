const express = require("express");
const { Farmer, validate } = require("../model/farmer");
const { Product } = require("../model/product");
const auth = require("../middleware/auth");
const validateObjectID = require("../middleware/validateObjectId");
const route = express.Router();

route.get("/", async (req, res) => {
  res.send(await Farmer.find().sort("zip"));
});

// find by category where zip ...

route.get("/:id", validateObjectID, async (req, res) => {
  let farmer = await Farmer.findById(req.params.id);
  if (!farmer) return res.status(404).send("This farmer does not exist!");
  res.send(farmer);
});

route.get("/products/:id", validateObjectID, async (req, res) => {
  let farmer = await Farmer.findById(req.params.id);
  if (!farmer) return res.status(404).send("This farmer does not exist!");
  res.send(farmer.products);
});

route.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const farmer = new Farmer({ ...req.body });
  await farmer.save();
  res.send(farmer);
});

route.put("/:id", [auth, validateObjectID], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const farmer = await Farmer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      address: req.body.address,
      zip: req.body.zip,
      city: req.body.city,
      products: req.body.products,
    },
    { new: true }
  );
  res.send(farmer);
});

route.delete("/:id", [auth, validateObjectID], async (req, res) => {
  let farmer = Farmer.findById(req.params.id);
  if (!farmer) return res.status(404).send("This farmer does not exist!");

  await Farmer.deleteOne({ _id: prod._id });

  res.send(farmer);
});

module.exports = route;
