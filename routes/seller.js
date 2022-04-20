const express = require("express");
const { Seller, validate } = require("../model/seller");
const { Product } = require("../model/product");
const auth = require("../middleware/auth");
const validateObjectID = require("../middleware/validateObjectId");
const route = express.Router();

route.get("/", async (req, res) => {
  res.send(await Seller.find().sort("zip"));
});

// find by category where zip ...

route.get("/:id", validateObjectID, async (req, res) => {
  let seller = await Seller.findById(req.params.id);
  if (!seller) return res.status(404).send("This seller does not exist!");
  res.send(seller);
});

route.get("/products/:id", validateObjectID, async (req, res) => {
  let seller = await Seller.findById(req.params.id);
  if (!seller) return res.status(404).send("This seller does not exist!");
  res.send(seller.products);
});

route.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const seller = new Seller({ ...req.body });
  await seller.save();
  res.send(seller);
});

route.put("/:id", [auth, validateObjectID], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const seller = await Seller.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      zip: req.body.zip,
      city: req.body.city,
      products: req.body.products,
    },
    { new: true }
  );
  res.send(seller);
});

route.delete("/:id", [auth, validateObjectID], async (req, res) => {
  let seller = Seller.findById(req.params.id);
  if (!seller) return res.status(404).send("This seller does not exist!");

  await Seller.deleteOne({ _id: prod._id });

  res.send(seller);
});

module.exports = route;