import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { FaImages } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import axios from 'axios';
import { useApi } from '../../contexts/context';
import toast from 'react-hot-toast';

const Chat = ({ particularChat }) => {
    const fileInputRef = useRef();
    const messagesEndRef = useRef(null);
    const { baseURL, socket } = useApi();
    const [text, setText] = useState('');
    const senderId = localStorage.getItem('myId');
    const [allMessages, setAllMessages] = useState([]);
    const [file, setfile] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchAllMessages = async () => {
        try {
            const response = await axios.post(`${baseURL}/allMessages`, { myId: senderId, toChatId: particularChat._id }, { withCredentials: true });
            setAllMessages(response.data.messages);
        } catch (error) {
            console.log("Error fetching messages", error);
        }
    };

    useEffect(() => {
        fetchAllMessages();
    }, [particularChat, senderId]);

    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    useEffect(() => {
        if (!socket) return;

        // ✅ Listen for messages sent by others
        socket.on("receive_message", (message) => {
            // Only add if message is from the current chat partner
            if (message.senderId === particularChat._id || message.recieverId === particularChat._id) {
                setAllMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off("receive_message");
        };
    }, [socket, particularChat]);


    const handleSendMessage = async () => {
        try {
            if (text.length || file) {
                const formData = new FormData();
                formData.append("senderId", senderId);
                formData.append("recieverId", particularChat._id);
                formData.append("text", text);
                formData.append("file", file);

                const response = await axios.post(`${baseURL}/send-message`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
                if (response.data.success) {
                    const newMessage = response.data.newMessage;
                    socket.emit("send_message", newMessage); 
                    setAllMessages((prev) => [...prev, newMessage]); 
                    setText('');
                    setfile('');
                    fetchAllMessages();
                }
            }
        } catch (error) {
            console.log("Error sending message", error);
        }
    };

    return (
        <div className='chat-container'>
            {particularChat._id ? (<div className='chat-person-detail'>
                <div className='allUser-image-container'>
                    {particularChat.profileImage&& <img src={particularChat.profileImage} alt="" />}
                </div>
                <div>
                    <h6 style={{ fontSize: "1.9rem" }}>{particularChat.name}</h6>
                    <p style={{ fontSize: "1rem" }}></p>
                </div>
            </div>) : <div className='chat-person-detail'></div>}

            <div className='chatBody'>
                {particularChat._id ? (allMessages?.map((message, index) => (
                    <div key={index} className={message.senderId === senderId ? 'sent-message' : 'received-message'}>
                        <p>{message.text}</p>
                        {message.image && <img src={message.image} alt="sent" className="message-image" />}
                        <p style={{ fontSize: '1rem' }}>{new Date(message.createdAt).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}</p>

                    </div>
                ))) : <h3>Choose a friend to chat</h3>}
                {file && <img src={URL.createObjectURL(file)} style={{ alignSelf: 'center' }} alt="preview" width={200} />}
                <div ref={messagesEndRef} />
            </div>

            {particularChat._id && <div className='chat-input'>
                <input
                    type="text"
                    placeholder='type message...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <IoIosSend className='send-logo' onClick={handleSendMessage} size={50} color='aqua' />
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => setfile(e.target.files[0])} />
                <FaImages type='file' onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }} size={50} color='aqua' />
            </div>}
        </div>
    );
};

export default Chat;
