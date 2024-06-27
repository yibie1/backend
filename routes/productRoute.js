const express = require("express");
const router =express.Router();
const { addProduct, getProduct } = require("../controllers/productController");
const authGard = require("../middleWare/authMiddleware");
const {upload} = require("../utils/fileUpload");



router.post("/addproduct", authGard, upload.single("image"), addProduct)
router.get("/products", authGard, getProduct)

module.exports= router;