const mongoose = require("mongoose");
const Joi = require("joi");
const { productSchema } = require("./product");

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  email: { type: String, required: false},
  phone: { type: Number, required: false},
  address: { type: String, required: true },
  zip: { type: Number, required: true, min: 1000, max: 9999 },
  city: { type: String, required: true, minlength: 2 },
  products: [productSchema],
});

const Seller = mongoose.model("Seller", sellerSchema);

function validateSeller(seller) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string(),
    phone: Joi.number(),
    address: Joi.string().min(3).required(),
    zip: Joi.number().min(1000).max(9999).required(),
    city: Joi.string().min(3).required(),
    products: Joi.allow(),
  });

  return schema.validate(seller);
}

module.exports.Seller = Seller;
module.exports.validate = validateSeller;
