// const io = require('socket.io')(8000,{
//     cors:{
//         origin:"http://localhost:3000"
//     }
// })

// io.on("connection",(socket)=>{
//     console.log("user connected");
// })


const { Server } = require("socket.io");

const io = new Server({ 
    cors:{
        origin:"http://localhost:3000"
    }
 });

 let users = [];

 const addUser = (userId,socketId,name)=>{
    !users.some((user)=>user.userId === userId) &&
    users.push({ userId,socketId,name})
 }          

 const removeUser = (socketId)=>{
    users = users.filter((user)=>user.socketId !== socketId)
 }

 const getUser = (userId)=>{   
    console.log(users,'users check');  
    return users.find((user)=>user.userId === userId) 
 } 
     
io.on("connection", (socket) => {
  console.log('user connected');
  socket.on("addUser",(userId,name)=>{ 
    console.log(userId,socket.id,'in adduser');
    addUser(userId,socket.id,name)     
    io.emit("getUsers",users)                  
  })    
 
          
  socket.on("sendMessage",({senderId,receiverId,text})=>{
    console.log(senderId,receiverId,text,'check');
    const user =  getUser(receiverId)
    console.log(user,'helloooooooooooooooo'),    
    io.to(user?.socketId).emit("getMessage",{  
        senderId,          
        text,                   
    })
  }) 
      
              
  socket.on("disconnect",()=>{
    console.log('a user disconnected');
    removeUser(socket.id)           
    io.emit("getUsers",users)                          
  })    
});    

io.listen(8000);             