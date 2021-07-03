const mongoose=require("mongoose");

const roomSchema= new mongoose.Schema({
  name:{
      type:String,
      required:true,
  },
  location:{
    type:String,
    required:true,
},   
        seats: {
            type:Number,
            required:true,
        },
    
        price:{
                type:Number,
                required:true,
            },

     
            amentities:[],
            hall_booking:[{
                type:mongoose.Types.ObjectId,
                ref:"users",
            }]
   
    
},{
    timestamps:true,
});

const Room=mongoose.model("rooms",roomSchema);
module.exports=Room;