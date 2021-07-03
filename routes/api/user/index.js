const  router=require("express").Router();


const User=require("../../../models").User;
const Room=require("../../../models").Room;



 
 router.get("/",(req,res)=>{
     res.send("User Route Is Working");
     });



router.post("/room",async(req,res)=>{
    try {
        const user=await Room.insertMany(req.body);
        return res.json(user);
        
    } catch (error) {
        res.json(error)
    }
});



 router.post("/book",async(req,res)=>{
       
        try {
             const room=new Room(req.body);
            const checkRoom=await Room.findById({ _id:req.body.bookingDetails});
            if(checkRoom.hall_booking ==""){
              let startDate=new Date(`${req.body.startDate}`);
              let endDate=new Date(`${req.body.endDate}`);
              let start=new Date(`${req.body.startDate}`+`${req.body.startTime}`);
              let end=new Date(`${req.body.endDate}`+`${req.body.endTime}`);
              let now=new Date();
              if(start<now){
                  return res.json({msg:"Date is expired"});
              }
              if(end <= start){
                  return res.json({msg:"Date not found"});
              }
              if(startDate=="Invalid Date" || endDate=="Invalid Date"){
                  return res.json({msg:"Invalid Date"});
              }
              else{
                  const user=new User(req.body);
                  const session=await User.startSession();
                  const userDetails=await user.save({session:session});
                  const roomDetails=await Room.findByIdAndUpdate(
                  {_id:userDetails.bookingDetails},
                  {
                  $addToSet:{ hall_booking : userDetails._id},
                  },    
             {new:true},
          
        ).session(session);
            
         res.json({user:userDetails,room:roomDetails});
        }
    }else{
 
        if(checkRoom.hall_booking){
            const room=await User.find({_id:checkRoom.hall_booking});
   
            let startDate=new Date(`${req.body.startDate}`);
            let endDate=new Date(`${req.body.endDate}`);
            let start=new Date(`${req.body.startDate}`+`${req.body.startTime}`);
            let end=new Date(`${req.body.endDate}`+`${req.body.endTime}`);
            let now=new Date();
     
            if(start<now){
                return res.json({msg:"Date is expired"});
            }
            if(end<=start){
                return res.json({msg:"Date not found"});
            }
            if(startDate=="Invalid Date" || endDate=="Invalid Date"){
                return res.json({msg:"Invalid Date"});
            }
            console.log(room);
          const roomcheck=room.find((room)=>{
           
            let d0=new Date(`${room.startDate}`+`${room.startTime}`);
            let d1=new Date(`${room.endDate}`+`${room.endTime}`);
    
              let d2=new Date(`${req.body.startDate}`+`${req.body.startTime}`);
              let d3=new Date(`${req.body.endDate}`+`${req.body.endTime}`);

              if((d2<d0 && d3<=d0) || (d2<d1 && d3<=d1)){
                  return true
              }

          });
  
console.log(!roomcheck);
        if(roomcheck)  { 
         
                return res.json({msg:"room is already booked"});
             }
             else{
            
          const user=new User(req.body);
          const session=await User.startSession();
          const userDetails=await user.save({session:session});
         const roomDetails=await Room.findByIdAndUpdate(
        {_id:userDetails.bookingDetails},
         {
              $addToSet:{ hall_booking : userDetails._id},
           },    
           {new:true},
        
      ).session(session);
          
        return res.json({user:userDetails,room:roomDetails});
      }
  }
    }
            }catch (error) {
            res.json(error) ;
         }
         });

    router.get("/all/customers",async(req,res)=>{
        try {
            const user=await User.find({}).populate("booking",["name","location","price","amentities"])
            res.json(user);
        } catch (error) {
             res.json(error); 
        }
       ;
    });

    router.get("/all/rooms",async(req,res)=>{
        try {
            const user=await Room.find({}).populate("hall_booking",["customername","date","start","end","status"]);
            res.json(user);
        } catch (error) {
            res.json(error);
        }
       
    });

    
module.exports=router;