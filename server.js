const dotenv = require("dotenv").config();
const express =require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute")
const errorHandler = require("./middleWare/errorMiddleware")
const cookieParser = require("cookie-parser")
const app = express()
//Midlewares
 app.use(express.json())
 app.use(express.urlencoded({extended: false}))
 app.use(bodyParser.json())

 // enable cookie parser
 app.use(cookieParser());

 //Route Midleware
 app.use("/api/users", userRoute);
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
