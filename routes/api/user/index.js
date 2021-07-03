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


router.post("/book", async (req, res) => {
    try {
      const room = new Room(req.body);
      const checkRoom = await Room.findById({ _id: req.body.bookingDetails });
  
      if (checkRoom.hall_booking == "") {
        var startDate = new Date(`${req.body.startDate}`);
        var endDate = new Date(`${req.body.endDate}`);
          
  
        var start = new Date(`${req.body.startDate} ` + `${req.body.startTime}`);
        var end = new Date(`${req.body.endDate} ` + `${req.body.endTime}`);
  
        var now = new Date();
        
        if(start<now){
            return res.json({msg:" date is expired"})
        }
  
        if (end <= start) {
          return res.json({ msg: "date not found"});
        }
  
        if (startDate == "Invalid Date" || endDate == "Invalid Date") {
          return res.json({ msg: "invalid date" });
        } else {
          let user = new User(req.body);
          let session = await User.startSession();
  
          let userDetails = await user.save({ session: session });
          let roomDetails = await Room
            .findByIdAndUpdate(
              { _id: req.body.bookingDetails },
              {
                $addToSet: { hall_booking: user.id },
              },
              { new: true }
            )
            .session(session);
  
          res.json({ user: userDetails, room: roomDetails });
        }
      } else {
         
        if (checkRoom.hall_booking) {
          const room = await User.find({ _id: checkRoom.hall_booking });
      
  
          var startDate = new Date(`${req.body.startDate}`);
          var endDate = new Date(`${req.body.endDate}`);
  
          var start = new Date(
            `${req.body.startDate} ` + `${req.body.startTime}`
          );
          var end = new Date(`${req.body.endDate} ` + `${req.body.endTime}`);
  
  
          var now = new Date();
          
          if(start<now){
              return res.json({msg:"date is expired"});
          }
  
          if (end <= start) {
            return res.json({msg: "date is wrong"});
          }
  
          if (startDate == "Invalid Date" || endDate == "Invalid Date") {
            return res.json({ msg: "invalid date" });
          }
  
          const roomCheck = room.find((room) => {
            var start = new Date(`${room.startDate} ` + `${room.startTime}`);
            var end = new Date(`${room.endDate} ` + `${room.endTime}`);
  
            var userstart = new Date(`${req.body.startDate} ` + `${req.body.startTime}`);
            var userend = new Date(`${req.body.endDate} ` + `${req.body.endTime}`);
  
            if ((userstart < start && userend <= start) || (userstart < end && userend <=end)) {
              return true;
            }
          });
                      
         
          if (roomCheck) {

            return res.json({msg:"Sorry,  Room is already booked on this date and time."});
          } else {
            let user = new User(req.body);
            let session = await User.startSession();
  
            let userDetails = await user.save({ session: session });
            let roomDetails = await Room
              .findByIdAndUpdate(
                { _id: req.body.bookingDetails },
                {
                  $addToSet: { hall_booking: user.id },
                },
                { new: true }
              )
              .session(session);
            return res.json({ user: userDetails, room: roomDetails });
          }
        }
      }
    } catch (error) {
      res.json({ error });
    }
  });
  

    router.get("/all/customers",async(req,res)=>{
        try {
            const user=await User.find({}).populate({path:"bookingDetails",select:"name location seats price amentities -_id"})
            .select("-__v -_id  -createdAt -updatedAt");
            res.json(user);
        } catch (error) {
             res.json(error); 
        }
       ;
    });

    router.get("/all/rooms",async(req,res)=>{
        try {
            const user=await Room.find({}).populate({path:"hall_booking",select:"customername date startTime endTime status -_id"})
            .select("-__v -_id  -createdAt -updatedAt");
            res.json(user);
        } catch (error) {
            res.json(error);
        }
       
    });

    
module.exports=router;