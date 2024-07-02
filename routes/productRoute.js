const express = require("express");
const router =express.Router();
const { addProduct, getProduct, getSingleProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const authGard = require("../middleWare/authMiddleware");
const {upload} = require("../utils/fileUpload");

router.post("/", authGard, upload.single("image"), addProduct)
router.get("/", authGard, getProduct)
router.get("/:id", authGard, getSingleProduct)
router.delete("/:id", authGard,deleteProduct)
router.patch('/:id', authGard, upload.single("image"), updateProduct)

module.exports= router;