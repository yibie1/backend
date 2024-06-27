const asyncHandler = require("express-async-handler");
const cloudinary = require('cloudinary').v2;
const Product = require("../models/productModel");
const { fileSizeFormater } = require("../utils/fileUpload");



// ---ADD PRODUCT TO DATABASE
const addProduct = asyncHandler(async(req, res) =>{
 const {name, sku , category, price, description, quantity, image} = req.body

 // validate
  if(!name || !sku || !category || !price || !description || !quantity){
    res.status(400)
    throw new Error("Please Fill all feilds")
  }

 //multi image upload handler

 let fileData = {}

  if( req.file){
// upload image to cloudnary
let uploadImage ;

try {
    uploadImage = cloudinary.uploader.upload(req.file.path, {
        folder: 'Inventory',
        resource_type: 'image'
    })
} catch (error) {
    res.status(500)
    throw new Error("Image not uploaded to cloudinary")
}


    fileData = {
        fileName: req.file.originalname,
        filePath: (await uploadImage).secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormater( req.file.size, 2)
    }
  }

  const product = await Product.create({ user: req.user._id,
    name, sku, category, quantity, price, description,
     image: fileData
  })
  if(product){
    res.status(200).json(
      product
    )
  }else{
    res.status(400)
    throw new Error("Product not added to database, please try again")
  }
})
// --- GET PRODUCTS FOR USER

const getProduct = asyncHandler(async (req, res)=> {
    const products = await Product.find({user: req.user._id}).sort('-createdAt');
    if(products){
    res.status(200).json(products)
}else{
    throw new Error("No Products")
}
})

module.exports = {
    addProduct,
    getProduct
}