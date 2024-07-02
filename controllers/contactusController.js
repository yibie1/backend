const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler(async (req, res) =>{
   const {subject, message} = req.body
   const user = await User.findById(req.user._id)

   if(!user){
    res.status(400)
    throw new Error("user not found")
   }
   if(!subject || !message){
    res.status(500)
    throw new Error("please enter subject and message")
   }


   const send_to = process.env.USER_EMAIL
   const sent_from = process.env.USER_EMAIL
   const reply_to = user.email

   try {
       await sendEmail(subject,message,send_to, sent_from, reply_to);
       res.status(200).json({
           status : true,
           message: "we recive your message, we will contact you ASAP"
       })
   } catch (error) {
       res.status(400);
       new Error(error.message,  "oops! somethig wnet wrong, email not sent")
   }


})

module.exports = {
    contactUs
}