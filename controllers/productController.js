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

//--- GET SINGLE PRODUCT

const getSingleProduct = asyncHandler(async(req, res) =>{
   const product = await Product.findById(req.params.id)
   if(!product){
    res.status(404)
    throw new Error("Product Not Found")
   }
   if(product.user.toString() !== req.user.id){
    res.status(401)
    throw new Error("Not Autorized to see this product")
   }

    res.status(200).json(product);


})
//--- DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product){
        res.status(404)
        throw new Error("Product Not Found")
       }
       if(product.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("Not Autorized to see this product")
       }
    //    await product.remove() // delete product
       res.status(200).json({
        message: "Product deleted sucssfully"
       })
})

// --- UPDATE PRODUCR
const updateProduct =asyncHandler(async(req, res)=>{
const {name, sku , category, price, description, quantity, image} = req.body
const product = await Product.findById(req.params.id);

 // product existance checker
 if(!product){
    res.status(404)
    throw new Error("Product Not Found")
   }
   // checking user autorization
   if(product.user.toString() !== req.user.id){
    res.status(401)
    throw new Error("Not Autorized to update this product")
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

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: req.params.id},
   {  name,
     sku,
      category,
      quantity,
      price,
      description,
     image: Object.keys(fileData).length === 0 ?   product.image : fileData
  },
{
    new: true,
    runValidators: true
}
)

    res.status(200).json(updatedProduct)

})
module.exports = {
    addProduct,
    getProduct,
    getSingleProduct,
    deleteProduct,
    updateProduct
}