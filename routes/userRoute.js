const express = require("express");
const router =express.Router();
const {
    userRegister,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotePassword,
    resetPassword
} = require("../controllers/userController");
const authGard = require("../middleWare/authMiddleware")

router.post("/register", userRegister);
router.post("/login", loginUser);
router.get('/logout', logout);
router.get('/getuser', authGard,getUser);
router.get('/loggedin', loginStatus);
router.patch('/updateuser', authGard,updateUser);
router.patch('/changepassword', authGard, changePassword);
router.post('/forgotepassword', forgotePassword);
router.put('/resetpassword/:resetToken', resetPassword)
module.exports = router;