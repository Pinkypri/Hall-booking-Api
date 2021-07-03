const express=require("express");
const app=express();
const dotenv=require("dotenv");

const connectDB = require("./config/db");

dotenv.config({path:"./config/config.env"});
connectDB();
const apiRouter=require("./routes");


app.use(express.json());

app.use("/",apiRouter);

app.get("/",(req,res)=>{
    res.send("Its working");
});

app.listen(5000,()=>{
    console.log("server has been started port on 5000");
});