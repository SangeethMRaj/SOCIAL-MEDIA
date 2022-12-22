const { Server } = require("socket.io");

const io = new Server({ 
    cors:{
        origin:"http://localhost:3000"
    }
 });

 let onlineUsers = [];
// console.log(onlineUsers,'onlineUsers');
 const addNewUser = (username,socketId)=>{
    console.log(username,'username in addnewuser');
    !onlineUsers.some(user=>user.username === username) &&
    onlineUsers.push({username,socketId})
 }

 const removeUser = (socketId)=>{
    onlineUsers = onlineUsers.filter((user)=>user.socketId !== socketId)
 }

 const getUser = (username)=>{             
    console.log(username,'username in getUser');
    return onlineUsers.find((user)=>user.username === username);
 }
               
 io.on("connection",(socket)=>{
    socket.on("newUser",(username)=>{
        console.log(username,'username in new user');
        addNewUser(username,socket.id)
    })

    socket.on("sendNotification",({senderName,receiverName,type,image})=>{
        console.log(senderName,receiverName,type,'check in socket');
        const receiver = getUser(receiverName)
        console.log(receiver,'lplplplplplplplplp');
        io.to(receiver?.socketId).emit("getNotification",{
            senderName,
            type,
            image
        })     
    })
    // console.log("connection successful");
    socket.on("disconnect",()=>{
        removeUser(socket.id);
        // console.log("connection disconnected");
    })
 })
                     
 io.listen(9000); 