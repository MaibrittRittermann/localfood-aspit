const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  cat: {
    type: String,
    required: true,
    enum: ["grøntsag", "frugt", "andet"],
  },
  title: String,
  img: String,
  descr: String,
  amount: Number,
  unit: String,
  price: Number,
  seller: mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    address: String,
    zip: Number,
    city: String
  })
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
    seller: {
      _id: Joi.types.ObjectId().required(),
      address: Joi.string().min(4).required(),
      zip: Joi.number().min(1000).max(9999).required(),
      city: Joi.string().min(2).required()
    }
  });

  return schema.validate(prod);
}

module.exports.Product = Product;
module.exports.validate = validateProduct;
module.exports.productSchema = productSchema;
