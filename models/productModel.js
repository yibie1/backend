const mongoose = require("mongoose");

const productSchem = mongoose.Schema({
 user :{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
 },
 name: {
    type: String,
    required: [true, "please put your name"],
    trim: true,
},
sku: {
    type: String,
    required: true,
    trim: true,
    default: 'SKU'
},
category: {
    type: String,
    required: [true, "Please Add category"],
    trim: true,
},
quantity: {
    type: String,
    required: [true, "Please Add quantity"],
    trim: true
},
price: {
    type: String,
    required: [true, "Please Add price"],
    trim: true
},
description: {
    type: String,
    required: [true, "Please Add description"],
    trim: true
},
image: {
    type: Object,
    default: {}
},
},
{
    timestamps: true,
}
)


const Product = mongoose.model("Product", productSchem);

module.exports = Product;