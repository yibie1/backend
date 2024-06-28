const express = require("express");
const router =express.Router();
const { addProduct, getProduct, getSingleProduct, deleteProduct } = require("../controllers/productController");
const authGard = require("../middleWare/authMiddleware");
const {upload} = require("../utils/fileUpload");



router.post("/", authGard, upload.single("image"), addProduct)
router.get("/", authGard, getProduct)
router.get("/:id", authGard, getSingleProduct)
router.delete("/:id", authGard,deleteProduct)

module.exports= router;