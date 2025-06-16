import express from "express";
import authRoute from "./Routes/authRoute.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/connect.js";
import cookieParser from "cookie-parser";
import messageRoute from "./Routes/messageRoute.js";
import { server,app } from "./lib/socket.js";

const PORT = 5000;
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRoute);
app.use("/", messageRoute);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB(process.env.MONGODB_URL);
});

//https://mern-chat-app-r0lj.onrender.com

// https://mern-chat-app-frontend-g2uc.onrender.com