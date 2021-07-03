const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    customername:{
        type:String,
        required:true,
    },
   
    date:{
        type:Date,
        default:Date.now(),
        required:true,
       
    },
    startDate:{
        type:String,
        required:true,
    },
    endDate:{
        type:String,
        required:true,
    },
    startTime:{
        type:String,
        required:true,
    },
    endTime:{
        type:String,
        required:true,
    },
    bookingDetails:{
        type:mongoose.Types.ObjectId,
        ref:"rooms",
    },
    status:{
        type:String,
        required:true,
    },
   
},{
    timestamps:true,
});
const User=mongoose.model("users",userSchema);

module.exports=User;