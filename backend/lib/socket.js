import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
const server = http.createServer(app);



app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true
  }
});
 
const onlineUserId = {}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.auth.userId;
  console.log(userId, "Id");

  if (userId) onlineUserId[userId] = socket.id;
  console.log(onlineUserId, "object of all ids from backend");

  // 🔴 BROADCAST online users to all clients
  io.emit('AllOnlineUSers', Object.keys(onlineUserId));

  // ✅ LISTEN for message sent from client
  socket.on("send_message", (data) => {
    const { recieverId } = data;
    const receiverSocketId = onlineUserId[recieverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", data);
    }
  });

  // 🧹 On disconnect, clean up user
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete onlineUserId[userId];
    io.emit('AllOnlineUSers', Object.keys(onlineUserId));
    console.log(onlineUserId, "object of all ids from backend after disconnect");
  });
});


export { io, app, server };
