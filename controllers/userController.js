
const asyncHandler = require("express-async-handler") // error handler express package
const User = require("../models/userModel");
const bcrypt = require("bcryptjs") // password encrypt
const jwt = require("jsonwebtoken");
const { use } = require("../routes/userRoute");


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
module.exports = {
    userRegister,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword
}