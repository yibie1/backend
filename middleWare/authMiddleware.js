const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")


const authGard = asyncHandler(async (req, res, next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401)
            throw new Error("not authorized to access it");
        }
    const validate = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(validate.id).select("-password")
    if(!user){
        res.status(401)
        throw new Error("user not found");
    }

        req.user = user // set user for authnticated suer
        next();
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = authGard