
const asyncHandler = require("express-async-handler") // error handler express package
const User = require("../models/userModel");
const bcrypt = require("bcryptjs") // password encrypt
const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");


const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"}) // expired after 24 hours
}
  // ------- REGISTER USER ----------------
const userRegister = asyncHandler(async(req, res) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill all fildes")
    }
    if(password.length < 6){
        res.status(400);
        throw new Error("password length should be minimum 6 character")
    }
    const checkUser = await User.findOne({email})

    if(checkUser){
        res.status(400)
        throw new Error("This email is alrady exist")
    }
   // encrypt password
   const salt = await bcrypt.genSalt(10)
   const hashPassword = await bcrypt.hash(password, salt)

    const createUser = await User.create({
        name, email,
        password: hashPassword
    })
    // generat token
    const token = generateToken(createUser._id)
    // httpOnly cookie

     res.cookie("token", token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 86400),
        httpOnly: true,
        sameSite: "none",
        secure: true


     })
    if(createUser){
        const {_id, name, password, email, photo, phone, bio} = createUser
        res.status(201).json({
            _id, name, email, password, bio, phone, photo, token
        })
    }
    else{
        res.status(400)
        throw new Error("user data is not correct")
    }
    });

    // ------- LOGIN USER ----------------
 const loginUser = asyncHandler( async (req, res)=>{
   const {email, password} = req.body

// validate

  if(!email || !password){
    res.status(400)
    throw new Error("Enter your password and email")
  }

// checking user existance
 const user = await User.findOne({email});
 if(!user){
    res.status(400)
    throw new Error("thire is no account with this email, sign up")
 }

// checking the pasword
const checkingPassword = await bcrypt.compare(password, user.password);

// generat token
const token = generateToken(user._id)

// httpOnly cookie
 res.cookie("token", token, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 86400),
    httpOnly: true,
    sameSite: "none",
    secure: true

 })

if(user && checkingPassword){
    const {_id, name, password, email, photo, phone, bio} =user
    res.status(201).json({
        _id, name, email, password, bio, phone, photo, token
    })

}
else{
    res.status(400)
    throw new Error("wrong email or password")
}
 });
 // ------ LOGOUT
const logout = asyncHandler(async (req, res) =>{
    res.cookie("token", "", {
        path: '/',
        expires: new Date(0),
        httpOnly: true,
        sameSite: "none",
        secure: true
     });
     res.status(200).json({
        message: "you are logged out sucssfully"
     })
})
// ----- GET USER PROFILE DATA
const getUser = asyncHandler(async (req, res) =>{
   const user = await User.findById(req.user._id);
   const {_id, name, password, email, photo, phone, bio} =user
   if(user){
   res.status(200).json({
       _id, name, email, password, bio, phone, photo
   })

}
else{
   res.status(400)
   throw new Error("user not found! ")
}
});
// --- GET LOGGEDIN USER
const loginStatus = asyncHandler( async (req, res) =>{
    const token = req.cookies.token;
    if(!token){
        return res.json(false)
    }

    const verifed =  jwt.verify(token, process.env.JWT_SECRET);
    if(verifed){
        return res.json(true)
    }
    return res.json(false)
})

// ---- USER UPDATE

const updateUser = asyncHandler(async (req, res) =>{
   const user = await User.findById(req.user._id)
   if(user){
    const {_id,  name,  email, password, photo, phone, bio} = user

     user.email = email; // email shouldn't be changed
     user.name = req.body.name || name;
     user.phone = req.body.phone || phone;
     user.bio = req.body.bio || bio;
     user.photo = req.body.photo || photo;

     const updatedUser = await user.save();
     if(updatedUser){
        res.status(200).json({
            _id: updatedUser._id,
             name: updatedUser.name,
             email: updatedUser.email,
               password: updatedUser.password,
                photo: updatedUser.photo,
                phone: updatedUser.phone,
                bio: updatedUser.bio
        })
     }else{
        res.status(400)
        throw new Error("oops user data not updated! ")
     }
   }else{
    res.status(400)
    throw new Error("user not found! ")
 }


})

//---- UPDATE PASSWORD
 const changePassword = asyncHandler( async (req, res) =>{
    const user = await User.findById(req.user._id);
    const {oldPassword, password} = req.body;
    if(!user){
        res.status(400)
        throw new Error("user not found, Singup")
    }
    // validate
    if(!oldPassword || !password){
        res.status(400)
        throw new Error("please enter old and new password")
    }
 // check the old password id same as the actual password in the database

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        if(user && isPasswordCorrect){
             // encrypt password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
             user.password = hashPassword
            await user.save()
            res.status(200).send( "password changed sucssfully");
        }
        else{
            res.status(401)
            throw new Error("old password is not correct ")
        }
 })

 //--- FORGOTE PASSWORD
 const forgotePassword = asyncHandler(async (req, res) => {
    const {email} = req.body;

    // check email existance
    const user = await User.findOne({email});
    if(!user){
        res.status(400);
        throw new Error("User dosen't exist with this email")
    }

    // Delete existing token just to refresh the token
   const token = await Token.findOne({userId: user._id});
   if(token){
   await token.deleteOne();
   }

 // create reset token
  let resetToken = crypto.randomBytes(32).toString('hex') + user._id;
 // lets encrypt the token before send to DB

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest('hex')

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) // 30 minute

    }).save();

    // reset token

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    //send mail
    const message = `
    <h2>Hello Dear ${user.name}</h2>
    <p>this is reset password link. it ecpiered after 30 minute</p>

    <a href=${resetUrl} clicktracking= off>${resetUrl}</a>

    <p> Regards TFNA Plc.</p>
    `;
    const subject = "Password Reset Request"

    const send_to = user.email
    const sent_from = process.env.USER_EMAIL

    try {
        await sendEmail(subject,message,send_to, sent_from);
        res.status(200).json({
            status : true,
            message: "Password reset link send to your email sucssfuly"
        })
    } catch (error) {
        res.status(400);
        new Error(error.message,  "oops! somethig wnet wrong, email not sent")
    }

 })


module.exports = {
    userRegister,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotePassword
}