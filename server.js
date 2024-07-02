const dotenv = require("dotenv").config();
const express =require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productRoute")
const contactUsRoute = require("./routes/contactUsRoute")
const errorHandler = require("./middleWare/errorMiddleware")
const cookieParser = require("cookie-parser")
const path = require("path")
const app = express()
//Midlewares
 app.use(express.json())
 app.use(express.urlencoded({extended: false}))
 app.use(bodyParser.json())
// file upload midellware
 app.use('/uploads/product', express.static(path.join( __dirname,'uploads/product')))
 // enable cookie parser
 app.use(cookieParser());

 //Route Midleware
 app.use("/api/users", userRoute);
 app.use('/api/products', productRoute)
 app.use('/api/contactus', contactUsRoute)
 //Errorhandling Middleware
 app.use(errorHandler)


//Routes
app.get('/', (req, res)=>{
    res.send("Home Page")
})
const PORT = process.env.PORT || 3001

mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            app.listen(PORT, () =>{
                console.log(`Server runing ${PORT}`)
            })
        })
        .catch((err) => console.log(err.message))
