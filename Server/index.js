const express = require('express')
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const messageRoutes = require('./Routes/messageRouter')
const cors = require('cors');
const User = require('./models/userModel');
const Message = require('./models/messageModel');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
// const { socket } = require('socket.io');
const path = require('path');


const app = express();
app.use(cors())
dotenv.config();
app.use(express.json())
const connectDb = async()=> {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log('server is connected to db');
    }
    catch(err){
        console.log("server is not connected",err.message);
    }
}
connectDb();


app.use("/user",userRoutes)
app.use("/chat",chatRoutes)
app.use("/message",messageRoutes)

// ----------------------------------------deployemnet------------------------------------------------
const __dirname1 = path.resolve()
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1,'/client/build')))

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"client","build","index.html"))
  })
}else{
  app.get('/', (req, res) =>{
    res.send("api is running")
});
}
// ----------------------------------------deployemnet----ir--------------------------------------------

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}`);
})

// Existing code...

const io = require("socket.io")(server,{
  pingTimeout:120000,
  cors:{
    origin:"http://localhost:3000"
  },
})

io.on("connection",(socket)=>{
  console.log("connected to socket io");

  // setup for user socket
  socket.on('setup',(userData)=>{
    socket.join(userData._id)
    socket.emit('connected');
  })

  // join chat
  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("user joined chat room: " + room);
  })
// typing
  socket.on('typing',(room)=>{
    socket.in(room).emit('typing');
  })
// stop typing
  socket.on('stop typing',(room)=>{
    socket.in(room).emit('stop typing');
  })

  // message reaction
   // Listen for 'reactToMessage' events from clients
   socket.on('reactToMessage', async (data) => {
    const { messageId, reactionEmoji } = data;

    try {
      // Perform the logic with the messageId and reactionEmoji here
      const reactedMessage = await Message.findByIdAndUpdate(
        messageId,
        { $set: { reaction: reactionEmoji } },
        { new: true }
      );

      if (reactedMessage) {
        // Emit an event to notify other clients about the reaction
        io.emit('messageReaction', { messageId, reactionEmoji });
        // Respond to the client that triggered the reaction event if needed
        socket.emit('reactionSuccess', { status: 200, message: 'Reaction added successfully' });
      } else {
        socket.emit('reactionError', { status: 404, message: 'Message not found' });
      }
    } catch (error) {
      socket.emit('reactionError', { status: 500, message: error.message });
    }
  });

  // send message or new message
  socket.on('newMessage',(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat

    if(!chat.users) return console.log("chat users not defined")

    chat.users.forEach(user=>{
      if(user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message Recieved",newMessageRecieved)
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

})







// socket.on("new message", (newMessageRecieved) => {
//   var chat = newMessageRecieved.chat;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageRecieved.sender._id) return console.log("user");

//     //   socket.in(user._id).emit("message recieved", newMessageRecieved);
//       socket.emit("message recieved", newMessageRecieved);
//     });
//   });


  // socket.off("setup", () => {
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userData._id);
  // });




