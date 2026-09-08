const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs")
const cors = require("cors");
const jwt = require("jsonwebtoken"); 


const user = require("./db")

const app = express();


// middleware 
app.use(express.json());
app.use(cors());


//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/databse").then(() => {
    console.log("mongoDB Connected!!")
})



//signUp
app.post("/signup" , async (req , res)=> {
    const {name , email , password , role} = req.body;

    const userExists = await user.findOne({email});

    if(userExists) {
        return res.send("user already exists");
    } 

    let SecPassword = await bcryptjs.hash(password , 10);
    let UserInfo = new user({
        name , email , password:SecPassword , role : role ||"user" 
    })

    await UserInfo.save();
    res.send("Youre officially signed In!!")
})



app.post("/login" , async (req , res) => {
    let {email , password} = req.body;
    let Finduser = await user.findOne({email});

    if(!Finduser) {
        return res.send("User Not Found , SignUp instead");
    }

    let isPassValid = await bcryptjs.compare(password , Finduser.password);

    if(!isPassValid) {
        return res.send("invalid Password");
    }

    let token = jwt.sign({email:Finduser.email , role:Finduser.role }, "secretKey123");
    console.log(token);

    res.json({ token: token, message: "Logged In!" });

})

//auth

let auth = (req , res , next) => {
    let token = req.headers.authorization;

    if(!token) {
        res.send("token not found");
    }

    let decoded = jwt.verify(token , "secretKey123");
    req.user = decoded;
    next()

}


app.get("/dashboard" ,auth ,  (req , res) => {
    if(req.user.role !== "admin") {
        return res.send("youre not a admin");
    }
    return res.send("Welcome Admin");
})

app.listen(3000 , () => {
    console.log("server is running");
})


