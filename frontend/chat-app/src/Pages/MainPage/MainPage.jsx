import React from 'react'
import './MainPage.css'
import Navbar from '../../Components/Navbar/Navbar'
import { useState } from 'react'
import Profile from '../../Components/Profile/Profile'
import { useLocation } from 'react-router-dom'
import Chat from '../../Components/Chat/Chat'
import UserList from '../../Components/UserList/UserList'

const MainPage = () => {
    const location = useLocation();
    const {user} = location.state || {};
    localStorage.setItem('myId',user?._id);
    const [particularChat, setParticularChat] = useState({});
    const [profileActive, setProfileActive] = useState(false);
    return (
        <div>
            <Navbar setProfileActive={setProfileActive} />
            <div className='mainpage-container'>
                <UserList selfData={user} setParticularChat={setParticularChat}/>
                <Chat particularChat={particularChat}/>
                {profileActive && <Profile setProfileActive={setProfileActive} selfData={user}/>}
            </div>
        </div>
    )
}

export default MainPage
