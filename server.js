const express = require("express");
const socketio = require("socket.io");
const formatMessage = require('./public/js/utility/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./public/js/utility/users');
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'ChatBot'

// Joins the static files
app.use(express.static(path.join(__dirname, "public")));

// Runs when client connects
io.on("connection", (socket) => {
  //   console.log("New Connection");
 
  socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id,username,room)
  
    socket.join(user.room)
  

  socket.emit("message",formatMessage(botName,"Welcome to ChatCord!!"));

  //Broadcast when user connects
  socket.broadcast.to(user.room).emit("message",formatMessage(botName,`${user.username} has joined the chat! `));

  // Send users and room info
  // console.log(getRoomUsers(user.room));
  io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
  })
  

})
  // Listen for chatMessage 
  socket.on("chatMessage", (msg) => {
    // console.log(msg);
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message',formatMessage(user.username,msg))
  });


//    when user disconnects the chat
socket.on("disconnect", () => {
  const user = userLeave(socket.id)
  if(user){
    io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
    // Send users and room info
  io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getCurrentUser(user.room)
  })
  }
  
  
});


});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Your Server is running at ${PORT}`));
