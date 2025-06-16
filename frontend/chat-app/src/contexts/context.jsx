import React, { useContext, createContext, useState, useEffect } from "react";
import { io } from 'socket.io-client'

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {

   const baseURL = 'https://mern-chat-app-r0lj.onrender.com'
   const [socket, setSocket] = useState(null);
   const [onlineUsers, setOnlineUsers] = useState([]);

   /*-----------------------for socket connection------------------------------------*/

   const connectSocket = () => {
      if (!socket) {
         const newSocket = io(baseURL, {
            transports: ["websocket"],
            auth: {
               userId: localStorage.getItem("userId")  
            }
         });

         newSocket.on('AllOnlineUSers', (userIds) => {
            setOnlineUsers(userIds);  
         });

         setSocket(newSocket);
      }
   };
   useEffect(()=>{
      connectSocket();
   },[])
   useEffect(() => {
      if (!socket) return;

      socket.on("connect", () => console.log("Socket connected:", socket.id));
      socket.on("disconnect", () => console.log("Socket disconnected"));

      return () => socket.disconnect();
   }, [socket]);

   /*-----------------------for socket connection------------------------------------*/

   return (
      <ApiContext.Provider value={{ baseURL,socket, connectSocket, onlineUsers }}>
         {children}
      </ApiContext.Provider>
   )
}

export const useApi = () => useContext(ApiContext)