const express = require("express");
const { Product, validate } = require("../model/product");
const route = express.Router();
const auth = require("../middleware/auth");
const validateObjectID = require("../middleware/validateObjectId");

route.get("/", async (req, res) => {
  res.send(await Product.find().sort("title"));
});

// find by category where zip ...

route.get("/:id", validateObjectID, async (req, res) => {
  let prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).send("This product does not exist!");
  res.send(prod);
});

route.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const prod = new Product({
    cat: req.body.cat,
    title: req.body.title,
    img: req.body.img,
    descr: req.body.descr,
    amount: req.body.amount,
    unit: req.body.unit,
    price: req.body.price,
  });
  await prod.save();
  res.send(prod);
});

route.put("/:id", [auth, validateObjectID], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const prod = await Product.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      cat: req.body.cat,
      img: req.body.img,
      descr: req.body.descr,
      amount: req.body.amount,
      unit: req.body.unit,
      price: req.body.price,
    },
    { new: true }
  );
  res.send(prod);
});

route.delete("/:id", [auth, validateObjectID], async (req, res) => {
  let prod = Product.findById(req.params.id);
  if (!prod) return res.status(404).send("This product does not exist!");

  await Product.deleteOne({ _id: prod._id });

  res.send(prod);
});

module.exports = route;
