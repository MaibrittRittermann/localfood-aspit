const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  cat: {
    type: String,
    required: true,
    enum: ["vegestable", "fruit", "other"],
  },
  title: String,
  img: String,
  descr: String,
  amount: Number,
  unit: String,
  price: Number,
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(prod) {
  const schema = Joi.object({
    cat: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
    img: Joi.string().min(5),
    descr: Joi.string().min(5),
    amount: Joi.number().required(),
    unit: Joi.string().max(3).required(),
    price: Joi.number().required(),
  });

  return schema.validate(prod);
}

module.exports.Product = Product;
module.exports.validate = validateProduct;
module.exports.productSchema = productSchema;
